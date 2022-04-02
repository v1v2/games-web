import { ChakraProvider } from '@chakra-ui/react'
import { wrapPage } from '@v1v2/next'
import type { AppProps } from 'next/app'

import 'focus-visible/dist/focus-visible'

import theme from 'lib/theme'

const App = ({ Component, pageProps }: AppProps) => (
  <ChakraProvider theme={theme}>{wrapPage(Component, pageProps)}</ChakraProvider>
)

export default App
