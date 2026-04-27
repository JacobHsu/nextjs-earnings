'use client'

interface EarningsFilterProps {
  volumeActive: boolean
  onToggle: () => void
}

export default function EarningsFilter({ volumeActive, onToggle }: EarningsFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          volumeActive
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
        }`}
      >
        成交量
      </button>
    </div>
  )
}
