/**
 * Design Tokens Configuration for College QR Complaint Box
 * Strictly enforces official institutional color hierarchy and 3-level surface elevation.
 */

export const TOKENS = {
  colors: {
    inkNavy: '#101B36',
    inkNavyCard: '#16234A',
    registrarBlue: '#2455A4',
    sealGold: '#B8873B',
    ledgerGreen: '#1D7A5F',
    caseRed: '#B3261E',

    // 3-Level Surface Elevation Scale
    surface0: '#EAEDF3',          // Page/main-content background canvas
    paper: '#EAEDF3',
    surface1: '#FFFFFF',          // Card, table container, form section, topbar
    paperCard: '#FFFFFF',
    surface2: '#F3F5F9',          // Recessed items inside cards (quotes, stripes, chips, unhovered inputs)
    paperRecessed: '#F3F5F9',

    inkMuted: '#5B6472',
    hairline: '#D7DEE8',          // Distinct border divider
  },
  fonts: {
    display: 'Fraunces, Georgia, serif',
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace',
  },
  elevation: {
    card: 'bg-paper-card border border-hairline shadow-sm',
    cardHover: 'hover:shadow-md transition-shadow duration-150',
    recessed: 'bg-paper-recessed border border-hairline',
    navyCard: 'bg-ink-navy-card border border-white/10 text-white',
  }
} as const;

export const STATUS_PILL_STYLES = {
  new: 'bg-registrar-blue/10 text-registrar-blue border border-registrar-blue/20',
  inProgress: 'bg-seal-gold/15 text-seal-gold border border-seal-gold/30',
  resolved: 'bg-ledger-green/10 text-ledger-green border border-ledger-green/20',
  rejected: 'bg-case-red/10 text-case-red border border-case-red/20',
  neutral: 'bg-paper-recessed text-ink-muted border border-hairline',
} as const;
