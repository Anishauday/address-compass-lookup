
import Papa from 'papaparse';

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

export async function parseFile(file: File): Promise<AddressRecord[]> {
  // Validate file type
  const validTypes = ['text/csv', 'text/plain', 'application/csv', 'application/vnd.ms-excel'];
  if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
    throw new Error('Invalid file type. Please upload a CSV or TXT file.');
  }

  return new Promise((resolve, reject) => {
    // For text files, we need to read as text first
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          // Parse the text content with Papa
          Papa.parse(text, {
            complete: (results) => {
              // Handle unstructured text format by checking if headers are missing
              if (!results.meta.fields || results.meta.fields.length === 0) {
                // Try to infer structure from the content
                const lines = text.split('\n');
                // Assume first non-empty line might be headers
                const headerLine = lines.find(line => line.trim().length > 0) || '';
                const headers = headerLine.split(/\s+/).filter(h => h.trim());
                
                // Create structured data from text lines
                const structuredData = lines.slice(1).map(line => {
                  const values = line.split(/\s+/).filter(v => v.trim());
                  const record: Record<string, string> = {};
                  
                  headers.forEach((header, index) => {
                    if (index < values.length) {
                      record[header] = values[index];
                    } else {
                      record[header] = '';
                    }
                  });
                  
                  return record;
                }).filter(record => Object.values(record).some(v => v));
                
                const typedRecords = structuredData.map((row: any) => ({
                  TRACKNUM: row.TRACKNUM || '',
                  ZIP: row.ZIP || '',
                  CITY: row.CITY || '',
                  STREET: row.STREET || '',
                  TYPE: row.TYPE || '',
                  LOW: row.LOW || '',
                  HIGH: row.HIGH || '',
                  PPC: row.PPC || '',
                }));
                
                resolve(typedRecords);
              } else {
                // Standard CSV parsing worked
                const records = results.data
                  .filter((row: any) => row.TRACKNUM) // Filter out empty rows
                  .map((row: any) => ({
                    TRACKNUM: row.TRACKNUM || '',
                    ZIP: row.ZIP || '',
                    CITY: row.CITY || '',
                    STREET: row.STREET || '',
                    TYPE: row.TYPE || '',
                    LOW: row.LOW || '',
                    HIGH: row.HIGH || '',
                    PPC: row.PPC || '',
                  }));
                resolve(records);
              }
            },
            header: true,
            error: (error) => reject(new Error(`Failed to parse file: ${error.message}`)),
          });
        } catch (error) {
          reject(new Error('Failed to process text file. Please check the format.'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    } else {
      // Standard CSV parsing
      Papa.parse(file, {
        complete: (results) => {
          const records = results.data
            .filter((row: any) => row.TRACKNUM) // Filter out empty rows
            .map((row: any) => ({
              TRACKNUM: row.TRACKNUM || '',
              ZIP: row.ZIP || '',
              CITY: row.CITY || '',
              STREET: row.STREET || '',
              TYPE: row.TYPE || '',
              LOW: row.LOW || '',
              HIGH: row.HIGH || '',
              PPC: row.PPC || '',
            }));
          resolve(records);
        },
        header: true,
        error: (error) => reject(new Error(`Failed to parse CSV: ${error.message}`)),
      });
    }
  });
}
