import create from 'zustand'
import { persist } from 'zustand/middleware'
import { mountStoreDevtool } from 'simple-zustand-devtools'

import { TowerType } from '01-tower/lib/types'

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
  currentConstruction: null | TowerType
  setCurrentConstruction: (construction: TowerType) => void
  clearCurrentConstruction: () => void
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
  killedEnemyUpdate: () => {
    set(state => ({
      enemiesKilled: state.enemiesKilled + 1,
      wave: 1 + Math.round((state.enemiesKilled + 1) / 20),
    }))
  },
  decrementLivesLeft: () => set(state => ({ livesLeft: state.livesLeft - 1 })),
  currentConstruction: null,
  setCurrentConstruction: (towerType: TowerType) => set({ currentConstruction: towerType }),
  clearCurrentConstruction: () => set({ currentConstruction: null }),
}))

export const isAliveSelector = (state: MemoryStore) => state.livesLeft > 0

export const useCurrentConstruction = () => ({
  currentConstruction: useMemoryStore(s => s.currentConstruction),
  setCurrentConstruction: useMemoryStore(s => s.setCurrentConstruction),
  clearCurrentConstruction: useMemoryStore(s => s.clearCurrentConstruction),
})

// Note: If I was returning an array in my custom hooks, I'd have to add 'as const' on the array.

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
