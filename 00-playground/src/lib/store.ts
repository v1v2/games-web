import create from 'zustand'
import { persist } from 'zustand/middleware'
import { mountStoreDevtool } from 'simple-zustand-devtools'

import { getCellPosition, towersConfig } from 'lib/config'

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

type Projectile = {
  id: string
  fromX: number
  fromZ: number
  toX: number
  toZ: number
}

interface MemoryStore {
  livesLeft: number
  money: number
  addMoney: (amount: number) => void
  decrementLivesLeft: () => void
  enemies: Enemy[]
  spawnEnemy: () => void
  removeEnemy: (id: string) => void
  decreaseEnemyHp: (id: string, value: number) => void
  updateEnemyCoordinates: (id: string, x: number, z: number) => void
  getEnemy: (id: string) => Enemy
  getTower: (id: string) => Tower
  towers: Tower[]
  projectiles: Projectile[]
  createProjectile: (towerId: string, enemyId: string) => void
  removeProjectile: (id: string) => void
  getProjectile: (id: string) => Projectile
  currentConstruction: null | TowerType
  setCurrentConstruction: (construction: TowerType) => void
  clearCurrentConstruction: () => void
  addTower: (tower: { type: TowerType; i: number; j: number }) => void
}

export const useMemoryStore = create<MemoryStore>((set, get) => ({
  livesLeft: 20,
  money: 20,
  addMoney: amount => set(state => ({ money: state.money + amount })),
  enemies: [],
  towers: [],
  projectiles: [],
  getEnemy: (id: string) => get().enemies.find(e => e.id === id),
  getTower: (id: string) => get().towers.find(t => t.id === id),
  spawnEnemy: () => {
    const id = Math.random().toString()
    set(state => ({
      enemies: [...state.enemies, { id, hp: 100, x: 0, z: 0 }],
    }))
  },
  createProjectile: (towerId: string, enemyId: string) => {
    const tower = get().getTower(towerId)
    const enemy = get().getEnemy(enemyId)
    const projectile = {
      id: Math.random().toString(),
      fromX: tower.x,
      fromZ: tower.z,
      toX: enemy.x,
      toZ: enemy.z,
    }
    set(state => ({
      projectiles: [...state.projectiles, projectile],
    }))
  },
  removeProjectile: (id: string) => {
    set(state => ({
      projectiles: state.projectiles.filter(p => p.id !== id),
    }))
  },
  getProjectile: (id: string) => get().projectiles.find(p => p.id === id),
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
      money: state.money - towersConfig[tower.type].cost,
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
