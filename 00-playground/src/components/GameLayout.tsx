import { useEffect } from 'react'

import { Vector3 } from '@babylonjs/core'
import { Engine, Scene, useScene } from 'react-babylonjs'
import { useHotkeys } from 'react-hotkeys-hook'

import ClientOnly from 'components/ClientOnly'
import { useMemoryStore } from 'lib/store'

const Inspector = () => {
  const scene = useScene()

  const toggleInspector = async () => {
    await import('@babylonjs/inspector')
    await import('@babylonjs/core/Debug/debugLayer')
    scene.debugLayer.isVisible() ? scene.debugLayer.hide() : scene.debugLayer.show()
  }

  useEffect(() => {
    toggleInspector()
  }, [])

  useHotkeys('ctrl+i, cmd+i', () => {
    toggleInspector()
  })

  return null
}

const GameLayout = ({ children }) => {
  const setCurrentConstruction = useMemoryStore(s => s.setCurrentConstruction)
  const clearCurrentConstruction = useMemoryStore(s => s.clearCurrentConstruction)

  useHotkeys('esc', () => {
    clearCurrentConstruction()
  })

  return (
    <>
      <button style={{ position: 'fixed' }} onClick={() => setCurrentConstruction('simple')}>
        Simple Tower
      </button>
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
            alpha={Math.PI / 4}
            beta={Math.PI / 3.5}
            radius={560}
            fov={0.2}
            panningSensibility={0}
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
}

export default GameLayout
