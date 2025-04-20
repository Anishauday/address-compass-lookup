
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
  return new Promise((resolve, reject) => {
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
      error: (error) => reject(error),
    });
  });
}
