import { Vector3 } from '@babylonjs/core'
import { Engine, Scene } from 'react-babylonjs'

const GameLayout = ({ children }) => (
  <>
    <Engine antialias adaptToDeviceRatio canvasId="babylonJS">
      <Scene>
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
