import create from 'zustand'
import { persist } from 'zustand/middleware'
import { mountStoreDevtool } from 'simple-zustand-devtools'

import { getCellPosition, towersConfig } from '01-tower/lib/config'
import { Tower, TowerType } from '01-tower/lib/types'

interface MemoryStore {
  isStarted: boolean
  start: () => void
  wave: number
  selectedTower: any
  selectTower: (entity: any) => void
  enemiesKilled: number
  livesLeft: number
  money: number
  addMoney: (amount: number) => void
  decrementLivesLeft: () => void
  getTower: (id: string) => Tower
  towers: Tower[]
  currentConstruction: null | TowerType
  setCurrentConstruction: (construction: TowerType) => void
  clearCurrentConstruction: () => void
  addTower: (tower: { type: TowerType; i: number; j: number }) => void
  removeTower: (id: string) => void
  killedEnemyUpdate: () => void
}

export const useMemoryStore = create<MemoryStore>((set, get) => ({
  isStarted: false,
  start: () => set({ isStarted: true }),
  wave: 1,
  selectedTower: null,
  selectTower: entity => set({ selectedTower: entity }),
  enemiesKilled: 0,
  livesLeft: 20,
  money: 100,
  addMoney: amount => set(state => ({ money: state.money + amount })),
  enemies: [],
  towers: [],
  getTower: (id: string) => get().towers.find(t => t.id === id),
  killedEnemyUpdate: () => {
    set(state => ({
      enemiesKilled: state.enemiesKilled + 1,
      wave: 1 + Math.round((state.enemiesKilled + 1) / 20),
    }))
  },
  decrementLivesLeft: () => set(state => ({ livesLeft: state.livesLeft - 1 })),
  addTower: (tower: { type: TowerType; i: number; j: number }) => {
    const position = getCellPosition(tower.i, tower.j)
    set(state => ({
      money: state.money - towersConfig[tower.type].cost,
      towers: [...state.towers, { ...tower, ...position, id: Math.random().toString() }],
    }))
  },
  removeTower: (id: string) => {
    set(state => ({ towers: state.towers.filter(t => t.id !== id) }))
  },
  currentConstruction: null,
  setCurrentConstruction: (towerType: TowerType) => set({ currentConstruction: towerType }),
  clearCurrentConstruction: () => set({ currentConstruction: null }),
}))

export const isAliveSelector = (state: MemoryStore) => state.livesLeft > 0

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
