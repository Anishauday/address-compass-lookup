
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
