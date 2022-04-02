import { Suspense } from 'react'

import Head from 'next/head'

import { VRCanvas } from '@react-three/xr'
import { Stats } from '@react-three/drei'

import ClientOnly from 'components/ClientOnly'
import Loader from 'components/Loader'
import FullscreenButton from 'components/FullscreenButton'

const FullCanvas = ({ children }) => (
  <>
    <Head>
      <meta httpEquiv="origin-trial" content={process.env.NEXT_PUBLIC_ORIGIN_TRIAL_KEY} />
    </Head>
    <FullscreenButton pos="absolute" top={3} right={3} zIndex={10} />
    <ClientOnly>
      <Stats showPanel={0} className="stats" />
      <VRCanvas shadows={true}>
        <Suspense fallback={<Loader />}>{children}</Suspense>
      </VRCanvas>
    </ClientOnly>
    <style global jsx>{`
      html,
      body,
      #__next {
        height: 100%;
      }

      body {
        margin: 0;
        background: #222;
        font-family: sans-serif;
      }

      canvas {
        width: 100%;
        height: 100vh;
        outline: none;
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
      }

      .stats {
        top: initial !important;
        right: 0;
        left: auto !important;
        bottom: 0 !important;
      }
    `}</style>
  </>
)

export default FullCanvas
