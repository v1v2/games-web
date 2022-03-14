import create from 'zustand'
import { persist } from 'zustand/middleware'
import { mountStoreDevtool } from 'simple-zustand-devtools'

import { getCellPosition } from 'lib/config'

type TowerType = 'simple' | 'splash' | 'strong'

type Enemy = {
  id: string
  hp: number
  x: number
  z: number
}

type Tower = {
  id: string
  type: TowerType
  i: number
  j: number
  x: number
  z: number
}

interface MemoryStore {
  livesLeft: number
  decrementLivesLeft: () => void
  enemies: Enemy[]
  spawnEnemy: () => void
  removeEnemy: (id: string) => void
  decreaseEnemyHp: (id: string, value: number) => void
  updateEnemyCoordinates: (id: string, x: number, z: number) => void
  getEnemy: (id: string) => Enemy
  getTower: (id: string) => Tower
  towers: Tower[]
  currentConstruction: null | TowerType
  setCurrentConstruction: (construction: TowerType) => void
  clearCurrentConstruction: () => void
  addTower: (tower: { type: TowerType; i: number; j: number }) => void
}

export const useMemoryStore = create<MemoryStore>((set, get) => ({
  livesLeft: 20,
  enemies: [],
  towers: [],
  getEnemy: (id: string) => get().enemies.find(e => e.id === id),
  getTower: (id: string) => get().towers.find(t => t.id === id),
  spawnEnemy: () => {
    const id = Math.random().toString()
    set(state => ({
      enemies: [...state.enemies, { id, hp: 100, x: 0, z: 0 }],
    }))
  },
  removeEnemy: (id: string) => {
    set(state => ({
      enemies: state.enemies.filter(enemy => enemy.id !== id),
    }))
  },
  decreaseEnemyHp: (id: string, value: number) => {
    set(state => ({
      enemies: state.enemies.map(enemy => {
        if (enemy.id === id) {
          return { ...enemy, hp: enemy.hp - value }
        }
        return enemy
      }),
    }))
  },
  updateEnemyCoordinates: (id: string, x: number, z: number) => {
    set(state => ({
      enemies: state.enemies.map(enemy => {
        if (enemy.id === id) {
          return { ...enemy, x, z }
        }
        return enemy
      }),
    }))
  },
  decrementLivesLeft: () => set(state => ({ livesLeft: state.livesLeft - 1 })),
  addTower: (tower: { type: TowerType; i: number; j: number }) => {
    const position = getCellPosition(tower.i, tower.j)
    set(state => ({
      towers: [...state.towers, { ...tower, ...position, id: Math.random().toString() }],
    }))
  },
  currentConstruction: null,
  setCurrentConstruction: (towerType: TowerType) => set({ currentConstruction: towerType }),
  clearCurrentConstruction: () => set({ currentConstruction: null }),
}))

interface LocalStore {}

export const useLocalStore = create<LocalStore>(
  persist((set, get) => ({}), { name: 'zustand-local' })
)

if (process.env.NODE_ENV === 'development') {
  // To not break SSR
  if (typeof document !== 'undefined') {
    mountStoreDevtool('Zustand Memory Store', useMemoryStore)
    mountStoreDevtool('Zustand Local Store', useLocalStore)
  }
}
