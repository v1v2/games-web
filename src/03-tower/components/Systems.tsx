import { useFrame } from '@react-three/fiber'

import { calcDistance } from 'lib/util'

import { createProjectile, destroyEntity, enemyEntities, towerEntities } from '03-tower/lib/ecs'
import { useMemoryStore } from '03-tower/lib/store'
import { detailedWaypoints, ENEMY_DISTANCE_TO_GROUND, towersConfig } from '03-tower/lib/config'

const { x: endX, z: endZ } = detailedWaypoints[detailedWaypoints.length - 1]

const Systems = () => {
  const killedEnemyUpdate = useMemoryStore(s => s.killedEnemyUpdate)
  const addMoney = useMemoryStore(s => s.addMoney)
  const decrementLivesLeft = useMemoryStore(s => s.decrementLivesLeft)

  useFrame(() => {
    // Shooting system
    for (const tower of towerEntities) {
      const { reloadTime, range, splashRange, damage } = towersConfig[tower.towerType]
      if (tower.isReadyToShoot) {
        for (const e of enemyEntities) {
          if (calcDistance(e.transform.position, tower.transform.position) < range) {
            if (splashRange) {
              enemyEntities.forEach(en => {
                if (calcDistance(e.transform.position, en.transform.position) < splashRange) {
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
    for (const enemy of enemyEntities) {
      if (enemy.health.current <= 0) {
        addMoney(enemy.killReward)
        killedEnemyUpdate()
        destroyEntity(enemy)
      }
    }

    // Reached-the-end system
    for (const enemy of enemyEntities) {
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
