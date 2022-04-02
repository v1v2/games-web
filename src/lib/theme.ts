import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react'
import { withNoWebkitTapHighlight, withFocusVisible } from '@v1v2/chakra'

const colors = {}

const theme = extendTheme(
  { colors },
  withDefaultColorScheme({ colorScheme: 'blackAlpha', components: ['Button', 'Badge'] }),
  withFocusVisible(),
  withNoWebkitTapHighlight()
)

export default theme
