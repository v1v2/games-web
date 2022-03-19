export type Cell = {
  rowIndex: number
  colIndex: number
  x: number
  z: number
}

export type TowerType = 'simple' | 'splash' | 'strong'

export type EnemyType = 'basic' | 'fast' | 'tank' | 'boss'

export type Enemy = {
  id: string
  type: EnemyType
  speed: number
  color: string
  totalHp: number
  currentHp: number
  size: number
  value: number
  x: number
  z: number
}

export type Tower = {
  id: string
  type: TowerType
  i: number
  j: number
  x: number
  z: number
}

export type Projectile = {
  id: string
  fromX: number
  fromZ: number
  toX: number
  toZ: number
}
