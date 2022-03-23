import { useFrame } from '@react-three/fiber'

import { destroyEntity, useEnemyEntities, useTowerEntities } from '01-tower/lib/ecs'
import { useMemoryStore } from '01-tower/lib/store'
import { getCellPosition, towersConfig, waypoints } from '01-tower/lib/config'
import { publishCreateProjectile } from '01-tower/lib/pubsub'
import { Vector3 } from 'three'

const { x: endX, z: endZ } = getCellPosition(
  waypoints[waypoints.length - 1][0],
  waypoints[waypoints.length - 1][1]
)

const KillSystem = () => {
  const enemies = useEnemyEntities()
  const addMoney = useMemoryStore(s => s.addMoney)
  const killedEnemyUpdate = useMemoryStore(s => s.killedEnemyUpdate)
  const decrementLivesLeft = useMemoryStore(s => s.decrementLivesLeft)

  useFrame(() => {
    for (let i = enemies.length; i >= 0; i--) {
      const enemy = enemies[i]
      if (enemy) {
        if (enemy.health.current <= 0) {
          enemy.transform.position.x = 9999
          enemy.transform.position.z = 9999
          destroyEntity(enemy)
          killedEnemyUpdate()
          addMoney(enemy.killReward)
        }
        const pos = enemy.transform.position
        if (Math.abs(pos.x - endX) < 0.1 && Math.abs(pos.z - endZ) < 0.1) {
          // There must be a better way to do this
          // To prevent the next frames from triggering more life losses
          enemy.transform.position.x = 0
          enemy.transform.position.z = 0
          decrementLivesLeft()
          destroyEntity(enemy)
        }
      }
    }
  })

  return null
}

const ShootSystem = () => {
  const enemies = useEnemyEntities()
  const towers = useTowerEntities()

  useFrame(() => {
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
  })

  return null
}

const Systems = () => (
  <>
    <KillSystem />
    <ShootSystem />
  </>
)

export default Systems
