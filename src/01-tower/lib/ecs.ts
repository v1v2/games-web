import { IEntity, Tag } from 'miniplex'
import { createECS } from 'miniplex/react'

import { EnemyType, TowerType } from '01-tower/lib/types'

export type Entity = {
  enemy?: Tag
  tower?: Tag
  position?: { x: number; y: number; z: number }
  cell?: { rowIndex: number; colIndex: number }
  rotation?: { x: number; y: number; z: number }
  scale?: { x: number; y: number; z: number }
  enemyDetails?: { type: EnemyType; currentHealth: number; maxHealth: number; value: number }
  towerDetails?: { type: TowerType; isReadyToShoot: boolean }
} & IEntity

const ecs = createECS<Entity>()

export const useEnemyEntities = () => ecs.useArchetype('enemy').entities
export const useTowerEntities = () => ecs.useArchetype('tower').entities

export const createTower = data => ecs.world.createEntity({ tag: 'tower', ...data })
export const createEnemy = data => ecs.world.createEntity({ tag: 'enemy', ...data })

export const destroyEntity = ecs.world.destroyEntity
