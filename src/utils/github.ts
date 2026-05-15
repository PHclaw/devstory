const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || ''

export function setToken(token: string) {
  ;(window as any).__GITHUB_TOKEN = token
}

function getToken(): string {
  return (window as any).__GITHUB_TOKEN || GITHUB_TOKEN
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  if (!token) return {}
  return { Authorization: `token ${token}` }
}

function graphqlAuthHeaders(): Record<string, string> {
  const token = getToken()
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

export async function fetchGithubUser(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers: { ...authHeaders() }
  })
  if (!res.ok) {
    if (res.status === 404) throw new Error(`用户 ${username} 不存在`)
    throw new Error(`GitHub API 错误 (${res.status})`)
  }
  return res.json()
}

export async function fetchUserRepos(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`, {
    headers: { ...authHeaders() }
  })
  if (!res.ok) return []
  return res.json()
}

export async function fetchUserEvents(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}/events?per_page=100`, {
    headers: { ...authHeaders() }
  })
  if (!res.ok) return []
  return res.json()
}

export async function fetchUserContributions(username: string, year: number) {
  const token = getToken()
  if (!token) {
    // No token — return empty structure, heatmap will be empty
    return { data: { user: { contributionsCollection: { totalCommitContributions: 0, contributionCalendar: { totalContributions: 0, weeks: [] }, commitContributionsByRepository: [] } } } }
  }

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          totalCommitContributions
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
          commitContributionsByRepository(maxRepositories: 20) {
            repository {
              name
              nameWithOwner
              stargazerCount
              primaryLanguage {
                name
              }
            }
            contributions {
              totalCount
            }
          }
        }
      }
    }
  `
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      ...graphqlAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: {
        username,
        from: `${year}-01-01T00:00:00Z`,
        to: `${year}-12-31T23:59:59Z`
      }
    })
  })
  return res.json()
}

export function detectCommitType(message: string): { type: string; emoji: string; mood: string } {
  const msg = message.toLowerCase()
  if (msg.includes('fix') || msg.includes('bug') || msg.includes('patch')) {
    return { type: 'fix', emoji: '🐛', mood: '🐛' }
  }
  if (msg.includes('feat') || msg.includes('add') || msg.includes('new')) {
    return { type: 'feat', emoji: '✨', mood: '🔥' }
  }
  if (msg.includes('docs') || msg.includes('doc') || msg.includes('readme')) {
    return { type: 'docs', emoji: '📝', mood: '💡' }
  }
  if (msg.includes('refactor') || msg.includes('optimize') || msg.includes('improve')) {
    return { type: 'refactor', emoji: '♻️', mood: '💡' }
  }
  if (msg.includes('test') || msg.includes('spec')) {
    return { type: 'test', emoji: '✅', mood: '✅' }
  }
  if (msg.includes('chore') || msg.includes('ci') || msg.includes('build') || msg.includes('dep')) {
    return { type: 'chore', emoji: '🔧', mood: '🔧' }
  }
  return { type: 'other', emoji: '💡', mood: '✨' }
}

export function getTimeOfDay(date: string): string {
  const hour = new Date(date).getHours()
  if (hour >= 6 && hour < 12) return '🌅 早'
  if (hour >= 12 && hour < 18) return '☀️ 午'
  if (hour >= 18 && hour < 24) return '🌙 夜'
  return '🌑 深夜'
}

export function getWeekDay(date: string): string {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return days[new Date(date).getDay()]
}

export function getMoodEmoji(mood: string): string {
  const moods: Record<string, string> = {
    '🔥': 'text-red-400',
    '✨': 'text-purple-400',
    '🐛': 'text-green-400',
    '📝': 'text-blue-400',
    '♻️': 'text-yellow-400',
    '🔧': 'text-gray-400',
    '✅': 'text-green-400',
    '💡': 'text-yellow-300',
  }
  return moods[mood] || 'text-gray-400'
}

export function calculateStreak(contributions: { date: string; contributionCount: number }[]): { current: number; longest: number } {
  if (!contributions.length) return { current: 0, longest: 0 }

  let longest = 0
  let tempStreak = 0

  for (let i = 0; i < contributions.length; i++) {
    if (contributions[i].contributionCount > 0) {
      tempStreak++
      longest = Math.max(longest, tempStreak)
    } else {
      tempStreak = 0
    }
  }

  // Check current streak from today going backwards
  const today = new Date()
  let current = 0
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - i)
    const dateStr = checkDate.toISOString().split('T')[0]
    const found = contributions.find(d => d.date === dateStr)
    if (found && found.contributionCount > 0) {
      current++
    } else {
      break
    }
  }

  return { current, longest }
}

export function calculateYearStats(contributions: { date: string; contributionCount: number }[], repos: any[], events: any[]): any {
  const totalContributions = contributions.reduce((sum, c) => sum + c.contributionCount, 0)

  // Calculate monthly contributions
  const monthly: Record<string, number> = {}
  contributions.forEach(c => {
    const month = c.date.substring(0, 7)
    monthly[month] = (monthly[month] || 0) + c.contributionCount
  })
  const mostActiveMonth = Object.entries(monthly).sort((a, b) => b[1] - a[1])[0]?.[0] || ''

  // Top languages
  const langCounts: Record<string, number> = {}
  repos.forEach((r: any) => {
    if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1
  })
  const topLanguages = Object.entries(langCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([lang]) => lang)

  // Total stars
  const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0)

  // PRs and Issues
  const prs = events.filter((e: any) => e.type === 'PullRequestEvent').length
  const issues = events.filter((e: any) => e.type === 'IssuesEvent').length

  return {
    year: new Date().getFullYear(),
    totalCommits: totalContributions,
    totalRepos: repos.length,
    totalStars,
    longestStreak: calculateStreak(contributions).longest,
    currentStreak: calculateStreak(contributions).current,
    mostActiveMonth,
    topLanguages,
    totalPRs: prs,
    totalIssues: issues,
  }
}

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Vue: '#41b883',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Makefile: '#427819',
}