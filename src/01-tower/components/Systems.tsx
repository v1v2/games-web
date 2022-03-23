import { useFrame } from '@react-three/fiber'

import { destroyEntity, useEnemyEntities, useTowerEntities } from '01-tower/lib/ecs'
import { useMemoryStore } from '01-tower/lib/store'
import { detailedWaypoints, towersConfig } from '01-tower/lib/config'
import { publishCreateProjectile } from '01-tower/lib/pubsub'
import { Vector3 } from 'three'

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
          const enemyVector = new Vector3(e.transform.position.x, 0, e.transform.position.z)
          const towerVector = new Vector3(tower.transform.position.x, 0, tower.transform.position.z)
          if (enemyVector.distanceTo(towerVector) < range) {
            if (splashRange) {
              enemies.forEach(en => {
                if (
                  enemyVector.distanceTo(
                    new Vector3(en.transform.position.x, 0, en.transform.position.z)
                  ) < splashRange
                ) {
                  en.health.current -= damage
                }
              })
            } else {
              e.health.current -= damage
            }
            publishCreateProjectile({
              id: Math.random().toString(),
              fromX: tower.transform.position.x,
              fromZ: tower.transform.position.z,
              toX: e.transform.position.x,
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
