import { useEffect } from 'react'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { useHotkeys } from 'react-hotkeys-hook'

import { useMemoryStore } from 'lib/store'

const GameLayout = ({ children }) => {
  const currentConstruction = useMemoryStore(s => s.currentConstruction)
  const setCurrentConstruction = useMemoryStore(s => s.setCurrentConstruction)
  const clearCurrentConstruction = useMemoryStore(s => s.clearCurrentConstruction)
  const livesLeft = useMemoryStore(s => s.livesLeft)

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
            <button onClick={() => setCurrentConstruction('simple')}>Simple Tower</button>
            <button onClick={() => setCurrentConstruction('splash')}>Splash Tower</button>
            <button onClick={() => setCurrentConstruction('strong')}>Strong Tower</button>
          </>
        )}
        <div>{livesLeft} lives left</div>
      </div>
      <Canvas>
        <ambientLight intensity={1} />
        <OrbitControls
          makeDefault
          maxPolarAngle={Math.PI / 2.3}
          minPolarAngle={Math.PI / 2.3}
          // enableZoom={false}
          // enablePan={false}
        />
        <OrthographicCamera
          makeDefault
          position={[100, 100, 100]}
          // rotation={[-Math.PI / 4, Math.atan(-1 / Math.sqrt(2)), 0, 'YXZ']}
        />
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
