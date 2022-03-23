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
        if (enemy.enemyDetails.currentHealth <= 0) {
          enemy.position.x = 9999
          enemy.position.z = 9999
          destroyEntity(enemy)
          killedEnemyUpdate()
          addMoney(enemy.enemyDetails.value)
        }
        const pos = enemy.position
        if (Math.abs(pos.x - endX) < 0.1 && Math.abs(pos.z - endZ) < 0.1) {
          // There must be a better way to do this
          // To prevent the next frames from triggering more life losses
          enemy.position.x = 0
          enemy.position.z = 0
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
      const { reloadTime, range, splashRange, damage } = towersConfig[tower.towerDetails.type]
      if (tower.towerDetails.isReadyToShoot) {
        for (const e of enemies) {
          const enemyVector = new Vector3(e.position.x, 0, e.position.z)
          const towerVector = new Vector3(tower.position.x, 0, tower.position.z)
          if (enemyVector.distanceTo(towerVector) < range) {
            if (splashRange) {
              enemies.forEach(en => {
                if (
                  enemyVector.distanceTo(new Vector3(en.position.x, 0, en.position.z)) < splashRange
                ) {
                  en.enemyDetails.currentHealth -= damage
                }
              })
            } else {
              e.enemyDetails.currentHealth -= damage
            }
            publishCreateProjectile({
              id: Math.random().toString(),
              fromX: tower.position.x,
              fromZ: tower.position.z,
              toX: e.position.x,
              toZ: e.position.z,
            })
            tower.towerDetails.isReadyToShoot = false
            setTimeout(() => (tower.towerDetails.isReadyToShoot = true), reloadTime)
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
