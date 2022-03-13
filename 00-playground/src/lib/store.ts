import create from 'zustand'
import { persist } from 'zustand/middleware'
import { mountStoreDevtool } from 'simple-zustand-devtools'

type Construction = 'simple' | 'splash' | 'strong'

interface MemoryStore {
  currentConstruction: null | Construction
  setCurrentConstruction: (construction: Construction) => void
  clearCurrentConstruction: () => void
}

export const useMemoryStore = create<MemoryStore>(set => ({
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
