import create from 'zustand'
import { persist } from 'zustand/middleware'
import { mountStoreDevtool } from 'simple-zustand-devtools'

import { getCellPosition, towersConfig, enemiesConfig } from '01-tower/lib/config'

type TowerType = 'simple' | 'splash' | 'strong'

type EnemyType = 'basic' | 'fast' | 'tank'

type Enemy = {
  id: string
  type: EnemyType
  speed: number
  color: string
  totalHp: number
  currentHp: number
  size: number
  value: number
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
  isStarted: boolean
  start: () => void
  wave: number
  enemiesKilled: number
  livesLeft: number
  money: number
  addMoney: (amount: number) => void
  decrementLivesLeft: () => void
  enemies: Enemy[]
  spawnEnemy: (type: EnemyType, baseHp: number) => void
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
  isStarted: false,
  start: () => set({ isStarted: true }),
  wave: 1,
  enemiesKilled: 0,
  livesLeft: 20,
  money: process.env.NODE_ENV === 'development' ? 100 : 20,
  addMoney: amount => set(state => ({ money: state.money + amount })),
  enemies: [],
  towers: [],
  projectiles: [],
  getEnemy: (id: string) => get().enemies.find(e => e.id === id),
  getTower: (id: string) => get().towers.find(t => t.id === id),
  spawnEnemy: (type: EnemyType, baseHp: number) => {
    const id = Math.random().toString()
    const hp = enemiesConfig[type].hpFactor * baseHp
    set(state => ({
      // To make them not spawn in the middle of the map
      enemies: [
        ...state.enemies,
        {
          id,
          type,
          totalHp: hp,
          currentHp: hp,
          speed: enemiesConfig[type].speed,
          color: enemiesConfig[type].color,
          size: enemiesConfig[type].size,
          value: enemiesConfig[type].value,
          x: 9999,
          z: 9999,
        },
      ],
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
      wave: 1 + Math.round((state.enemiesKilled + 1) / 20),
      enemiesKilled: state.enemiesKilled + 1,
      enemies: state.enemies.filter(enemy => enemy.id !== id),
    }))
  },
  decreaseEnemyHp: (id: string, value: number) => {
    set(state => ({
      enemies: state.enemies.map(enemy => {
        if (enemy.id === id) {
          return { ...enemy, currentHp: enemy.currentHp - value }
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
