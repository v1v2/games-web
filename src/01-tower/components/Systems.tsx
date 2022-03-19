import { useFrame } from '@react-three/fiber'

import ecs, { useEnemyEntities } from '01-tower/lib/ecs'
import { useMemoryStore } from '01-tower/lib/store'

// const TransformSystem = () => {
//   const { entities } = ecs.useArchetype(transformedEntities)

//   useFrame(() => {
//     entities.forEach(entity => {
//       const { position, rotation, scale } = entity.getComponent('transform')
//       entity.object3D.position.set(position.x, position.y, position.z)
//       entity.object3D.rotation.set(rotation.x, rotation.y, rotation.z)
//       entity.object3D.scale.set(scale.x, scale.y, scale.z)
//     })
//   })

//   useFrame(() => {
//     for (const { transform } of entities) {
//       position.x += velocity.x
//       position.y += velocity.y
//       position.z += velocity.z
//     }
//   })

//   return null
// }

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
