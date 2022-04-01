import { Html, useProgress } from '@react-three/drei'

const Loader = () => {
  const { progress } = useProgress()

  return (
    <Html center>
      <div style={{ color: 'white' }}>{progress} % loaded</div>
    </Html>
  )
}

export default Loader
