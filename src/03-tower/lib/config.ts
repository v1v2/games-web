import { BoxGeometry, Material, SphereGeometry } from 'three'

import {
  blackMaterial,
  blueMaterial,
  greenMaterial,
  purpleMaterial,
  redMaterial,
} from '03-tower/lib/materials'
import { Cell } from '03-tower/lib/types'
import { cubeGeometry, sphereGeometry } from '03-tower/lib/geometries'

type TowerConfigs = {
  simple: TowerConfig
  splash: TowerConfig
  strong: TowerConfig
}

type TowerConfig = {
  color: string
  reloadTime: number
  material: Material
  geometry: SphereGeometry
  damage: number
  range: number
  cost: number
  splashRange?: number
  projectileOriginY: number
}

type EnemyConfig = {
  color: string
  material: Material
  geometry: BoxGeometry
  hpFactor: number
  speed: number
  killRewardFactor: number
  size: number
}

type EnemyConfigs = {
  basic: EnemyConfig
  fast: EnemyConfig
  tank: EnemyConfig
  boss: EnemyConfig
}

export const ENEMY_DISTANCE_TO_GROUND = 0.5
export const TOWER_DISANCE_TO_GROUND = 2

export const towersConfig: TowerConfigs = {
  simple: {
    color: '#00ff00',
    material: greenMaterial,
    geometry: sphereGeometry,
    reloadTime: 200,
    damage: 10,
    range: 30,
    cost: 10,
    projectileOriginY: 6,
  },
  splash: {
    color: '#ff0000',
    material: redMaterial,
    geometry: sphereGeometry,
    reloadTime: 500,
    damage: 10,
    range: 20,
    cost: 20,
    splashRange: 20,
    projectileOriginY: 5.2,
  },
  strong: {
    color: '#0000ff',
    material: blueMaterial,
    geometry: sphereGeometry,
    reloadTime: 1000,
    damage: 100,
    range: 40,
    cost: 50,
    projectileOriginY: 12,
  },
}

export const enemiesConfig: EnemyConfigs = {
  basic: {
    color: '#0f0',
    material: greenMaterial,
    geometry: cubeGeometry,
    hpFactor: 1,
    speed: 0.012,
    killRewardFactor: 1,
    size: 1,
  },
  fast: {
    color: '#f0f',
    material: purpleMaterial,
    geometry: cubeGeometry,
    hpFactor: 0.5,
    speed: 0.024,
    killRewardFactor: 1,
    size: 0.75,
  },
  tank: {
    color: '#f00',
    material: redMaterial,
    geometry: cubeGeometry,
    hpFactor: 3,
    speed: 0.01,
    killRewardFactor: 2,
    size: 1.25,
  },
  boss: {
    color: '#000',
    material: blackMaterial,
    geometry: cubeGeometry,
    hpFactor: 10,
    speed: 0.008,
    killRewardFactor: 10,
    size: 2,
  },
}

export const mapSize = 120

export const cells = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 2],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

const cellSize = mapSize / cells.length

export const waypoints = [
  [10, 11],
  [10, 7],
  [8, 7],
  [8, 10],
  [1, 10],
  [1, 6],
  [3, 6],
  [3, 8],
  [6, 8],
  [6, 4],
  [10, 4],
  [10, 1],
  [3, 1],
  [3, 4],
  [1, 4],
  [1, 0],
]

export const getCellPosition = (i: number, j: number) => ({
  x: -i * cellSize - cellSize / 2 + mapSize / 2,
  z: -j * cellSize - cellSize / 2 + mapSize / 2,
})

// @ts-ignore
export const emptyCells: Cell[] = cells.reduce(
  (rowAcc, rowCur, rowIndex) =>
    rowAcc.concat(
      rowCur.reduce((colAcc, colCur, colIndex) => {
        const { x, z } = getCellPosition(rowIndex, colIndex)
        return colAcc.concat(colCur === 1 ? { rowIndex, colIndex, x, z } : [])
      }, [])
    ),
  []
)

export const detailedMap = cells.map((row, rowIndex) =>
  row.map((col, colIndex) => {
    const { x, z } = getCellPosition(rowIndex, colIndex)
    return { rowIndex, colIndex, x, z, content: col }
  })
)

export const detailedWaypoints = waypoints.map(([rowIndex, colIndex]) => {
  const { x, z } = getCellPosition(rowIndex, colIndex)
  return { rowIndex, colIndex, x, z }
})
