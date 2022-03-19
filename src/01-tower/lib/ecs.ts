import { IEntity } from 'miniplex'
import { createECS } from 'miniplex/react'

import { EnemyType, TowerType } from '01-tower/lib/types'

type Entity = {
  id?: number // Importing IEntity doesn't work well
  position?: { x: number; y: number; z: number }
  rotation?: { x: number; y: number; z: number }
  scale?: { x: number; y: number; z: number }
  enemyDetails?: { type: EnemyType; currentHealth: number; maxHealth: number; value: number }
  towerType?: TowerType
} & IEntity

const ecs = createECS<Entity>()

export const enemyEntities = ecs.world.archetype('enemyDetails')
export const towerEntities = ecs.world.archetype('towerType')

// Seems like useArchetype is not filtering correctly
export const useEnemyEntities = () =>
  // @ts-ignore
  ecs.useArchetype(enemyEntities).entities.filter(e => e.enemyDetails)

export const useTowerEntities = () =>
  // @ts-ignore
  ecs.useArchetype(towerEntities).entities.filter(e => e.towerType)

export default ecs
