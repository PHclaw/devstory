import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Check, Copy } from 'lucide-react'

interface ShareButtonProps {
  username: string
}

export default function ShareButton({ username }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const url = `${window.location.origin}?user=${username}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: `${username} 的 DevStory`,
        text: `查看 ${username} 的 GitHub 故事！`,
        url,
      })
    } else {
      setShowMenu(!showMenu)
    }
  }

  return (
    <div className="relative">
      <motion.button
        onClick={handleShare}
        className="flex items-center gap-2 px-5 py-3 glass rounded-xl text-white hover:border-neon-purple/50 transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm font-bold">分享故事</span>
      </motion.button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            className="absolute right-0 top-full mt-2 glass rounded-xl p-3 z-50 min-w-[220px]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <button
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-card-bg transition-colors text-left"
            >
              {copied ? (
                <Check className="w-4 h-4 text-neon-green" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-300">
                {copied ? '已复制链接！' : '复制链接'}
              </span>
            </button>
            <div className="px-3 py-2">
              <p className="text-xs text-gray-600 truncate">{url}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {showMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
      )}
    </div>
  )
}
