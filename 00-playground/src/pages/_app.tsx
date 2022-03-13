import { wrapPage } from '@v1v2/next'
import type { AppProps } from 'next/app'

const App = ({ Component, pageProps }: AppProps) => wrapPage(Component, pageProps)

export default App
