import { useCallback, memo } from 'react'

import { Billboard } from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

import { Instances, Instance } from 'components/PatchedInstances'

import {
  enemiesConfig,
  ENEMY_DISTANCE_TO_GROUND,
  getCellPosition,
  waypoints,
} from '03-tower/lib/config'
import {
  basicGreenMaterial,
  blackMaterial,
  greenMaterial,
  purpleMaterial,
  redMaterial,
} from '03-tower/lib/materials'
import { cubeGeometry, squareGeometry } from '03-tower/lib/geometries'
import { Entity, useEnemyEntities } from '03-tower/lib/ecs'
import { useUpdateTransform } from '03-tower/lib/hooks'

const mapSeries = async (iterable, action) => {
  for (const x of iterable) {
    await action(x)
  }
}

const HealthBar = ({ entity }: { entity: Entity }) => {
  const { size } = enemiesConfig[entity.enemyType]
  const ref = useUpdateTransform({
    entity,
    modify: ({ position }) => ({ position: { y: position.y + size + 2.5 } }),
  })

  useFrame(() => {
    ref.current.scale.x = 5 * (entity.health.current / entity.health.max)
  })

  // The Billboard currently doesn't work
  return (
    <Billboard ref={ref} scale={[5, 0.6, 1]}>
      <Instance />
    </Billboard>
  )
}

const HealthBarMemo = memo(HealthBar)

const { x: initX, z: initZ } = getCellPosition(waypoints[0][0], waypoints[0][1])

const waypointTuples = waypoints.map((w, i) => ({
  currentWaypoint: w,
  nextWaypoint: waypoints[i + 1],
}))

const Enemy = ({ entity }: { entity: Entity }) => {
  const { size, speed } = enemiesConfig[entity.enemyType]

  useSpring({
    // useCallback prevents re-rendering from causing the animation to reset
    to: useCallback(async next => {
      await mapSeries(waypointTuples, async ({ currentWaypoint, nextWaypoint }) => {
        if (nextWaypoint) {
          const { x: curX, z: curZ } = getCellPosition(currentWaypoint[0], currentWaypoint[1])
          const { x: nextX, z: nextZ } = getCellPosition(nextWaypoint[0], nextWaypoint[1])
          const curPos = new Vector3(curX, ENEMY_DISTANCE_TO_GROUND, curZ)
          const nextPos = new Vector3(nextX, ENEMY_DISTANCE_TO_GROUND, nextZ)
          const distance = curPos.distanceTo(nextPos)
          await next({
            config: { duration: distance / speed },
            position: [nextX, ENEMY_DISTANCE_TO_GROUND, nextZ],
          })
        }
      })
    }, []),
    from: { position: [initX, ENEMY_DISTANCE_TO_GROUND, initZ] },
    onChange: ({ value }) => {
      if (value?.position) {
        entity.transform.position.x = value.position[0]
        entity.transform.position.y = value.position[1]
        entity.transform.position.z = value.position[2]
      }
    },
  })

  const ref = useUpdateTransform({ entity })

  return (
    // @ts-ignore
    <a.group ref={ref} userData={{ id: entity.id }}>
      <Instance scale={[3 * size, 3 * size, 3 * size]} />
    </a.group>
  )
}

const EnemyMemo = memo(Enemy)

const enemiesByTypeConfig = [
  { type: 'fast', limit: 30, material: purpleMaterial },
  { type: 'basic', limit: 30, material: greenMaterial },
  { type: 'tank', limit: 30, material: redMaterial },
  { type: 'boss', limit: 30, material: blackMaterial },
]

const Enemies = () => {
  const enemies = useEnemyEntities()

  const enemiesByType = enemiesByTypeConfig.map(x => ({
    ...x,
    enemies: enemies.filter(e => e.enemyType === x.type),
  }))

  return (
    <>
      {enemiesByType.map(({ type, enemies, limit, material }) => (
        <Instances key={type} limit={limit} geometry={cubeGeometry} material={material} castShadow>
          {enemies.map(e => (
            <EnemyMemo key={e.id} entity={e} />
          ))}
        </Instances>
      ))}
      <Instances limit={150} material={basicGreenMaterial} geometry={squareGeometry}>
        {enemies.map(e => (
          <HealthBarMemo key={e.id} entity={e} />
        ))}
      </Instances>
    </>
  )
}

export default Enemies
