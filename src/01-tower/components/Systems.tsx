import { useFrame } from '@react-three/fiber'

import ecs, { useEnemyEntities } from '01-tower/lib/ecs'
import { useMemoryStore } from '01-tower/lib/store'
import { getCellPosition, waypoints } from '01-tower/lib/config'

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
          ecs.world.destroyEntity(enemy)
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
          ecs.world.destroyEntity(enemy)
        }
      }
    }
  })

  return null
}

const Systems = () => (
  <>
    <KillSystem />
  </>
)

export default Systems
