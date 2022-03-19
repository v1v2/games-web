import { useState } from 'react'

import { useFrame } from '@react-three/fiber'
import { Interactive } from '@codyjasonbennett/xr'
import { Vector3 } from 'three'

import { emptyCells, towersConfig, TOWER_DISANCE_TO_GROUND } from '01-tower/lib/config'
import { useMemoryStore } from '01-tower/lib/store'
import { blueMaterial, greenMaterial, redMaterial } from '01-tower/lib/materials'
import { sphereGeometry } from '01-tower/lib/geometries'
import { useEnemyEntities, useTowerEntities } from '01-tower/lib/ecs'
import { Instance, Instances } from '@react-three/drei'

// const gunshotAudio = typeof window !== 'undefined' && new Audio('/audio/gunshot.wav')

const Tower = ({ entity }) => {
  const { id, position } = entity

  const enemies = useEnemyEntities()

  const currentConstruction = useMemoryStore(s => s.currentConstruction)
  const selectedTower = useMemoryStore(s => s.selectedTower)
  const selectTower = useMemoryStore(s => s.selectTower)
  // const createProjectile = useMemoryStore(s => s.createProjectile)
  const [isReadyToFire, setIsReadyToFire] = useState(true)
  // const { type, i, j, x, z } = getTower(id)

  const towerConfig = towersConfig[entity.towerType]

  useFrame(() => {
    if (isReadyToFire) {
      for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i]
        const enemyVector = new Vector3(e.position.x, 0, e.position.z)
        const towerVector = new Vector3(position.x, 0, position.z)
        if (enemyVector.distanceTo(towerVector) < towerConfig.range) {
          if (towerConfig.splashRange) {
            enemies.forEach(en => {
              if (
                enemyVector.distanceTo(new Vector3(en.position.x, 0, en.position.z)) <
                towerConfig.splashRange
              ) {
                en.enemyDetails.currentHealth -= towerConfig.damage
              }
            })
          } else {
            e.enemyDetails.currentHealth -= towerConfig.damage
          }
          // createProjectile(id, e.id)
          // gunshotAudio.cloneNode(true).play()
          setIsReadyToFire(false)
          setTimeout(() => setIsReadyToFire(true), towerConfig.reloadTime)
          break
        }
      }
    }
  })

  const onUniversalClick = () => !selectedTower && !currentConstruction && selectTower(id)

  return (
    <Interactive onSelect={onUniversalClick}>
      <Instance
        position={[entity.position.x, entity.position.y, entity.position.z]}
        onClick={onUniversalClick}
      />
    </Interactive>
  )
}

const Towers = () => {
  const towers = useTowerEntities()

  const towersByType = [
    {
      type: 'simple',
      material: greenMaterial,
    },
    {
      type: 'splash',
      material: redMaterial,
    },
    {
      type: 'strong',
      material: blueMaterial,
    },
  ].map(x => ({ ...x, towers: towers.filter(e => e.towerType === x.type) }))

  return (
    <>
      {towersByType.map(({ material, towers, type }) => (
        <Instances
          key={type}
          limit={emptyCells.length}
          material={material}
          geometry={sphereGeometry}
        >
          {towers.map(t => (
            <Tower key={t.id} entity={t} />
          ))}
        </Instances>
      ))}
    </>
  )
}

export default Towers
