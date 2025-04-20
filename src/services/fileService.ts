
export type AddressRecord = {
  TRACKNUM: string;
  ZIP: string;
  CITY: string;
  STREET: string;
  TYPE: string;
  LOW: string;
  HIGH: string;
  PPC: string;
};

const TYPE_SET = new Set(['RD', 'ST', 'AVE', 'DR', 'LN', 'BLVD', 'CT', 'WAY', 'PL', 'PKWY', 'TUNL']);
const ALLOWED_STREET_TOKENS = new Set(['US', 'FM', 'SH', 'CR', 'COUNTY', 'ROAD', 'HWY', 'HIGHWAY', 'STATE', 'LINE', 'AIRPORT', 'TUNNEL', 'PLAZA', 'TOLL']);

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

  // 7. PPC
  const ppcPattern = /^\d{1,2}[WX]?$|^\d{1,2}\/\d{1,2}[WX]?$/;
  try {
    const startIdx = result.ZIP ? tokens.indexOf(result.ZIP) + 7 : 0;
    for (const token of tokens.slice(startIdx)) {
      if (ppcPattern.test(token)) {
        result.PPC = token;
        break;
      }
    }
  } catch (error) {
    console.error('Error parsing PPC:', error);
  }

  return result;
}

export async function parseFile(file: File): Promise<AddressRecord[]> {
  // Validate file type
  const validTypes = ['text/csv', 'text/plain', 'application/csv', 'application/vnd.ms-excel'];
  if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
    throw new Error('Invalid file type. Please upload a CSV or TXT file.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        // Split into lines and remove empty lines
        const lines = text.split('\n').filter(line => line.trim());
        
        // Remove header if present
        if (lines[0]?.includes('TRACKNUM')) {
          lines.shift();
        }
        
        // Parse each line
        const records = lines
          .map(line => parseSmartLine(line))
          .filter(record => record.TRACKNUM && record.ZIP); // Filter out invalid records
        
        resolve(records);
      } catch (error) {
        reject(new Error('Failed to process text file. Please check the format.'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
}
