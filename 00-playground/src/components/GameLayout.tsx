import { useEffect } from 'react'

import { Vector3 } from '@babylonjs/core'
import { Engine, Scene, useScene } from 'react-babylonjs'
import { useHotkeys } from 'react-hotkeys-hook'

import ClientOnly from 'components/ClientOnly'

const Inspector = () => {
  const scene = useScene()

  const showInspector = async () => {
    await import('@babylonjs/inspector')
    await import('@babylonjs/core/Debug/debugLayer')
    scene.debugLayer.show()
  }

  useEffect(() => {
    showInspector()
  }, [])

  useHotkeys('ctrl+i, cmd+i', () => {
    showInspector()
  })

  return null
}

const GameLayout = ({ children }) => (
  <>
    <Engine antialias adaptToDeviceRatio canvasId="babylonJS">
      <Scene>
        {process.env.NODE_ENV === 'development' && (
          <ClientOnly>
            <Inspector />
          </ClientOnly>
        )}
        <arcRotateCamera
          name="camera1"
          target={Vector3.Zero()}
          alpha={Math.PI / 2}
          beta={Math.PI / 4}
          radius={8}
        />
        <hemisphericLight name="light1" intensity={0.7} direction={Vector3.Up()} />
        {children}
      </Scene>
    </Engine>
    <style global jsx>{`
      html,
      body,
      #__next {
        height: 100%;
      }

      body {
        margin: 0;
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

export default GameLayout
