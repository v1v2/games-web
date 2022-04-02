import { useCallback, useEffect } from 'react'

import { useBoolean } from '@chakra-ui/react'

export const useFullscreen = () => {
  const [isFullscreen, { on, off }] = useBoolean(false)

  const enterFullscreen = () => document.documentElement.requestFullscreen()
  const exitFullscreen = () => document.exitFullscreen()

  const handleFullscreenChange = useCallback(() => (document.fullscreenElement ? on() : off()), [])

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen: isFullscreen ? exitFullscreen : enterFullscreen,
  }
}
