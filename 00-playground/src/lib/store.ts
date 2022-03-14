import create from 'zustand'
import { persist } from 'zustand/middleware'
import { mountStoreDevtool } from 'simple-zustand-devtools'

type Construction = 'simple' | 'splash' | 'strong'

type ConstructionDetails = {
  type: Construction
  i: number
  j: number
}

type Enemy = {
  id: string
  hp: number
}

interface MemoryStore {
  livesLeft: number
  decrementLivesLeft: () => void
  enemies: Enemy[]
  spawnEnemy: () => void
  removeEnemy: (id: string) => void
  constructionDetails: ConstructionDetails[]
  currentConstruction: null | Construction
  setCurrentConstruction: (construction: Construction) => void
  clearCurrentConstruction: () => void
  addConstructionDetails: (constructionDetails: ConstructionDetails) => void
}

export const useMemoryStore = create<MemoryStore>(set => ({
  livesLeft: 20,
  enemies: [],
  spawnEnemy: () => {
    const id = Math.random().toString()
    set(state => ({
      enemies: [...state.enemies, { id, hp: 100 }],
    }))
  },
  removeEnemy: (id: string) => {
    set(state => ({
      enemies: state.enemies.filter(enemy => enemy.id !== id),
    }))
  },
  decrementLivesLeft: () => set(state => ({ livesLeft: state.livesLeft - 1 })),
  constructionDetails: [],
  addConstructionDetails: (constructionDetails: ConstructionDetails) =>
    set(state => ({ constructionDetails: [...state.constructionDetails, constructionDetails] })),
  currentConstruction: null,
  setCurrentConstruction: (construction: Construction) =>
    set({ currentConstruction: construction }),
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
