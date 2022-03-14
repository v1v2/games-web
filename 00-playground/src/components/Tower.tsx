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
      for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i]
        const enemyVector = new Vector3(e.x, 0, e.z)
        const towerVector = new Vector3(x, 0, z)
        if (enemyVector.distanceTo(towerVector) < towersConfig[type].range) {
          if (towersConfig[type].splashRange) {
            enemies.forEach(en => {
              if (
                enemyVector.distanceTo(new Vector3(en.x, 0, en.z)) < towersConfig[type].splashRange
              ) {
                decreaseEnemyHp(en.id, towersConfig[type].damage)
              }
            })
          } else {
            decreaseEnemyHp(e.id, towersConfig[type].damage)
          }
          createProjectile(id, e.id)
          setIsReadyToFire(false)
          setTimeout(() => setIsReadyToFire(true), towersConfig[type].reloadTime)
          break
        }
      }
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
