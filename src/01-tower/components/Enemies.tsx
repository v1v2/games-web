import { useCallback, memo } from 'react'

import { Billboard, Instance } from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

import PatchedInstances from 'components/PatchedInstances'

import {
  enemiesConfig,
  ENEMY_DISTANCE_TO_GROUND,
  getCellPosition,
  waypoints,
} from '01-tower/lib/config'
import {
  basicGreenMaterial,
  blackMaterial,
  greenMaterial,
  purpleMaterial,
  redMaterial,
} from '01-tower/lib/materials'
import { cubeGeometry, squareGeometry } from '01-tower/lib/geometries'
import { useEnemyEntities } from '01-tower/lib/ecs'
import { useUpdatePosition } from '01-tower/lib/hooks'

const mapSeries = async (iterable, action) => {
  for (const x of iterable) {
    await action(x)
  }
}

const HealthBar = ({ entity }) => {
  const { size } = enemiesConfig[entity.enemyDetails.type]
  const ref = useUpdatePosition({ entity, modify: () => ({ y: size + 2.5 }) })

  useFrame(() => {
    ref.current.scale.x = 5 * (entity.enemyDetails.currentHealth / entity.enemyDetails.maxHealth)
  })

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

const Enemy = ({ entity }) => {
  const { size, speed } = enemiesConfig[entity.enemyDetails.type]

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
        entity.position.x = value.position[0]
        entity.position.y = value.position[1]
        entity.position.z = value.position[2]
      }
    },
  })

  const ref = useUpdatePosition({ entity })

  return (
    // @ts-ignore
    <a.group ref={ref} userData={{ id: entity.id }}>
      <Instance scale={[3 * size, 3 * size, 3 * size]} />
    </a.group>
  )
}

const EnemyMemo = memo(Enemy)

const Enemies = () => {
  const enemies = useEnemyEntities()

  const enemiesByType = [
    { type: 'fast', limit: 30, material: purpleMaterial },
    { type: 'basic', limit: 30, material: greenMaterial },
    { type: 'tank', limit: 30, material: redMaterial },
    { type: 'boss', limit: 30, material: blackMaterial },
  ].map(x => ({ ...x, enemies: enemies.filter(e => e.enemyDetails.type === x.type) }))

  return (
    <>
      {enemiesByType.map(({ type, enemies, limit, material }) => (
        <PatchedInstances
          key={type}
          limit={limit}
          geometry={cubeGeometry}
          material={material}
          castShadow
        >
          {enemies.map(e => (
            <EnemyMemo key={e.id} entity={e} />
          ))}
        </PatchedInstances>
      ))}
      <PatchedInstances limit={150} material={basicGreenMaterial} geometry={squareGeometry}>
        {enemies.map(e => (
          <HealthBarMemo key={e.id} entity={e} />
        ))}
      </PatchedInstances>
    </>
  )
}

export default Enemies
