import { useState } from 'react'
import type { DevStory, GithubUser, GithubRepo, YearStats, CommitStory } from '../types'
import { fetchGithubUser, fetchUserRepos, fetchUserEvents, fetchUserContributions, detectCommitType, getTimeOfDay, getWeekDay, calculateYearStats } from '../utils/github'

export function useGithub() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [story, setStory] = useState<DevStory | null>(null)

  async function loadStory(username: string) {
    setLoading(true)
    setError(null)
    try {
      const user: GithubUser = await fetchGithubUser(username)
      const repos: GithubRepo[] = await fetchUserRepos(username)
      const events = await fetchUserEvents(username)
      
      const currentYear = new Date().getFullYear()
      const graphqlData = await fetchUserContributions(username, currentYear)
      
      // Extract contributions
      const weeks = graphqlData?.data?.user?.contributionsCollection?.contributionCalendar?.weeks || []
      const contributions: { date: string; contributionCount: number }[] = []
      weeks.forEach((week: any) => {
        week.contributionDays.forEach((day: any) => {
          contributions.push({
            date: day.date,
            contributionCount: day.contributionCount
          })
        })
      })
      
      // Build commit stories from events
      const commits: CommitStory[] = events
        .filter((e: any) => e.type === 'PushEvent')
        .slice(0, 100)
        .flatMap((e: any) => 
          (e.payload?.commits || []).map((c: any) => {
            const { type, emoji, mood } = detectCommitType(c.message)
            return {
              sha: c.sha?.substring(0, 7) || '',
              message: c.message.split('\n')[0],
              date: c.date || e.created_at,
              repo: e.repo?.name || '',
              type: type as any,
              emoji,
              mood: mood as any,
              weekDay: getWeekDay(c.date || e.created_at),
              timeOfDay: getTimeOfDay(c.date || e.created_at),
            }
          })
        )
        .slice(0, 50)
      
      const stats: YearStats = calculateYearStats(contributions, repos, events)
      
      const nonForks = repos.filter((r: GithubRepo) => !r.fork).sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)).slice(0, 6)
      
      setStory({
        user,
        stats,
        commits,
        topRepos: nonForks,
        milestones: buildMilestones(user, stats, repos),
      })
    } catch (err: any) {
      setError(err.message || 'Failed to load story')
    } finally {
      setLoading(false)
    }
  }

  return { loading, error, story, loadStory }
}

function buildMilestones(user: GithubUser, stats: YearStats, repos: any[]) {
  const milestones: any[] = []
  const createdAt = new Date(user.created_at)
  const yearsSince = new Date().getFullYear() - createdAt.getFullYear()
  
  milestones.push({
    date: user.created_at,
    title: '🛫 旅程开始',
    description: `在 GitHub 注册 ${yearsSince} 年前`,
    type: 'milestone',
    icon: '🛫',
  })
  
  if (stats.currentStreak >= 7) {
    milestones.push({
      date: new Date().toISOString(),
      title: '🔥 连续活跃',
      description: `${stats.currentStreak} 天连续提交`,
      type: 'milestone',
      icon: '🔥',
    })
  }
  
  const starred = repos.find((r: any) => r.stargazers_count > 0 && !r.fork)
  if (starred) {
    milestones.push({
      date: starred.pushed_at || starred.created_at,
      title: '⭐ 首个 Star',
      description: `在 ${starred.name} 获得第一个 Star`,
      type: 'first-star',
      icon: '⭐',
    })
  }
  
  const topRepo = repos.sort((a: any, b: any) => (b.stargazers_count || 0) - (a.stargazers_count || 0))[0]
  if (topRepo && topRepo.stargazers_count > 0) {
    milestones.push({
      date: topRepo.pushed_at || topRepo.created_at,
      title: `🏆 ${topRepo.name}`,
      description: `最受欢迎的项目，获得 ${topRepo.stargazers_count} Stars`,
      type: 'repo',
      icon: '🏆',
    })
  }
  
  return milestones.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}