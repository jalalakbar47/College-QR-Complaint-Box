/**
 * Generates a unique, standardized complaint ID in format: CQB-YYYYMMDD-XXXX
 * Example: CQB-20260818-A7F2
 */
export function generateComplaintId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateSegment = `${year}${month}${day}`;

  const chars = '0123456789ABCDEF';
  let randSegment = '';
  for (let i = 0; i < 4; i++) {
    randSegment += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `CQB-${dateSegment}-${randSegment}`;
}

export function isValidComplaintId(id: string): boolean {
  if (!id) return false;
  const regex = /^CQB-\d{8}-[A-F0-9]{4}$/i;
  return regex.test(id.trim());
}
