/**
 * Shared Design System Tokens
 * Defines official color hexes, typography rules, and status visual tokens.
 */

export const DESIGN_TOKENS = {
  colors: {
    inkNavy: '#101B36',      // primary dark — headers, sidebar, dark sections, primary text on light bg
    registrarBlue: '#2455A4', // primary actions, links, active states
    sealGold: '#B8873B',     // accent — badges, ticket stub motif, hover highlights, official emphasis
    ledgerGreen: '#1D7A5F',  // privacy/anonymous/resolved states
    caseRed: '#B3261E',      // critical/high priority/rejected — muted brick red
    paper: '#F4F6F9',        // page background — cool, not warm cream
    paperCard: '#FFFFFF',    // card surfaces
    inkMuted: '#5B6472',     // secondary text
    hairline: '#E2E6ED',     // borders/dividers
  },
  fontFamilies: {
    display: 'Fraunces, Georgia, serif',
    body: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  transitions: {
    interactive: 'transition-colors duration-150 ease-in-out',
    fadeUp: 'animate-fade-up',
  },
  statusStyles: {
    new: {
      bg: 'bg-registrar-blue/10',
      text: 'text-registrar-blue',
      border: 'border-registrar-blue/20',
      dot: 'bg-registrar-blue',
    },
    inProgress: {
      bg: 'bg-seal-gold/10',
      text: 'text-seal-gold',
      border: 'border-seal-gold/20',
      dot: 'bg-seal-gold',
    },
    resolved: {
      bg: 'bg-ledger-green/10',
      text: 'text-ledger-green',
      border: 'border-ledger-green/20',
      dot: 'bg-ledger-green',
    },
    rejected: {
      bg: 'bg-case-red/10',
      text: 'text-case-red',
      border: 'border-case-red/20',
      dot: 'bg-case-red',
    },
    neutral: {
      bg: 'bg-ink-muted/10',
      text: 'text-ink-muted',
      border: 'border-ink-muted/20',
      dot: 'bg-ink-muted',
    },
  },
} as const;

export type DesignTokenColors = typeof DESIGN_TOKENS.colors;
