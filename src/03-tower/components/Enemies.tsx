import { Fragment, useCallback, memo, useState, useMemo, useRef } from 'react'

import { Billboard } from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'
import { useFrame } from '@react-three/fiber'
import { Group, MeshStandardMaterial, Vector3 } from 'three'

import { makeInstanceComponents, BRING_BACK_POS, MOVE_AWAY_POS } from 'lib/InstancesTrinity'

import {
  enemiesConfig,
  ENEMY_DISTANCE_TO_GROUND,
  getCellPosition,
  waypoints,
} from '03-tower/lib/config'
import { basicGreenMaterial } from '03-tower/lib/materials'
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

const FastInstancer = makeInstanceComponents()
const BasicInstancer = makeInstanceComponents()
const TankInstancer = makeInstanceComponents()
const BossInstancer = makeInstanceComponents()
const HealthInstancer = makeInstanceComponents(false)

const mapSeries = async (iterable, action) => {
  for (const x of iterable) {
    await action(x)
  }
}

const HealthBar = ({ entity }: { entity: Entity }) => {
  const { size } = enemiesConfig[entity.enemyType]
  const billboardRef = useRef<Group>()

  const ref = useUpdateTransform({
    entity,
    modify: ({ position }) => ({ position: { y: position.y + size + 4.5 } }),
  })

  useFrame(() => {
    billboardRef.current.scale.x = 5 * (entity.health.current / entity.health.max)
  })

  return (
    <group ref={ref}>
      <Billboard ref={billboardRef} scale={[5, 0.6, 1]}>
        <HealthInstancer.Instance />
      </Billboard>
    </group>
  )
}

const HealthBarMemo = memo(HealthBar)

const { x: initX, z: initZ } = getCellPosition(waypoints[0][0], waypoints[0][1])

const waypointTuples = waypoints.map((w, i) => ({
  currentWaypoint: w,
  nextWaypoint: waypoints[i + 1],
}))

const Enemy = ({ entity, Instancer }: { entity: Entity; Instancer: typeof BasicInstancer }) => {
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

  return (
    // @ts-ignore
    <a.group ref={ref}>
      <Instancer.Instance
        scale={0.015 * size}
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
    { type: 'fast', material: purpleBuggyMaterial, Instancer: FastInstancer },
    { type: 'basic', material: greenBuggyMaterial, Instancer: BasicInstancer },
    { type: 'tank', material: orangeBuggyMaterial, Instancer: TankInstancer },
    { type: 'boss', material: redBuggyMaterial, Instancer: BossInstancer },
  ]

  const enemiesByType = enemiesByTypeConfig.map(x => ({
    ...x,
    enemies: enemies.filter(e => e.enemyType === x.type),
  }))

  return (
    <>
      {enemiesByType.map(({ type, enemies, material, Instancer }) => (
        <Fragment key={type}>
          <Instancer.Root geometry={basicEnemyModel.geometry} material={material} castShadow />
          {enemies.map(e => (
            <EnemyMemo key={e.id} entity={e} Instancer={Instancer} />
          ))}
        </Fragment>
      ))}
      <HealthInstancer.Root
        material={basicGreenMaterial}
        geometry={squareGeometry}
        position={MOVE_AWAY_POS}
      />
      <group position={BRING_BACK_POS}>
        {enemies.map(e => (
          <HealthBarMemo key={e.id} entity={e} />
        ))}
      </group>
    </>
  )
}

export default Enemies
