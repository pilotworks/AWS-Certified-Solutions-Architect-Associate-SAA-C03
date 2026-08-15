import { ThemeMode } from '../context/theme-context';

export async function renderMermaidSvg(chart: string, theme: ThemeMode): Promise<string> {
  const { default: mermaid } = await import('mermaid');
  const isDark = theme === 'dark';
  const isReader = theme === 'reader';

  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : isReader ? 'neutral' : 'default',
    securityLevel: 'loose',
  });

  const id = `mermaid_${Math.random().toString(36).substring(2, 9)}`;
  const { svg } = await mermaid.render(id, chart.trim());
  return svg;
}
