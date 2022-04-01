import Head from 'next/head'

import { VRCanvas } from '@react-three/xr'
import { Stats } from '@react-three/drei'

import ClientOnly from 'components/ClientOnly'

const FullCanvas = ({ children }) => (
  <>
    <Head>
      <meta httpEquiv="origin-trial" content={process.env.NEXT_PUBLIC_ORIGIN_TRIAL_KEY} />
    </Head>
    <ClientOnly>
      <Stats showPanel={0} className="stats" />
    </ClientOnly>
    <VRCanvas mode="concurrent" shadows={true}>
      {children}
    </VRCanvas>
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
        right: 0;
        left: auto !important;
      }
    `}</style>
  </>
)

export default FullCanvas
