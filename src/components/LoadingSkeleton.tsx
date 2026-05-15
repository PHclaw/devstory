import { motion } from 'framer-motion'

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-midnight bg-grid flex items-center justify-center px-4">
      <motion.div
        className="glass rounded-3xl p-12 text-center max-w-lg w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Animated avatar placeholder */}
        <motion.div
          className="w-24 h-24 rounded-full mx-auto mb-6 bg-gradient-to-br from-neon-purple to-neon-blue"
          animate={{ 
            boxShadow: [
              '0 0 20px rgba(168,85,247,0.3)',
              '0 0 40px rgba(59,130,246,0.5)',
              '0 0 20px rgba(168,85,247,0.3)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-full h-full rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
        </motion.div>

        <h2 className="text-2xl font-black text-white mb-2">正在生成故事...</h2>
        <p className="text-gray-500 mb-8">正在从 GitHub 拉取数据，请稍候</p>

        {/* Progress steps */}
        <div className="space-y-3">
          {[
            { label: '查找用户信息', icon: '👤' },
            { label: '拉取仓库列表', icon: '📦' },
            { label: '计算贡献热力图', icon: '🔥' },
            { label: '分析提交历史', icon: '📜' },
            { label: '构建故事线', icon: '✨' },
          ].map((step, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.25 }}
            >
              <span className={`text-lg ${i < 2 ? '' : 'opacity-30'}`}>{step.icon}</span>
              <span className={`text-sm ${i < 2 ? 'text-gray-300' : 'text-gray-600'}`}>
                {step.label}
              </span>
              {i < 2 && (
                <motion.div
                  className="flex-1 h-[2px] bg-card-bg rounded overflow-hidden ml-2"
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-neon-purple to-neon-blue"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, delay: i * 0.25, repeat: Infinity, repeatDelay: 1 }}
                  />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
