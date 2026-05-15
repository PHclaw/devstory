import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import StoryView from './components/StoryView'
import LoadingSkeleton from './components/LoadingSkeleton'
import { useGithub } from './hooks/useGithub'
import { AlertCircle } from 'lucide-react'

export default function App() {
  const { loading, error, story, loadStory } = useGithub()
  const [autoLoaded, setAutoLoaded] = useState(false)

  // Auto-load if ?user=xxx in URL
  useEffect(() => {
    if (autoLoaded) return
    const params = new URLSearchParams(window.location.search)
    const user = params.get('user')
    if (user) {
      setAutoLoaded(true)
      loadStory(user)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">出错了</h2>
          <p className="text-red-300 mb-6">{error}</p>
          <a href="/" className="text-neon-purple hover:underline">← 返回重新输入</a>
        </div>
      </div>
    )
  }

  if (story) {
    return <StoryView story={story} />
  }

  return <Hero onSearch={loadStory} loading={loading} />
}
