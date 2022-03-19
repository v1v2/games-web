import PubSub from 'pubsub-js'

import { Enemy, Projectile } from '01-tower/lib/types'

export const ENEMY_CREATED = 'ENEMY_CREATED'
export const ENEMY_REMOVED = 'ENEMY_REMOVED'

export const PROJECTILE_CREATED = 'PROJECTILE_CREATED'

export const publishCreateProjectile = (projectile: Projectile) =>
  PubSub.publish(PROJECTILE_CREATED, projectile)

export const publishCreateEnemy = (enemy: Enemy) => PubSub.publish(ENEMY_CREATED, enemy)
export const publishRemoveEnemy = ({ id, type }: { id: string; type: string }) =>
  PubSub.publish(ENEMY_REMOVED, { id, type })

export const subscribeCreateProjectile = callback => {
  const token = PubSub.subscribe(PROJECTILE_CREATED, (_, data) => callback(data))
  return () => PubSub.unsubscribe(token)
}

export const subscribeCreateEnemy = callback => {
  const token = PubSub.subscribe(ENEMY_CREATED, (_, data) => callback(data))
  return () => PubSub.unsubscribe(token)
}
export const subscribeRemoveEnemy = callback => {
  const token = PubSub.subscribe(ENEMY_REMOVED, (_, data) => callback(data))
  return () => PubSub.unsubscribe(token)
}
