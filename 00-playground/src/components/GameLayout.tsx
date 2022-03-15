import { useEffect } from 'react'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { useHotkeys } from 'react-hotkeys-hook'

import { useMemoryStore } from 'lib/store'
import { towersConfig } from 'lib/config'

const GameLayout = ({ children }) => {
  const currentConstruction = useMemoryStore(s => s.currentConstruction)
  const setCurrentConstruction = useMemoryStore(s => s.setCurrentConstruction)
  const clearCurrentConstruction = useMemoryStore(s => s.clearCurrentConstruction)
  const livesLeft = useMemoryStore(s => s.livesLeft)
  const money = useMemoryStore(s => s.money)

  useEffect(() => {
    if (livesLeft <= 0) {
      alert('You lost!')
      window.location.reload()
    }
  }, [livesLeft])

  useHotkeys('esc', () => {
    clearCurrentConstruction()
  })

  return (
    <>
      <div style={{ position: 'fixed', zIndex: 1 }}>
        {currentConstruction ? (
          <button onClick={() => clearCurrentConstruction()}>Cancel</button>
        ) : (
          <>
            <button
              disabled={money < towersConfig.simple.cost}
              onClick={() => setCurrentConstruction('simple')}
            >
              Simple Tower
            </button>
            <button
              disabled={money < towersConfig.splash.cost}
              onClick={() => setCurrentConstruction('splash')}
            >
              Splash Tower
            </button>
            <button
              disabled={money < towersConfig.strong.cost}
              onClick={() => setCurrentConstruction('strong')}
            >
              Strong Tower
            </button>
          </>
        )}
        <div style={{ color: 'white', fontSize: 24 }}>{livesLeft} lives left</div>
        <div style={{ color: 'white', fontSize: 24 }}>Money: ${money}</div>
      </div>
      <Canvas>
        <ambientLight intensity={1} />
        <OrbitControls
          makeDefault
          maxPolarAngle={Math.PI / 3}
          minPolarAngle={Math.PI / 3}
          // enableRotate={false}
          // enableZoom={false}
          // enableDamping={false}
          // enablePan={false}
        />
        <OrthographicCamera makeDefault position={[100, 0, 100]} zoom={8} />
        {children}
      </Canvas>
      <style global jsx>{`
        html,
        body,
        #__next {
          height: 100%;
        }

        body {
          margin: 0;
          background: #333;
          font-family: sans-serif;
        }

        canvas {
          width: 100%;
          height: 100vh;
          outline: none;
          -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
        }
      `}</style>
    </>
  )
}

export default GameLayout
