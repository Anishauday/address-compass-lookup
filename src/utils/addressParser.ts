
type ParsedAddress = {
  doorNumber?: string;
  street?: string;
  streetType?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

export function parseAddressString(address: string): ParsedAddress {
  const result: ParsedAddress = {};
  
  // Remove any periods and extra spaces
  address = address.replace(/\./g, '').trim();
  
  // Extract ZIP code (5 digits)
  const zipMatch = address.match(/\b\d{5}\b/);
  if (zipMatch) {
    result.zipCode = zipMatch[0];
    address = address.replace(zipMatch[0], '');
  }
  
  // Extract state (2 letter code)
  const stateMatch = address.match(/\b[A-Z]{2}\b/i);
  if (stateMatch) {
    result.state = stateMatch[0].toUpperCase();
    address = address.replace(stateMatch[0], '');
  }
  
  // Clean up commas and extra spaces
  address = address.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Split remaining parts
  const parts = address.split(' ');
  
  // Extract door number (first number)
  if (/^\d+$/.test(parts[0])) {
    result.doorNumber = parts.shift();
  }
  
  // Known street types
  const streetTypes = new Set(['RD', 'ST', 'AVE', 'DR', 'LN', 'BLVD', 'CT', 'WAY', 'PL', 'PKWY', 'TUNL']);
  
  // Find street type and split address at that point
  let typeIndex = -1;
  parts.forEach((part, index) => {
    if (streetTypes.has(part.toUpperCase())) {
      typeIndex = index;
      result.streetType = part.toUpperCase();
    }
  });
  
  if (typeIndex !== -1) {
    // Everything before type is street name
    result.street = parts.slice(0, typeIndex).join(' ');
    // Everything after type (before state/zip) is city
    result.city = parts.slice(typeIndex + 1).join(' ');
  } else {
    // If no street type found, assume last part is city
    result.city = parts.pop() || '';
    result.street = parts.join(' ');
  }
  
  // Clean up any remaining commas and spaces
  Object.keys(result).forEach(key => {
    const value = result[key as keyof ParsedAddress];
    if (typeof value === 'string') {
      result[key as keyof ParsedAddress] = value.replace(/,/g, '').trim();
    }
  });
  
  return result;
}
