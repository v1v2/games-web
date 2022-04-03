import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

import { flattenXYZ } from 'lib/util'

import {
  createProjectile,
  destroyEntity,
  useEnemyEntities,
  useTowerEntities,
} from '03-tower/lib/ecs'
import { useMemoryStore } from '03-tower/lib/store'
import { detailedWaypoints, ENEMY_DISTANCE_TO_GROUND, towersConfig } from '03-tower/lib/config'

const { x: endX, z: endZ } = detailedWaypoints[detailedWaypoints.length - 1]

const Systems = () => {
  const enemies = useEnemyEntities()
  const towers = useTowerEntities()

  const killedEnemyUpdate = useMemoryStore(s => s.killedEnemyUpdate)
  const addMoney = useMemoryStore(s => s.addMoney)
  const decrementLivesLeft = useMemoryStore(s => s.decrementLivesLeft)

  useFrame(() => {
    // Shooting system
    for (const tower of towers) {
      const { reloadTime, range, splashRange, damage } = towersConfig[tower.towerType]
      if (tower.isReadyToShoot) {
        for (const e of enemies) {
          const enemyPos = new Vector3(...flattenXYZ(e.transform.position))
          const towerPos = new Vector3(...flattenXYZ(tower.transform.position))
          if (enemyPos.distanceTo(towerPos) < range) {
            if (splashRange) {
              enemies.forEach(en => {
                const splahedEnemyPos = new Vector3(
                  en.transform.position.x,
                  0,
                  en.transform.position.z
                )
                if (enemyPos.distanceTo(splahedEnemyPos) < splashRange) {
                  en.health.current -= damage
                }
              })
            } else {
              e.health.current -= damage
            }
            createProjectile({
              towerType: tower.towerType,
              fromX: tower.transform.position.x,
              fromY: tower.transform.position.y + towersConfig[tower.towerType].projectileOriginY,
              fromZ: tower.transform.position.z,
              toX: e.transform.position.x,
              toY: e.transform.position.y + ENEMY_DISTANCE_TO_GROUND,
              toZ: e.transform.position.z,
            })

            tower.isReadyToShoot = false
            setTimeout(() => (tower.isReadyToShoot = true), reloadTime)
            break
          }
        }
      }
    }

    // Kill system
    for (const enemy of enemies) {
      if (enemy.health.current <= 0) {
        addMoney(enemy.killReward)
        killedEnemyUpdate()
        destroyEntity(enemy)
      }
    }

    // Reached-the-end system
    for (const enemy of enemies) {
      const pos = enemy.transform.position
      if (Math.abs(pos.x - endX) < 0.1 && Math.abs(pos.z - endZ) < 0.1) {
        decrementLivesLeft()
        destroyEntity(enemy)
      }
    }
  })

  return null
}

export default Systems
