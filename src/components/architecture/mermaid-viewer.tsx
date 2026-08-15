import React, { useEffect, useRef, useState } from 'react';
import { IconZoomIn, IconZoomOut, IconRotate, IconMaximize, IconMinimize, IconDownload, IconCopy, IconCheck } from '@tabler/icons-react';
import { Button } from '../ui/button';
import { useTheme } from '../../context/theme-context';
import { renderMermaidSvg } from '../../utils/mermaid-renderer';

interface MermaidViewerProps {
  chart: string;
  title?: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({ chart, title }) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const render = async () => {
      if (!chart || !chart.trim()) return;

      try {
        setError(null);
        setIsLoading(true);

        const svg = await renderMermaidSvg(chart, theme);
        if (isMounted) {
          setSvgContent(svg);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('Failed to render diagram:', err);
        if (isMounted) {
          setError(err?.message || 'Lỗi kết xuất biểu đồ.');
          setIsLoading(false);
        }
      }
    };

    render();

    return () => {
      isMounted = false;
    };
  }, [chart, theme]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    if (!containerRef.current && !svgContent) return;
    const svgEl = containerRef.current?.querySelector('svg');
    const content = svgEl ? new XMLSerializer().serializeToString(svgEl) : svgContent;
    if (!content) return;

    const blob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(title || 'aws-architecture-diagram').toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDownloadPNG = () => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;

    try {
      // 1. Determine intrinsic dimensions from viewBox or getBoundingClientRect or getBBox
      const viewBox = svgEl.viewBox?.baseVal;
      let width = viewBox && viewBox.width > 0 ? viewBox.width : svgEl.clientWidth;
      let height = viewBox && viewBox.height > 0 ? viewBox.height : svgEl.clientHeight;

      if (!width || !height) {
        try {
          const bBox = svgEl.getBBox();
          width = bBox.width;
          height = bBox.height;
        } catch {
          const rect = svgEl.getBoundingClientRect();
          width = rect.width;
          height = rect.height;
        }
      }

      width = Math.max(width || 800, 300);
      height = Math.max(height || 600, 200);

      // 2. Clone SVG element and set explicit dimensions and xmlns
      const clonedSvg = svgEl.cloneNode(true) as SVGSVGElement;
      clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clonedSvg.setAttribute('width', `${width}`);
      clonedSvg.setAttribute('height', `${height}`);

      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;

      const scaleFactor = 2; // 2x Retina resolution
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width * scaleFactor);
      canvas.height = Math.round(height * scaleFactor);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        handleDownloadSVG();
        return;
      }

      const img = new Image();
      img.onload = () => {
        try {
          // Fill background according to theme
          ctx.fillStyle = theme === 'dark' ? '#090A0F' : theme === 'reader' ? '#F6F1E6' : '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw scaled high-res image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${(title || 'aws-architecture-diagram').toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')}.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            } else {
              handleDownloadSVG();
            }
          }, 'image/png');
        } catch (err) {
          console.error('Canvas export error:', err);
          handleDownloadSVG();
        }
      };

      img.onerror = (err) => {
        console.error('Image load error during PNG export:', err);
        handleDownloadSVG();
      };

      img.src = svgDataUrl;
    } catch (e) {
      console.error('Failed to export PNG:', e);
      handleDownloadSVG();
    }
  };

  return (
    <div
      className={`rounded-xl overflow-hidden border flex flex-col transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'my-4'
      }`}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Header Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: 'var(--text-accent)' }}
          />
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--text-primary)' }}
          >
            {title || 'AWS Architecture Diagram'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScale((s) => Math.min(s + 0.2, 3))}
            title="Zoom In"
            className="p-1.5 border hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <IconZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScale((s) => Math.max(s - 0.2, 0.4))}
            title="Zoom Out"
            className="p-1.5 border hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <IconZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            title="Reset Zoom & Pan"
            className="p-1.5 border hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <IconRotate className="w-4 h-4" />
          </Button>
          <div className="w-[1px] h-4 mx-1" style={{ backgroundColor: 'var(--border-subtle)' }} />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            title="Copy Diagram Code"
            className="p-1.5 border hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            {copied ? <IconCheck className="w-4 h-4 text-emerald-500" /> : <IconCopy className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadSVG}
            title="Download Vector SVG"
            className="px-2.5 py-1 text-xs border hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)] font-medium flex items-center gap-1.5 shadow-xs transition-colors"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <IconDownload className="w-3.5 h-3.5" />
            <span>SVG</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadPNG}
            title="Download High-Res PNG"
            className="px-2.5 py-1 text-xs border font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            style={{
              color: 'var(--text-accent)',
              borderColor: 'var(--accent-border)',
              backgroundColor: 'var(--accent-bg)',
            }}
          >
            <IconDownload className="w-3.5 h-3.5" />
            <span>PNG</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-1.5 border hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            {isFullscreen ? <IconMinimize className="w-4 h-4" /> : <IconMaximize className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Diagram Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative w-full overflow-hidden flex items-center justify-center p-6 select-none cursor-grab active:cursor-grabbing ${
          isFullscreen ? 'flex-1 min-h-[500px]' : 'min-h-[360px]'
        }`}
        style={{
          backgroundColor: 'var(--bg-card)',
        }}
      >
        {isLoading && !svgContent ? (
          <div className="flex items-center gap-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            <span className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span>Rendering diagram...</span>
          </div>
        ) : error ? (
          <div className="text-center p-4">
            <p className="text-xs text-amber-500 mb-2 font-medium">{error}</p>
            <pre
              className="text-xs p-3 rounded text-left overflow-x-auto max-w-xl font-mono"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border-subtle)',
                borderWidth: '1px',
                color: 'var(--text-secondary)',
              }}
            >
              {chart}
            </pre>
          </div>
        ) : (
          <div
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
            className="w-full flex justify-center [&_svg]:max-w-full [&_svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
      </div>
    </div>
  );
};
