import create from 'zustand'
import { persist } from 'zustand/middleware'
import { mountStoreDevtool } from 'simple-zustand-devtools'

interface MemoryStore {}

export const useMemoryStore = create<MemoryStore>(set => ({}))

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
