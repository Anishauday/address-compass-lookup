export type AddressRecord = {
  TRACKNUM: string;
  ZIP: string;
  CITY: string;
  STREET: string;
  TYPE: string;
  LOW: string;
  HIGH: string;
  PPC: string;
  ALT_PPC?: string;
  FS?: string;
  RISK_CATEGORY?: string;
};

const TYPE_SET = new Set(['RD', 'ST', 'AVE', 'DR', 'LN', 'BLVD', 'CT', 'WAY', 'PL', 'PKWY', 'TUNL']);
const ALLOWED_STREET_TOKENS = new Set(['US', 'FM', 'SH', 'CR', 'COUNTY', 'ROAD', 'HWY', 'HIGHWAY', 'STATE', 'LINE', 'AIRPORT', 'TUNNEL', 'PLAZA', 'TOLL']);

// Map PPC values to risk categories
export function mapRiskCategory(ppc: string): string {
  if (!ppc) return 'Unknown';
  
  // High risk: 10, 5X/10W/10, N/A
  if (ppc === '10' || ppc.includes('5X/10W/10') || ppc === 'N/A') {
    return 'High Risk';
  }
  
  // Moderate risk: 5X, 10W, 5X/10W, 10W/10
  if (ppc === '5X' || ppc === '10W' || ppc.includes('5X/10W') || ppc.includes('10W/10')) {
    return 'Moderate Risk';
  }
  
  // Low risk: 1-5, 5/5X
  if (/^[1-5]$/.test(ppc) || ppc.includes('5/5X')) {
    return 'Low Risk';
  }
  
  // Default to moderate risk for other patterns
  return 'Moderate Risk';
}

function parseSmartLine(line: string): AddressRecord {
  const result: AddressRecord = {
    TRACKNUM: '',
    ZIP: '',
    CITY: '',
    STREET: '',
    TYPE: '',
    LOW: '',
    HIGH: '',
    PPC: '',
    ALT_PPC: '',
    FS: '',
    RISK_CATEGORY: '',
  };

  const tokens = line.trim().split(/\s+/);
  const n = tokens.length;

  // 1. TRACKNUM
  if (tokens[0]?.match(/R\d+_\d+/)) {
    result.TRACKNUM = tokens[0];
  }

  // 2. ZIP
  const zipCandidates = tokens.filter(t => t.match(/^\d{5}$/));
  if (zipCandidates.length > 0) {
    result.ZIP = zipCandidates[0];
  }

  // 3. CITY
  if (result.ZIP) {
    const zipIdx = tokens.indexOf(result.ZIP);
    if (zipIdx + 1 < n) {
      result.CITY = tokens[zipIdx + 1];
    }
  }

  // 4. TYPE
  let typeIdx = -1;
  for (let i = 0; i < tokens.length; i++) {
    if (TYPE_SET.has(tokens[i].toUpperCase())) {
      result.TYPE = tokens[i].toUpperCase();
      typeIdx = i;
      break;
    }
  }

  // 5. STREET
  if (typeIdx > 0) {
    let j = typeIdx - 1;
    const streetParts = [];
    while (j >= 0) {
      const token = tokens[j];
      if (TYPE_SET.has(token.toUpperCase())) break;
      
      if (token.toUpperCase().match(/^[A-Z0-9\-]+$/) || 
          ALLOWED_STREET_TOKENS.has(token.toUpperCase())) {
        streetParts.unshift(token);
      } else {
        break;
      }
      j--;
    }
    if (streetParts.length > 0) {
      result.STREET = streetParts.join(' ');
    }
  }

  // 6. LOW and HIGH
  if (typeIdx !== -1) {
    const numberTokens = tokens
      .slice(typeIdx + 1)
      .filter(t => !isNaN(Number(t)) && Number(t) >= 100 && Number(t) <= 99999);
    
    if (numberTokens.length >= 2) {
      result.LOW = numberTokens[0];
      result.HIGH = numberTokens[1];
    }
  }

  // Extract PPC and ALT_PPC with improved regex
  try {
    // First check for complex patterns like 5X/10W/10
    const complexPpcPattern = /\b(5X\/10W\/10)\b/i;
    const complexMatch = line.match(complexPpcPattern);
    
    if (complexMatch) {
      // If we found a complex pattern like 5X/10W/10, use it as ALT_PPC
      result.ALT_PPC = complexMatch[0];
      
      // For cases with 5X/10W/10, the primary PPC is 5
      result.PPC = '5';
    } else {
      // Check for simpler ALT_PPC patterns like 5X/10W
      const altPpcPattern = /\b(5X\/10W|10W\/10)\b/i;
      const altMatch = line.match(altPpcPattern);
      
      if (altMatch) {
        result.ALT_PPC = altMatch[0];
        
        // For 5X/10W, the primary PPC is 5
        // For 10W/10, the primary PPC is unclear, but we'll default to 5
        result.PPC = '5';
      } else {
        // If no complex patterns found, look for standalone PPC values
        
        // First, look for numbers 1-10 (primary PPCs)
        const basicPpcPattern = /\b([1-9]|10)\b(?!\w)/;
        const basicMatch = line.match(basicPpcPattern);
        
        if (basicMatch) {
          result.PPC = basicMatch[0];
        }
        
        // Then check for standalone 5X or 10W (these are alternative representations)
        const modifierPattern = /\b(5X|10W)\b(?!\w|\/)/;
        const modifierMatch = line.match(modifierPattern);
        
        if (modifierMatch) {
          if (!result.PPC) {
            result.PPC = '5';  // Default to 5 if we found 5X but no primary PPC
          }
          result.ALT_PPC = modifierMatch[0];
        }
      }
    }
    
    // Special handling for the specific case shown in the image
    if (line.includes('5X/10W/10')) {
      result.PPC = '5';
      result.ALT_PPC = '5X/10W/10';
    }
  } catch (error) {
    console.error('Error parsing PPC/ALT_PPC:', error);
  }

  // Extract FS (Fire Station)
  try {
    const fsPattern = /\b[A-Z]+\s+(?:V)?FS\s+\d+\b/i;
    const fullLine = line.toUpperCase();
    const fsMatch = fullLine.match(fsPattern);
    
    if (fsMatch) {
      result.FS = fsMatch[0];
    }
  } catch (error) {
    console.error('Error parsing FS:', error);
  }

  // Map risk category based on PPC and ALT_PPC
  if (result.ALT_PPC && result.ALT_PPC.toUpperCase().includes('5X/10W/10')) {
    result.RISK_CATEGORY = 'High Risk';
  } else if (result.ALT_PPC && (
      result.ALT_PPC.toUpperCase().includes('5X/10W') || 
      result.ALT_PPC.toUpperCase().includes('10W/10'))) {
    result.RISK_CATEGORY = 'Moderate Risk';
  } else if (result.PPC) {
    result.RISK_CATEGORY = mapRiskCategory(result.PPC);
  }

  return result;
}

export type SearchResults = {
  exactMatches: AddressRecord[];
  nearMatches: AddressRecord[];
};

export async function parseFile(file: File): Promise<AddressRecord[]> {
  const validTypes = ['text/csv', 'text/plain', 'application/csv', 'application/vnd.ms-excel'];
  if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
    throw new Error('Invalid file type. Please upload a CSV or TXT file.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines[0]?.includes('TRACKNUM')) {
          lines.shift();
        }
        
        const records = lines
          .map(line => parseSmartLine(line))
          .filter(record => record.TRACKNUM && record.ZIP);
        
        resolve(records);
      } catch (error) {
        reject(new Error('Failed to process text file. Please check the format.'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
}

export function findMatches(
  records: AddressRecord[],
  criteria: {
    zipCode: string;
    city: string;
    street?: string;
    streetType?: string;
    doorNumber?: string;
  }
): SearchResults {
  const { zipCode, city, street, streetType, doorNumber } = criteria;
  const exactMatches: AddressRecord[] = [];
  const nearMatches: AddressRecord[] = [];

  // First, try to find exact matches
  for (const record of records) {
    // Skip if ZIP or city don't match
    if (record.ZIP !== zipCode || record.CITY.toUpperCase() !== city.toUpperCase()) {
      continue;
    }

    let isExactStreetMatch = true;
    
    // Check street name if provided
    if (street && !record.STREET.toUpperCase().includes(street.toUpperCase())) {
      isExactStreetMatch = false;
    }

    // Check street type if provided
    if (streetType && record.TYPE.toUpperCase() !== streetType.toUpperCase()) {
      isExactStreetMatch = false;
    }

    // If door number is provided, check range
    if (doorNumber && record.LOW && record.HIGH) {
      const doorNum = parseInt(doorNumber);
      const low = parseInt(record.LOW);
      const high = parseInt(record.HIGH);

      if (low <= doorNum && doorNum <= high && isExactStreetMatch) {
        exactMatches.push(record);
        continue;
      }

      // If address number is within ±200 range, consider it a near match
      if (
        (Math.abs(doorNum - low) <= 200 || Math.abs(doorNum - high) <= 200) &&
        isExactStreetMatch
      ) {
        nearMatches.push({
          ...record,
          RISK_CATEGORY: 'Approximate ' + (record.RISK_CATEGORY || 'Unknown Risk')
        });
      }
    } else if (isExactStreetMatch) {
      // If no door number provided but street matches
      exactMatches.push(record);
    }
  }

  // If no exact matches found, look for similar streets in the same ZIP code
  if (exactMatches.length === 0 && street) {
    for (const record of records) {
      if (record.ZIP !== zipCode) continue;
      
      // Use Levenshtein distance or similar string matching for street names
      const similarity = calculateStringSimilarity(
        street.toUpperCase(),
        record.STREET.toUpperCase()
      );
      
      if (similarity >= 0.7) { // 70% similarity threshold
        nearMatches.push({
          ...record,
          RISK_CATEGORY: 'Approximate ' + (record.RISK_CATEGORY || 'Unknown Risk')
        });
      }
    }
  }

  return { exactMatches, nearMatches };
}

// Helper function to calculate string similarity (simple implementation)
function calculateStringSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1.0; // Both strings are empty
  
  let matches = 0;
  const minLength = Math.min(str1.length, str2.length);
  
  // Compare characters
  for (let i = 0; i < minLength; i++) {
    if (str1[i] === str2[i]) matches++;
  }
  
  return matches / maxLength;
}
