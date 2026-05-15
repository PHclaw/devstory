import { motion } from 'framer-motion'
import type { DevStory } from '../types'
import { LANGUAGE_COLORS } from '../utils/github'
import ContributionHeatmap from './ContributionHeatmap'
import ShareButton from './ShareButton'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: string
  color: string
  delay?: number
}

function StatsCard({ title, value, subtitle, icon, color, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      className="glass rounded-2xl p-6 hover:scale-105 transition-transform cursor-default"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{icon}</span>
        <span className="text-gray-400 text-sm">{title}</span>
      </div>
      <div className={`text-4xl font-black ${color} mb-1`}>{value}</div>
      <div className="text-gray-500 text-sm">{subtitle}</div>
    </motion.div>
  )
}

export default function StoryView({ story }: { story: DevStory }) {
  const { user, stats, commits, topRepos, milestones } = story

  return (
    <div className="min-h-screen bg-midnight bg-grid pb-20">
      {/* Header */}
      <div className="relative bg-deep-blue border-b border-card-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-24 h-24 rounded-full border-2 border-neon-purple object-cover"
            />
            <div>
              <h1 className="text-3xl font-black text-white">{user.name || user.login}</h1>
              <p className="text-gray-400">@{user.login}</p>
              {user.bio && <p className="text-gray-500 mt-1 text-sm max-w-lg">{user.bio}</p>}
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                {user.location && <span>📍 {user.location}</span>}
                <a href={user.html_url} target="_blank" rel="noopener" className="text-neon-purple hover:underline">GitHub →</a>
                <ShareButton username={user.login} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard title="年度提交" value={stats.totalCommits.toLocaleString()} subtitle="2026 年" icon="🔢" color="text-neon-purple" delay={0.1} />
          <StatsCard title="连续活跃" value={stats.currentStreak} subtitle="天（当前）" icon="🔥" color="text-red-400" delay={0.15} />
          <StatsCard title="最长连续" value={stats.longestStreak} subtitle="天" icon="💎" color="text-neon-yellow" delay={0.2} />
          <StatsCard title="Star 总数" value={stats.totalStars.toLocaleString()} subtitle="所有仓库" icon="⭐" color="text-neon-yellow" delay={0.25} />
        </div>

        {/* Second row stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard title="仓库数" value={stats.totalRepos} subtitle="个" icon="📦" color="text-neon-blue" delay={0.3} />
          <StatsCard title="PR 数" value={stats.totalPRs} subtitle="个" icon="🔀" color="text-neon-green" delay={0.35} />
          <StatsCard title="粉丝" value={user.followers.toLocaleString()} subtitle="人" icon="👥" color="text-neon-pink" delay={0.4} />
          <StatsCard title="活跃月份" value={stats.mostActiveMonth || '—'} subtitle="最高产" icon="📅" color="text-neon-purple" delay={0.45} />
        </div>

        {/* Contribution Heatmap */}
        <ContributionHeatmap contributions={story.contributions.map(c => ({ date: c.date, count: c.contributionCount }))} year={stats.year} />

        {/* Language Bars */}
        {stats.topLanguages.length > 0 && (
          <motion.div
            className="glass rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">🛠️ 主用语言</h2>
            <div className="space-y-3">
              {stats.topLanguages.map((lang, i) => (
                <div key={lang} className="relative">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{lang}</span>
                    <span className="text-gray-500">{Math.round(100 / stats.topLanguages.length * (stats.topLanguages.length - i))}%</span>
                  </div>
                  <div className="h-2 bg-card-bg rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ 
                        background: LANGUAGE_COLORS[lang] || '#888',
                        width: `${100 - i * 15}%`
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - i * 15}%` }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Commits Timeline */}
        {commits.length > 0 && (
          <motion.div
            className="glass rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-bold text-white mb-6">📜 最近提交</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {commits.map((commit, i) => (
                <motion.div
                  key={commit.sha + i}
                  className="flex items-start gap-4 p-3 rounded-xl bg-card-bg/50 hover:bg-card-bg transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.03 }}
                >
                  <div className="text-2xl flex-shrink-0 w-8 text-center">{commit.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{commit.message}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <a href={`https://github.com/${commit.repo}`} target="_blank" rel="noopener" className="text-neon-purple hover:underline truncate">{commit.repo}</a>
                      <span>{commit.timeOfDay}</span>
                      <span>{commit.weekDay}</span>
                    </div>
                  </div>
                  <code className="text-xs text-gray-600 flex-shrink-0 font-mono">{commit.sha}</code>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Top Repos */}
        {topRepos.length > 0 && (
          <motion.div
            className="glass rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h2 className="text-xl font-bold text-white mb-6">🏆 热门项目</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topRepos.map((repo, i) => (
                <motion.a
                  key={repo.name}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener"
                  className="block p-4 rounded-xl bg-card-bg/50 hover:bg-card-bg border border-transparent hover:border-neon-purple/30 transition-all"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.85 + i * 0.05 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '📦'}</span>
                    <span className="text-white font-bold truncate">{repo.name}</span>
                  </div>
                  {repo.description && <p className="text-gray-500 text-sm line-clamp-2 mb-3">{repo.description}</p>}
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-neon-yellow">⭐ {repo.stargazers_count}</span>
                    <span className="text-neon-blue">🍴 {repo.forks_count}</span>
                    {repo.language && (
                      <span className="text-gray-400" style={{ color: LANGUAGE_COLORS[repo.language] }}>
                        ● {repo.language}
                      </span>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Milestones */}
        {milestones.length > 0 && (
          <motion.div
            className="glass rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <h2 className="text-xl font-bold text-white mb-6">🎯 里程碑</h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-purple via-neon-blue to-neon-green" />
              <div className="space-y-4">
                {milestones.map((m, i) => (
                  <motion.div
                    key={i}
                    className="relative flex items-start gap-6 pl-14"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.05 + i * 0.08 }}
                  >
                    <div className="absolute left-3 w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm">
                      {m.icon}
                    </div>
                    <div className="flex-1 p-4 rounded-xl bg-card-bg/50">
                      <div className="text-white font-bold mb-1">{m.title}</div>
                      <div className="text-gray-500 text-sm">{m.description}</div>
                      <div className="text-gray-600 text-xs mt-1">{m.date?.split('T')[0]}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Share CTA */}
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-gray-500 mb-4">生成你自己的 DevStory</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black text-lg rounded-2xl hover:from-purple-500 hover:to-blue-500 transition-all"
          >
            🔄 尝试其他用户名
          </a>
        </motion.div>
      </div>
    </div>
  )
}