import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Zap, Users, Trophy } from 'lucide-react'

interface HeroProps {
  onSearch: (username: string) => void
  loading: boolean
}

export default function Hero({ onSearch, loading }: HeroProps) {
  const [input, setInput] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input.trim()) onSearch(input.trim())
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 bg-grid overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-neon-purple rounded-full animate-float opacity-60" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-neon-blue rounded-full animate-float opacity-40" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-neon-green rounded-full animate-float opacity-50" style={{ animationDelay: '1s' }} />
        <div className="absolute top-60 left-1/3 w-4 h-1 bg-neon-purple opacity-20 rotate-45" />
        <div className="absolute bottom-20 right-1/4 w-3 h-3 border border-neon-blue opacity-20 rotate-12" />
      </div>

      {/* Main content */}
      <motion.div 
        className="relative z-10 text-center max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Zap className="w-4 h-4 text-neon-purple" />
          <span className="text-sm text-purple-300">GitHub 可视化故事生成器</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-6xl md:text-8xl font-black mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="gradient-text">Dev</span>
          <span className="text-white">Story</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          把你的 GitHub 提交历史变成炫酷可视化故事<br />
          <span className="text-purple-300">解锁成就 · 展示实力 · 社交 PK</span>
        </motion.p>

        {/* Search box */}
        <motion.form
          onSubmit={handleSubmit}
          className="relative max-w-xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="relative flex items-center">
            <div className="absolute left-5 text-gray-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="输入 GitHub 用户名，如 PHclaw"
              className="w-full pl-14 pr-32 py-5 bg-card-bg border border-card-border rounded-2xl text-lg text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  生成中
                </span>
              ) : '生成故事'}
            </button>
          </div>
        </motion.form>

        {/* Features */}
        <motion.div
          className="grid grid-cols-3 gap-6 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { icon: <Zap className="w-5 h-5" />, label: '贡献热力图', desc: '年度活动可视化' },
            { icon: <Trophy className="w-5 h-5" />, label: '成就系统', desc: '解锁里程碑' },
            { icon: <Users className="w-5 h-5" />, label: '社交分享', desc: 'PK 排行榜' },
          ].map((f, i) => (
            <div key={i} className="glass rounded-xl p-4 text-center">
              <div className="text-neon-purple mb-2 flex justify-center">{f.icon}</div>
              <div className="text-white font-bold mb-1">{f.label}</div>
              <div className="text-gray-500 text-sm">{f.desc}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}