import create from 'zustand'
import { persist } from 'zustand/middleware'
import { mountStoreDevtool } from 'simple-zustand-devtools'

import { getCellPosition, towersConfig, enemiesConfig } from '01-tower/lib/config'
import { Enemy, EnemyType, Tower, TowerType, Projectile } from '01-tower/lib/types'

interface MemoryStore {
  isStarted: boolean
  start: () => void
  wave: number
  selectedTower: string
  selectTower: (id: string) => void
  enemiesKilled: number
  livesLeft: number
  money: number
  addMoney: (amount: number) => void
  decrementLivesLeft: () => void
  // updateEnemyCoordinates: (id: string, x: number, z: number) => void
  // batchUpdateEnemyCoordinates: (enemies: { id: string; x: number; z: number }[]) => void
  getTower: (id: string) => Tower
  towers: Tower[]
  // projectiles: Projectile[]
  // createProjectile: (towerId: string, enemyId: string) => void
  // removeProjectile: (id: string) => void
  // getProjectile: (id: string) => Projectile
  currentConstruction: null | TowerType
  setCurrentConstruction: (construction: TowerType) => void
  clearCurrentConstruction: () => void
  addTower: (tower: { type: TowerType; i: number; j: number }) => void
  removeTower: (id: string) => void
}

export const useMemoryStore = create<MemoryStore>((set, get) => ({
  isStarted: false,
  start: () => set({ isStarted: true }),
  wave: 1,
  selectedTower: null,
  selectTower: id => set({ selectedTower: id }),
  enemiesKilled: 0,
  livesLeft: 20,
  money: 100,
  addMoney: amount => set(state => ({ money: state.money + amount })),
  enemies: [],
  towers: [],
  // projectiles: [],
  getTower: (id: string) => get().towers.find(t => t.id === id),
  // spawnEnemy: (type: EnemyType, baseHp: number) => {
  //   const id = Math.random().toString()
  //   const hp = enemiesConfig[type].hpFactor * baseHp
  //   const enemy = {
  //     id,
  //     type,
  //     totalHp: hp,
  //     currentHp: hp,
  //     speed: enemiesConfig[type].speed,
  //     color: enemiesConfig[type].color,
  //     size: enemiesConfig[type].size,
  //     value: enemiesConfig[type].value,
  //     // To make them not spawn in the middle of the map
  //     x: 9999,
  //     z: 9999,
  //   }
  //   set(state => ({ enemies: [...state.enemies, enemy] }))
  //   // publishCreateEnemy(enemy)
  // },
  // createProjectile: (towerId: string, enemyId: string) => {
  //   const tower = get().getTower(towerId)
  //   const enemy = get().getEnemy(enemyId)
  //   const projectile = {
  //     id: Math.random().toString(),
  //     fromX: tower.x,
  //     fromZ: tower.z,
  //     toX: enemy.x,
  //     toZ: enemy.z,
  //   }
  //   set(state => ({
  //     projectiles: [...state.projectiles, projectile],
  //   }))
  // },
  // removeProjectile: (id: string) => {
  //   set(state => ({
  //     projectiles: state.projectiles.filter(p => p.id !== id),
  //   }))
  // },
  // getProjectile: (id: string) => get().projectiles.find(p => p.id === id),
  // removeEnemy: (id: string) => {
  //   const enemy = get().getEnemy(id)
  //   set(state => ({
  //     wave: 1 + Math.round((state.enemiesKilled + 1) / 20),
  //     enemiesKilled: state.enemiesKilled + 1,
  //     enemies: state.enemies.filter(enemy => enemy.id !== id),
  //   }))
  //   // publishRemoveEnemy({ id, type: enemy.type })
  // },
  // decreaseEnemyHp: (id: string, value: number) => {
  //   set(state => ({
  //     enemies: state.enemies.map(enemy => {
  //       if (enemy.id === id) {
  //         return { ...enemy, currentHp: enemy.currentHp - value }
  //       }
  //       return enemy
  //     }),
  //   }))
  // },
  // updateEnemyCoordinates: (id: string, x: number, z: number) => {
  //   set(state => ({
  //     enemies: state.enemies.map(enemy => {
  //       if (enemy.id === id) {
  //         return { ...enemy, x, z }
  //       }
  //       return enemy
  //     }),
  //   }))
  // },
  // batchUpdateEnemyCoordinates: (enemies: { id: string; x: number; z: number }[]) => {
  //   set(state => ({
  //     enemies: state.enemies.map(e => {
  //       const foundNewEnemy = enemies.find(x => x.id === e.id)
  //       if (foundNewEnemy) {
  //         return { ...e, x: foundNewEnemy.x, z: foundNewEnemy.z }
  //       }
  //       return e
  //     }),
  //   }))
  // },
  // enemyReachedEnd: (id: string) => {
  //   set(state => ({
  //     enemies: state.enemies.filter(enemy => enemy.id !== id),
  //     livesLeft: state.livesLeft - 1,
  //   }))
  // },
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
  // clearEnemies: () => set({ enemies: [] }),
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
