import { Vector3 } from 'three'

import { mapSize, towersConfig } from 'lib/config'
import { useMemoryStore } from 'lib/store'

const Tower = ({ id }) => {
  const getTower = useMemoryStore(s => s.getTower)

  const { type, i, j } = getTower(id)

  return (
    <mesh position={new Vector3(mapSize / 2 - i * 10 - 5, 0.1, mapSize / 2 - j * 10 - 5)}>
      <sphereGeometry args={[5, 5, 10, 10, 10]} />
      <meshStandardMaterial color={towersConfig[type].color} />
    </mesh>
  )
}

export default Tower
