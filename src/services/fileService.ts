
import { AddressRecord } from '@/types/address';
import { parseSmartLine } from '@/utils/addressParser';
import { findMatches } from '@/utils/addressMatcher';

export type { AddressRecord, SearchResults } from '@/types/address';
export { findMatches, mapRiskCategory } from '@/utils/addressMatcher';

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
