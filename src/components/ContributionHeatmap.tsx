import { motion } from 'framer-motion'

// GitHub-style contribution levels
const LEVEL_COLORS = [
  '#161b22',   // 0 - empty
  '#0e4429',   // 1
  '#006d32',   // 2
  '#26a641',   // 3
  '#39d353',   // 4+
]

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

interface ContributionDay {
  date: string
  count: number
}

interface ContributionHeatmapProps {
  contributions: ContributionDay[]
  year?: number
}

function getLevel(count: number): number {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count <= 3) return 2
  if (count <= 6) return 3
  return 4
}

export default function ContributionHeatmap({ contributions, year }: ContributionHeatmapProps) {
  const targetYear = year || new Date().getFullYear()
  
  // Build the grid: array of 53 weeks × 7 days
  const startDate = new Date(targetYear, 0, 1)
  const endDate = new Date(targetYear, 11, 31)
  
  // Adjust start to Sunday of the week containing Jan 1
  const startDay = startDate.getDay()
  const adjustedStart = new Date(startDate)
  adjustedStart.setDate(adjustedStart.getDate() - startDay)

  // Build contribution map for O(1) lookup
  const contribMap = new Map<string, number>()
  contributions.forEach(c => {
    if (c.date.startsWith(String(targetYear))) {
      contribMap.set(c.date, c.count)
    }
  })

  // Generate all cells
  const cells: { date: string; count: number; level: number; month: number }[] = []
  const current = new Date(adjustedStart)
  
  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0]
    const count = contribMap.get(dateStr) || 0
    cells.push({
      date: dateStr,
      count,
      level: getLevel(count),
      month: current.getMonth(),
    })
    current.setDate(current.getDate() + 1)
  }

  // Group into weeks
  const weeks: typeof cells[] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }

  // Find which columns have the first day of each month
  const monthLabels: { month: number; col: number }[] = []
  weeks.forEach((week, colIndex) => {
    week.forEach(day => {
      if (day.date.endsWith('-01')) {
        monthLabels.push({ month: day.month, col: colIndex })
      }
    })
  })

  // Stats
  const totalContributions = contributions.reduce((sum, c) => sum + c.count, 0)
  const activeDays = contributions.filter(c => c.count > 0).length

  return (
    <motion.div
      className="glass rounded-2xl p-6 overflow-x-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">🔥 贡献热力图</h2>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">{totalContributions.toLocaleString()} 次贡献</span>
          <span className="text-gray-500">· {activeDays} 天活跃</span>
        </div>
      </div>

      {/* Month labels */}
      <div className="flex gap-[3px] mb-1 ml-8" style={{ minWidth: `${(weeks.length * 13) + 40}px` }}>
        {monthLabels.map(({ month, col }) => (
          <span
            key={month}
            className="text-xs text-gray-500"
            style={{
              position: 'absolute',
              left: `${col * 13}px`,
              width: '36px',
            }}
          >
            {MONTHS[month]}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="flex gap-[3px]">
        {/* Weekday labels */}
        <div className="flex flex-col gap-[3px] mr-1 pt-0">
          {[0, 2, 4, 6].map(d => (
            <span key={d} className="text-xs text-gray-500 h-[13px] leading-[13px] mt-[10px]">
              {WEEKDAYS[d]}
            </span>
          ))}
        </div>

        {/* Cells */}
        <div className="relative" style={{ display: 'grid', gridAutoFlow: 'column', gap: '3px' }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <motion.div
                  key={day.date}
                  className="w-[13px] h-[13px] rounded-sm cursor-pointer transition-transform hover:scale-150 hover:z-10"
                  style={{
                    backgroundColor: LEVEL_COLORS[day.level],
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + (wi * 7 + di) * 0.002, duration: 0.15 }}
                  title={`${day.date}: ${day.count} 次贡献`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-3 text-xs text-gray-500">
        <span>少</span>
        {LEVEL_COLORS.map((color, i) => (
          <div key={i} className="w-[13px] h-[13px] rounded-sm" style={{ backgroundColor: color }} />
        ))}
        <span>多</span>
      </div>

      {/* Today marker hint */}
      <p className="text-gray-600 text-xs mt-2 text-right">
        将鼠标悬停在格子上查看详情 · 数据来源 GitHub GraphQL API
      </p>
    </motion.div>
  )
}
