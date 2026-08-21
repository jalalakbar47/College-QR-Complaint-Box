import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Download, Check, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';

export interface QRDisplayProps {
  url: string;
  size?: number;
  title?: string;
  subtitle?: string;
  showActions?: boolean;
}

export const QRDisplay: React.FC<QRDisplayProps> = ({
  url,
  size = 200,
  title = 'Scan to Submit Complaint',
  subtitle = 'Point your smartphone camera to open complaint form',
  showActions = true,
}) => {
  const { success } = useToast();
  const [copied, setCopied] = React.useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    success('Complaint portal link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = size * 3;
      canvas.height = size * 3;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `college-complaint-qr-${Date.now()}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-subtle max-w-sm mx-auto">
      {/* QR Code Container */}
      <div
        ref={qrRef}
        className="p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-md mb-4 flex items-center justify-center"
      >
        <QRCodeSVG
          value={url}
          size={size}
          level="H"
          includeMargin={false}
        />
      </div>

      <h4 className="font-bold text-slate-900 text-base mb-1">{title}</h4>
      <p className="text-xs text-slate-500 max-w-xs mb-4 leading-relaxed">{subtitle}</p>

      {/* Target URL Badge */}
      <div className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 mb-4 font-mono truncate">
        <span className="truncate pr-2">{url}</span>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-brand-600 hover:text-brand-700 p-1 flex-shrink-0"
          title="Open in new tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {showActions && (
        <div className="flex items-center gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copied ? 'Copied' : 'Copy URL'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="flex-1 text-xs"
            onClick={handleDownload}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Download PNG
          </Button>
        </div>
      )}
    </div>
  );
};
