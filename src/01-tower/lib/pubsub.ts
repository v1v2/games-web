import PubSub from 'pubsub-js'

import { Projectile } from '01-tower/lib/types'

export const PROJECTILE_CREATED = 'PROJECTILE_CREATED'

export const publishCreateProjectile = (projectile: Projectile) =>
  PubSub.publish(PROJECTILE_CREATED, projectile)

export const subscribeCreateProjectile = callback => {
  const token = PubSub.subscribe(PROJECTILE_CREATED, (_, data) => callback(data))
  return () => PubSub.unsubscribe(token)
}
