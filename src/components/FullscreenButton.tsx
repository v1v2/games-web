import { Icon, IconButton, IconButtonProps } from '@chakra-ui/react'

import { useFullscreen } from 'lib/hooks'
import { EnterFullscreenIcon, ExitFullscreenIcon } from 'lib/icons'

const FullscreenButton = (props: Omit<IconButtonProps, 'aria-label'>) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen()

  return (
    <IconButton
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      icon={<Icon as={isFullscreen ? ExitFullscreenIcon : EnterFullscreenIcon} boxSize={7} />}
      onClick={toggleFullscreen}
      {...props}
    />
  )
}

export default FullscreenButton
