import { Html, useProgress } from '@react-three/drei'

const Loader = () => {
  const { progress, active } = useProgress()

  return (
    <Html center>
      {active && (
        <div style={{ color: 'white', width: '200px', textAlign: 'center' }}>
          {Math.round(progress)}% loaded
        </div>
      )}
    </Html>
  )
}

export default Loader
