export interface GithubUser {
  login: string
  avatar_url: string
  name: string | null
  bio: string | null
  company: string | null
  location: string | null
  blog: string
  public_repos: number
  public_gists: number
  followers: number
  following: number
  html_url: string
  created_at: string
}

export interface GithubCommit {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      email: string
      date: string
    }
  }
  html_url: string
}

export interface GithubRepo {
  name: string
  full_name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  html_url: string
  created_at: string
  updated_at: string
  topics: string[]
  fork: boolean
}

export interface CommitStory {
  sha: string
  message: string
  date: string
  repo: string
  type: 'feat' | 'fix' | 'docs' | 'refactor' | 'chore' | 'test' | 'other'
  emoji: string
  mood: '🔥' | '✨' | '🐛' | '📝' | '♻️' | '🔧' | '✅' | '💡'
  weekDay: string
  timeOfDay: '🌅 早' | '☀️ 午' | '🌙 夜' | '🌑 深夜'
}

export interface YearStats {
  year: number
  totalCommits: number
  totalRepos: number
  totalStars: number
  longestStreak: number
  currentStreak: number
  mostActiveMonth: string
  topLanguages: string[]
  totalPRs: number
  totalIssues: number
}

export interface DevStory {
  user: GithubUser
  stats: YearStats
  commits: CommitStory[]
  topRepos: GithubRepo[]
  milestones: Milestone[]
}

export interface Milestone {
  date: string
  title: string
  description: string
  type: 'repo' | 'first-star' | 'first-fork' | 'pr' | 'milestone'
  icon: string
}