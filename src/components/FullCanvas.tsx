import { Canvas } from '@react-three/fiber'

const FullCanvas = ({ children }) => (
  <>
    <Canvas>{children}</Canvas>
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
