import { useCallback, memo, useState, useMemo } from 'react'

import { Billboard } from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'
import { useFrame } from '@react-three/fiber'
import { MeshStandardMaterial, Vector3 } from 'three'

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
import { squareGeometry } from '03-tower/lib/geometries'
import { Entity, useEnemyEntities } from '03-tower/lib/ecs'
import { useUpdateTransform } from '03-tower/lib/hooks'
import { useBasicEnemyModel } from '03-tower/lib/model-hooks'
import {
  useBuggyGreenTexture,
  useBuggyOrangeTexture,
  useBuggyPurpleTexture,
  useBuggyRedTexture,
} from '03-tower/lib/textures'

const mapSeries = async (iterable, action) => {
  for (const x of iterable) {
    await action(x)
  }
}

const HealthBar = ({ entity }: { entity: Entity }) => {
  const { size } = enemiesConfig[entity.enemyType]
  const ref = useUpdateTransform({
    entity,
    modify: ({ position }) => ({ position: { y: position.y + size + 4.5 } }),
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
  const [direction, setDirection] = useState('bottom-left')

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
          const dir =
            curX === nextX
              ? nextZ > curZ
                ? 'bottom-left'
                : 'top-right'
              : curZ === nextZ
              ? nextX > curX
                ? 'bottom-right'
                : 'top-left'
              : null
          setDirection(dir)
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

  const scaleFactor = 0.005

  return (
    // @ts-ignore
    <a.group ref={ref} userData={{ id: entity.id }}>
      <Instance
        scale={[scaleFactor * 3 * size, scaleFactor * 3 * size, scaleFactor * 3 * size]}
        rotation={[
          Math.PI / 2,
          0,
          direction === 'bottom-left'
            ? 0
            : direction === 'bottom-right'
            ? -Math.PI / 2
            : direction === 'top-left'
            ? Math.PI / 2
            : direction === 'top-right'
            ? Math.PI
            : 0,
        ]}
      />
    </a.group>
  )
}

const EnemyMemo = memo(Enemy)

const Enemies = () => {
  const enemies = useEnemyEntities()
  const basicEnemyModel = useBasicEnemyModel()
  const buggyRedTexture = useBuggyRedTexture()
  const buggyOrangeTexture = useBuggyOrangeTexture()
  const buggyGreenTexture = useBuggyGreenTexture()
  const buggyPurpleTexture = useBuggyPurpleTexture()

  const redBuggyMaterial = useMemo(
    () => new MeshStandardMaterial({ map: buggyRedTexture }),
    [buggyRedTexture]
  )

  const orangeBuggyMaterial = useMemo(
    () => new MeshStandardMaterial({ map: buggyOrangeTexture }),
    [buggyOrangeTexture]
  )

  const greenBuggyMaterial = useMemo(
    () => new MeshStandardMaterial({ map: buggyGreenTexture }),
    [buggyGreenTexture]
  )

  const purpleBuggyMaterial = useMemo(
    () => new MeshStandardMaterial({ map: buggyPurpleTexture }),
    [buggyPurpleTexture]
  )

  const enemiesByTypeConfig = [
    { type: 'fast', limit: 30, material: purpleBuggyMaterial },
    { type: 'basic', limit: 30, material: greenBuggyMaterial },
    { type: 'tank', limit: 30, material: orangeBuggyMaterial },
    { type: 'boss', limit: 30, material: redBuggyMaterial },
  ]

  const enemiesByType = enemiesByTypeConfig.map(x => ({
    ...x,
    enemies: enemies.filter(e => e.enemyType === x.type),
  }))

  return (
    <>
      {enemiesByType.map(({ type, enemies, limit, material }) => (
        <Instances
          key={type}
          limit={limit}
          geometry={basicEnemyModel.geometry}
          material={material}
          castShadow
        >
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
