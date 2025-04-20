
import { AddressRecord } from '@/types/address';
import { TYPE_SET, ALLOWED_STREET_TOKENS } from '@/constants/addressConstants';
import { mapRiskCategory } from './riskMapping';

export function parseSmartLine(line: string): AddressRecord {
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

  // Parse TRACKNUM
  if (tokens[0]?.match(/R\d+_\d+/)) {
    result.TRACKNUM = tokens[0];
  }

  // Parse ZIP
  const zipCandidates = tokens.filter(t => t.match(/^\d{5}$/));
  if (zipCandidates.length > 0) {
    result.ZIP = zipCandidates[0];
  }

  // Parse CITY
  if (result.ZIP) {
    const zipIdx = tokens.indexOf(result.ZIP);
    if (zipIdx + 1 < n) {
      result.CITY = tokens[zipIdx + 1];
    }
  }

  // Parse TYPE and STREET
  let typeIdx = -1;
  for (let i = 0; i < tokens.length; i++) {
    if (TYPE_SET.has(tokens[i].toUpperCase())) {
      result.TYPE = tokens[i].toUpperCase();
      typeIdx = i;
      break;
    }
  }

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

  // Parse LOW and HIGH
  if (typeIdx !== -1) {
    const numberTokens = tokens
      .slice(typeIdx + 1)
      .filter(t => !isNaN(Number(t)) && Number(t) >= 100 && Number(t) <= 99999);
    
    if (numberTokens.length >= 2) {
      result.LOW = numberTokens[0];
      result.HIGH = numberTokens[1];
    }
  }

  // Parse PPC and ALT_PPC
  try {
    const complexPpcPattern = /\b(5X\/10W\/10)\b/i;
    const complexMatch = line.match(complexPpcPattern);
    
    if (complexMatch) {
      result.ALT_PPC = complexMatch[0];
      result.PPC = '5';
    } else {
      const altPpcPattern = /\b(5X\/10W|10W\/10)\b/i;
      const altMatch = line.match(altPpcPattern);
      
      if (altMatch) {
        result.ALT_PPC = altMatch[0];
        result.PPC = '5';
      } else {
        const basicPpcPattern = /\b([1-9]|10)\b(?!\w)/;
        const basicMatch = line.match(basicPpcPattern);
        
        if (basicMatch) {
          result.PPC = basicMatch[0];
        }
        
        const modifierPattern = /\b(5X|10W)\b(?!\w|\/)/;
        const modifierMatch = line.match(modifierPattern);
        
        if (modifierMatch) {
          if (!result.PPC) {
            result.PPC = '5';
          }
          result.ALT_PPC = modifierMatch[0];
        }
      }
    }
    
    if (line.includes('5X/10W/10')) {
      result.PPC = '5';
      result.ALT_PPC = '5X/10W/10';
    }
  } catch (error) {
    console.error('Error parsing PPC/ALT_PPC:', error);
  }

  // Parse FS (Fire Station)
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

  // Map risk category
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

// Add the new function that was missing
export function parseAddressString(addressString: string): {
  zipCode: string;
  city: string;
  street?: string;
  streetType?: string;
  doorNumber?: string;
} {
  const result = {
    zipCode: '',
    city: '',
    street: '',
    streetType: '',
    doorNumber: ''
  };

  // Check if string is empty
  if (!addressString.trim()) {
    return result;
  }

  // Look for ZIP code (5 digits)
  const zipMatch = addressString.match(/\b\d{5}\b/);
  if (zipMatch) {
    result.zipCode = zipMatch[0];
  }

  // Split by comma to separate parts
  const parts = addressString.split(',').map(p => p.trim());
  
  // If we have more than one part, the last part likely has the city and ZIP
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1];
    // Look for the city before the ZIP
    if (result.zipCode && lastPart.includes(result.zipCode)) {
      const cityCandidate = lastPart.split(result.zipCode)[0].trim();
      if (cityCandidate) {
        result.city = cityCandidate;
      }
    } 
    // If no ZIP in last part, assume it's just the city
    else if (!lastPart.match(/\d{5}/)) {
      result.city = lastPart;
    }

    // First part usually has the street address
    const firstPart = parts[0];
    
    // Try to extract street type (RD, ST, AVE, etc.)
    for (const type of Array.from(TYPE_SET)) {
      if (firstPart.toUpperCase().includes(` ${type}`)) {
        result.streetType = type;
        break;
      }
    }
    
    // Extract door number (if present)
    const doorNumberMatch = firstPart.match(/^\d+/);
    if (doorNumberMatch) {
      result.doorNumber = doorNumberMatch[0];
    }
    
    // Extract street name
    if (result.doorNumber) {
      let streetName = firstPart.substring(result.doorNumber.length).trim();
      if (result.streetType) {
        // Remove the street type from the street name
        streetName = streetName.replace(new RegExp(`\\s${result.streetType}\\b`, 'i'), '');
      }
      result.street = streetName.trim();
    } else {
      // If no door number, assume everything before the type is the street name
      if (result.streetType) {
        result.street = firstPart.split(result.streetType)[0].trim();
      } else {
        result.street = firstPart;
      }
    }
  }

  return result;
}
