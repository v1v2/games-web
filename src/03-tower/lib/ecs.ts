import { Tag } from 'miniplex'
import { createECS } from 'miniplex-react'
import { nanoid } from 'nanoid'

import { EnemyType, TowerType } from '03-tower/lib/types'
import {
  getCellPosition,
  TOWER_DISANCE_TO_GROUND,
  ENEMY_DISTANCE_TO_GROUND,
  detailedWaypoints,
} from '03-tower/lib/config'

export type Entity = {
  id: string
  enemy?: Tag
  tower?: Tag
  projectile?: Tag
  enemyType?: EnemyType
  towerType?: TowerType
  transform?: {
    position?: { x?: number; y?: number; z?: number }
    rotation?: { x?: number; y?: number; z?: number }
    scale?: { x?: number; y?: number; z?: number }
  }
  cell?: { rowIndex: number; colIndex: number }
  rotation?: { x: number; y: number; z: number }
  scale?: { x: number; y: number; z: number }
  health?: { current: number; max: number }
  isReadyToShoot?: boolean
  killReward?: number
  segment?: { fromX: number; fromY: number; fromZ: number; toX: number; toY: number; toZ: number }
}

const ecs = createECS<Entity>()

type EntityTag = 'tower' | 'enemy' | 'projectile'

// Component factories
const id = () => ({ id: nanoid() })
const tag = (tag: EntityTag) => ({ [tag]: Tag as Tag })
const health = (maxHealth: number) => ({ health: { current: maxHealth, max: maxHealth } })
const tower = (towerType: TowerType) => ({ tower: Tag as Tag, towerType, isReadyToShoot: true })
const enemy = (enemyType: EnemyType, killReward: number) => ({
  enemy: Tag as Tag,
  enemyType,
  killReward,
})
const pos = (x: number, y: number, z: number) => ({ transform: { position: { x, y, z } } })
const cell = (rowIndex: number, colIndex: number) => ({ cell: { rowIndex, colIndex } })

export const useEnemyEntities = () => ecs.useArchetype('enemy').entities
export const useEnemies = () => ecs.useArchetype('enemy')
export const useTowerEntities = () => ecs.useArchetype('tower').entities
export const useProjectilesEntities = () => ecs.useArchetype('projectile').entities

type TowerCreationData = {
  type: TowerType
  rowIndex: number
  colIndex: number
}

export const createTower = ({ type, rowIndex, colIndex }: TowerCreationData) => {
  const { x, z } = getCellPosition(rowIndex, colIndex)
  return ecs.world.createEntity(
    id(),
    tower(type),
    pos(x, TOWER_DISANCE_TO_GROUND, z),
    cell(rowIndex, colIndex)
  )
}

// Note: To update x and z based on cell position, I could have an updateTower
// functon here that keeps the rowIndex and colIndex in sync with x and z

type EnemyCreationData = {
  type: EnemyType
  maxHealth: number
  killReward: number
}

export const createEnemy = ({ type, maxHealth, killReward }: EnemyCreationData) => {
  const { x, z } = detailedWaypoints[0]
  ecs.world.createEntity(
    id(),
    health(maxHealth),
    enemy(type, killReward),
    pos(x, ENEMY_DISTANCE_TO_GROUND, z)
  )
}

type ProjectileCreationData = {
  towerType: TowerType
  fromX: number
  fromY: number
  fromZ: number
  toX: number
  toY: number
  toZ: number
}

export const createProjectile = ({
  fromX,
  fromY,
  fromZ,
  toX,
  toY,
  toZ,
  towerType,
}: ProjectileCreationData) =>
  ecs.world.createEntity(id(), tag('projectile'), {
    towerType,
    segment: { fromX, fromY, fromZ, toX, toY, toZ },
  })

export const destroyEntity = ecs.world.destroyEntity

export const destroyAllEnemies = () => {
  for (const e of ecs.world.archetype('enemy').entities) {
    ecs.world.queue.destroyEntity(e)
  }
  ecs.world.queue.flush()
}
