interface Props {
  data: { year: number; proportion: number }[];
  width?: number;
  height?: number;
}

export function TrendSparkline({ data, width = 80, height = 24 }: Props) {
  if (data.length === 0) return <div style={{ width, height }} />;

  const padding = 2;
  const maxY = Math.max(...data.map((d) => d.proportion), 0.01);
  const minY = 0;

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * (width - 2 * padding);
    const y = height - padding - ((d.proportion - minY) / Math.max(maxY - minY, 0.001)) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="inline-block shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.7}
      />
    </svg>
  );
}
