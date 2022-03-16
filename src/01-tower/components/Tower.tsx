import { useState } from 'react'

import { useFrame } from '@react-three/fiber'
import { Interactive } from '@codyjasonbennett/xr'
import { Vector3 } from 'three'

import { mapSize, towersConfig } from '01-tower/lib/config'
import { useMemoryStore } from '01-tower/lib/store'
import { wireFrameMaterial } from '01-tower/lib/materials'
import { sphereGeometry } from '01-tower/lib/geometries'

// const gunshotAudio = typeof window !== 'undefined' && new Audio('/audio/gunshot.wav')

const Tower = ({ id }) => {
  const currentConstruction = useMemoryStore(s => s.currentConstruction)
  const getTower = useMemoryStore(s => s.getTower)
  const selectedTower = useMemoryStore(s => s.selectedTower)
  const selectTower = useMemoryStore(s => s.selectTower)
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
          // gunshotAudio.cloneNode(true).play()
          setIsReadyToFire(false)
          setTimeout(() => setIsReadyToFire(true), towersConfig[type].reloadTime)
          break
        }
      }
    }
  })

  const onUniversalClick = () => !selectedTower && !currentConstruction && selectTower(id)

  return (
    <Interactive onSelect={onUniversalClick}>
      <mesh
        position={new Vector3(mapSize / 2 - i * 10 - 5, 2, mapSize / 2 - j * 10 - 5)}
        onClick={onUniversalClick}
        material={selectedTower === id ? wireFrameMaterial : towersConfig[type].material}
        geometry={sphereGeometry}
      />
    </Interactive>
  )
}

export default Tower
