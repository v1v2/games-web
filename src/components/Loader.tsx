import { useProgress } from '@react-three/drei'

const Loader = () => {
  const { progress, active } = useProgress()

  return active ? (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        color: 'white',
        transform: 'translate(-50%, -50%)',
      }}
    >
      {progress} % loaded
    </div>
  ) : null
}

export default Loader
