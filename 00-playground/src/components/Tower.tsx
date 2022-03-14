import { useState } from 'react'

import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

import { mapSize, towersConfig } from 'lib/config'
import { useMemoryStore } from 'lib/store'

const Tower = ({ id }) => {
  const getTower = useMemoryStore(s => s.getTower)
  const enemies = useMemoryStore(s => s.enemies)
  const decreaseEnemyHp = useMemoryStore(s => s.decreaseEnemyHp)
  const createProjectile = useMemoryStore(s => s.createProjectile)
  const [isReadyToFire, setIsReadyToFire] = useState(true)
  const { type, i, j, x, z } = getTower(id)

  useFrame(() => {
    if (isReadyToFire) {
      enemies.forEach(e => {
        const enemyVector = new Vector3(e.x, 0, e.z)
        const towerVector = new Vector3(x, 0, z)
        if (enemyVector.distanceTo(towerVector) < towersConfig[type].range) {
          decreaseEnemyHp(e.id, 10)
          createProjectile(id, e.id)
          setIsReadyToFire(false)
          setTimeout(() => setIsReadyToFire(true), towersConfig[type].reloadTime)
        }
      })
    }
  })

  return (
    <mesh position={new Vector3(mapSize / 2 - i * 10 - 5, 0.1, mapSize / 2 - j * 10 - 5)}>
      <sphereGeometry args={[5, 5, 10, 10, 10]} />
      <meshStandardMaterial color={towersConfig[type].color} />
    </mesh>
  )
}

export default Tower
