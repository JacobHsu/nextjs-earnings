interface ProbabilityBarProps {
  probability: number // 0-100
}

export default function ProbabilityBar({ probability }: ProbabilityBarProps) {
  const color =
    probability >= 70
      ? 'bg-emerald-500'
      : probability >= 40
        ? 'bg-amber-500'
        : 'bg-red-500'

  const textColor =
    probability >= 70
      ? 'text-emerald-600'
      : probability >= 40
        ? 'text-amber-600'
        : 'text-red-600'

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${probability}%` }}
        />
      </div>
      <span className={`text-xs font-semibold tabular-nums min-w-12 text-right ${textColor}`}>
        {probability}%
      </span>
    </div>
  )
}
