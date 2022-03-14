import { Vector3 } from 'three'

export const towersConfig = {
  simple: { color: '#00ff00' },
  splash: { color: '#ff0000' },
  strong: { color: '#0000ff' },
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
