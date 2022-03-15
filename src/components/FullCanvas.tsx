// import { Canvas } from '@react-three/fiber'
import { VRCanvas, DefaultXRControllers } from '@codyjasonbennett/xr'

const FullCanvas = ({ children }) => (
  <>
    <VRCanvas>{children}</VRCanvas>
    <DefaultXRControllers />
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

export default FullCanvas
