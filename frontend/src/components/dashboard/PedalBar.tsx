interface PedalBarProps {
  label: string;
  value: number;
  color: string;
}

export function PedalBar({
  label,
  value,
  color,
}: PedalBarProps) {
  const percentage = Math.min(
    100,
    Math.max(0, value)
  );

  return (
    <div>
      <div className="mb-3 flex justify-between">
        <span className="text-sm font-medium text-slate-300">
          {label}
        </span>

        <span className="font-bold tabular-nums text-white">
          {Math.round(percentage)}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full ${color} transition-all duration-150`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}