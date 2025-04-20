
import { AddressRecord, SearchResults } from '@/types/address';
import { calculateStringSimilarity } from './stringSimilarity';

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
    if (record.ZIP !== zipCode || record.CITY.toUpperCase() !== city.toUpperCase()) {
      continue;
    }

    let isExactStreetMatch = true;
    
    if (street && !record.STREET.toUpperCase().includes(street.toUpperCase())) {
      isExactStreetMatch = false;
    }

    if (streetType && record.TYPE.toUpperCase() !== streetType.toUpperCase()) {
      isExactStreetMatch = false;
    }

    if (doorNumber && record.LOW && record.HIGH) {
      const doorNum = parseInt(doorNumber);
      const low = parseInt(record.LOW);
      const high = parseInt(record.HIGH);

      if (low <= doorNum && doorNum <= high && isExactStreetMatch) {
        exactMatches.push(record);
        continue;
      }

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
      exactMatches.push(record);
    }
  }

  // If no exact matches found, look for similar streets in the same ZIP code
  if (exactMatches.length === 0 && street) {
    for (const record of records) {
      if (record.ZIP !== zipCode) continue;
      
      const similarity = calculateStringSimilarity(
        street.toUpperCase(),
        record.STREET.toUpperCase()
      );
      
      if (similarity >= 0.7) {
        nearMatches.push({
          ...record,
          RISK_CATEGORY: 'Approximate ' + (record.RISK_CATEGORY || 'Unknown Risk')
        });
      }
    }
  }

  return { exactMatches, nearMatches };
}
