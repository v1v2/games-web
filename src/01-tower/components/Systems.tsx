import { useFrame } from '@react-three/fiber'

import ecs, { useEnemyEntities } from '01-tower/lib/ecs'
import { useMemoryStore } from '01-tower/lib/store'

const KillSystem = () => {
  const enemies = useEnemyEntities()
  const wave = useMemoryStore(s => s.wave)
  const addMoney = useMemoryStore(s => s.addMoney)
  const killedEnemyUpdate = useMemoryStore(s => s.killedEnemyUpdate)

  useFrame(() => {
    for (let i = enemies.length; i >= 0; i--) {
      const enemy = enemies[i]
      if (enemy) {
        if (enemy.enemyDetails.currentHealth <= 0) {
          ecs.world.destroyEntity(enemy)
          killedEnemyUpdate()
          addMoney(enemy.enemyDetails.value)
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
