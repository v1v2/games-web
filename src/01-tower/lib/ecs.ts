import { IEntity, Tag } from 'miniplex'
import { createECS } from 'miniplex/react'

import { EnemyType, TowerType } from '01-tower/lib/types'
import {
  getCellPosition,
  TOWER_DISANCE_TO_GROUND,
  ENEMY_DISTANCE_TO_GROUND,
  detailedWaypoints,
} from '01-tower/lib/config'

export type Entity = {
  enemy?: Tag
  tower?: Tag
  transform?: {
    position?: { x?: number; y?: number; z?: number }
    rotation?: { x?: number; y?: number; z?: number }
    scale?: { x?: number; y?: number; z?: number }
  }
  cell?: { rowIndex: number; colIndex: number }
  rotation?: { x: number; y: number; z: number }
  scale?: { x: number; y: number; z: number }
  health?: { current: number; max: number }
  towerType?: TowerType
  isReadyToShoot?: boolean
  killReward?: number
  enemyType?: EnemyType
} & IEntity

const ecs = createECS<Entity>()

export const useEnemyEntities = () => ecs.useArchetype('enemy').entities
export const useTowerEntities = () => ecs.useArchetype('tower').entities

type TowerCreationData = {
  type: TowerType
  cell: { rowIndex: number; colIndex: number }
}

export const createTower = ({ type, cell }: TowerCreationData) =>
  ecs.world.createEntity({
    tower: true,
    isReadyToShoot: true,
    towerType: type,
    cell,
    transform: {
      position: { ...getCellPosition(cell.rowIndex, cell.colIndex), y: TOWER_DISANCE_TO_GROUND },
    },
  })

// Note: To update x and z based on cell position, I could have an updateTower
// functon here that keeps the rowIndex and colIndex in sync with x and z

type EnemyCreationData = {
  type: EnemyType
  maxHealth: number
  killReward: number
}

export const createEnemy = ({ type, maxHealth, killReward }: EnemyCreationData) => {
  const firstWaypoint = detailedWaypoints[0]
  ecs.world.createEntity({
    enemy: true,
    health: { current: maxHealth, max: maxHealth },
    transform: {
      position: { x: firstWaypoint.x, y: ENEMY_DISTANCE_TO_GROUND, z: firstWaypoint.z },
    },
    enemyType: type,
    killReward,
  })
}

export const destroyEntity = ecs.world.destroyEntity
