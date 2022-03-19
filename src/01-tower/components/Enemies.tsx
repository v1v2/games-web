import { useRef, useCallback } from 'react'

import { useFrame } from '@react-three/fiber'
import { Merged } from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'
import { Mesh, Vector3 } from 'three'

import {
  enemiesConfig,
  ENEMY_DISTANCE_TO_GROUND,
  getCellPosition,
  waypoints,
} from '01-tower/lib/config'
import { useMemoryStore } from '01-tower/lib/store'
import { blackMaterial, greenMaterial, purpleMaterial, redMaterial } from '01-tower/lib/materials'
import { cubeGeometry, squareGeometry } from '01-tower/lib/geometries'
import ecs, { useEnemyEntities } from '01-tower/lib/ecs'

const mapSeries = async (iterable, action) => {
  for (const x of iterable) {
    await action(x)
  }
}

const Enemy = (props: any & { EnemyMesh: any; HpBarMesh: any }) => {
  const { entity, totalHp, currentHp, speed, size, EnemyMesh, HpBarMesh } = props

  const ref = useRef<Mesh>(null)
  const decrementLivesLeft = useMemoryStore(s => s.decrementLivesLeft)

  const { x: initX, z: initZ } = getCellPosition(waypoints[0][0], waypoints[0][1])
  const { x: endX, z: endZ } = getCellPosition(
    waypoints[waypoints.length - 1][0],
    waypoints[waypoints.length - 1][1]
  )

  const waypointTuples = waypoints.map((w, i) => ({
    currentWaypoint: w,
    nextWaypoint: waypoints[i + 1],
  }))

  const { position } = useSpring({
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
  })

  useFrame(() => {
    // Required because the React component is still active when the enemy is destroyed
    if (ref.current) {
      const pos = ref.current.position
      entity.position.x = pos.x
      entity.position.z = pos.z
      if (Math.abs(pos.x - endX) < 0.1 && Math.abs(pos.z - endZ) < 0.1) {
        decrementLivesLeft()
        ecs.world.destroyEntity(entity)
        ref.current = null
      }
    }
  })

  return (
    // @ts-ignore
    <a.group ref={ref} position={position}>
      <EnemyMesh scale={[3 * size, 3 * size, 3 * size]} />
      <HpBarMesh
        position={[0, ENEMY_DISTANCE_TO_GROUND + size, 0]}
        scale={[8 * (currentHp / totalHp), 1, 1]}
      />
    </a.group>
  )
}

const hpBarMesh = new Mesh(squareGeometry, greenMaterial)

const fastEnemyMesh = new Mesh(cubeGeometry, purpleMaterial)
const basicEnemyMesh = new Mesh(cubeGeometry, greenMaterial)
const tankEnemyMesh = new Mesh(cubeGeometry, redMaterial)
const bossEnemyMesh = new Mesh(cubeGeometry, blackMaterial)

const Enemies = () => {
  const enemies = useEnemyEntities()

  const enemiesByType = [
    { type: 'fast', limit: 30, material: purpleMaterial, mesh: fastEnemyMesh },
    { type: 'basic', limit: 30, material: greenMaterial, mesh: basicEnemyMesh },
    { type: 'tank', limit: 30, material: redMaterial, mesh: tankEnemyMesh },
    { type: 'boss', limit: 30, material: blackMaterial, mesh: bossEnemyMesh },
  ].map(x => ({ ...x, enemies: enemies.filter(e => e.enemyDetails.type === x.type) }))

  return (
    <>
      {enemiesByType.map(({ type, enemies, mesh, limit }) => (
        <Merged key={type} meshes={[mesh, hpBarMesh]} limit={limit}>
          {(EnemyMesh, HpBarMesh) =>
            enemies.map(e => {
              const { size, speed } = enemiesConfig[e.enemyDetails.type]
              const { currentHealth, maxHealth, type, value } = e.enemyDetails
              return (
                <Enemy
                  key={e.id}
                  entity={e}
                  totalHp={maxHealth}
                  currentHp={currentHealth}
                  speed={speed}
                  size={size}
                  value={value}
                  EnemyMesh={EnemyMesh}
                  HpBarMesh={HpBarMesh}
                />
              )
            })
          }
        </Merged>
      ))}
    </>
  )
}

export default Enemies
