type TowerConfigs = {
  simple: TowerConfig
  splash: TowerConfig
  strong: TowerConfig
}

type TowerConfig = {
  color: string
  reloadTime: number
  damage: number
  range: number
  cost: number
  splashRange?: number
}

type EnemyConfig = {
  color: string
  hpFactor: number
  speed: number
  value: number
  size: number
}

type EnemyConfigs = {
  basic: EnemyConfig
  fast: EnemyConfig
  tank: EnemyConfig
  boss: EnemyConfig
}

export const towersConfig: TowerConfigs = {
  simple: { color: '#00ff00', reloadTime: 200, damage: 10, range: 30, cost: 10 },
  splash: { color: '#ff0000', reloadTime: 500, damage: 10, range: 20, cost: 20, splashRange: 20 },
  strong: { color: '#0000ff', reloadTime: 1000, damage: 100, range: 40, cost: 50 },
}

export const enemiesConfig: EnemyConfigs = {
  basic: { color: '#0f0', hpFactor: 1, speed: 0.012, value: 1, size: 1 },
  fast: { color: '#f0f', hpFactor: 0.5, speed: 0.024, value: 1, size: 0.75 },
  tank: { color: '#f00', hpFactor: 3, speed: 0.008, value: 2, size: 1.25 },
  boss: { color: '#000', hpFactor: 10, speed: 0.012, value: 10, size: 2 },
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
