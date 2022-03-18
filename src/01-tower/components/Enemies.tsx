import { useRef, useEffect, memo, useState, useCallback } from 'react'

import { useFrame } from '@react-three/fiber'
import { Merged } from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'
import { Group, Mesh, Vector3 } from 'three'

import { getCellPosition, waypoints } from '01-tower/lib/config'
import { useMemoryStore } from '01-tower/lib/store'
import { blackMaterial, greenMaterial, purpleMaterial, redMaterial } from '01-tower/lib/materials'
import { cubeGeometry, squareGeometry } from '01-tower/lib/geometries'

const distanceFromGround = 2

const mapSeries = async (iterable, action) => {
  for (const x of iterable) {
    await action(x)
  }
}

const Enemy = (props: any & { EnemyMesh: any; HpBarMesh: any }) => {
  const { id, totalHp, currentHp, speed, size, value, EnemyMesh, HpBarMesh } = props

  const ref = useRef<Mesh>(null)
  const wave = useMemoryStore(s => s.wave)
  const addMoney = useMemoryStore(s => s.addMoney)
  const enemyReachedEnd = useMemoryStore(s => s.enemyReachedEnd)
  const removeEnemy = useMemoryStore(s => s.removeEnemy)

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
          const curPos = new Vector3(curX, distanceFromGround, curZ)
          const nextPos = new Vector3(nextX, distanceFromGround, nextZ)
          const distance = curPos.distanceTo(nextPos)
          await next({
            config: { duration: distance / speed },
            position: [nextX, distanceFromGround, nextZ],
          })
        }
      })
    }, []),
    from: { position: [initX, distanceFromGround, initZ] },
  })

  useFrame(() => {
    const pos = ref.current.position
    if (Math.abs(pos.x - endX) < 0.1 && Math.abs(pos.z - endZ) < 0.1) {
      enemyReachedEnd(id)
    }
  })

  // useEffect(() => {
  //   console.log(position[0], endX)

  // }, [JSON.stringify(position)])

  useEffect(() => {
    if (currentHp <= 0) {
      removeEnemy(id)
      addMoney(Math.floor(value * (1 + wave * 0.06)))
    }
  }, [currentHp])

  // Maybe useless, to try to make them spawn in the right place
  // useLayoutEffect(() => {
  //   ref.current.position.set(
  //     initialWaypointPosition.x,
  //     distanceFromGround,
  //     initialWaypointPosition.z
  //   )
  // }, [])

  return (
    <a.group ref={ref} position={position} userData={{ id }}>
      <EnemyMesh scale={[3 * size, 3 * size, 3 * size]} />
      <HpBarMesh
        position={[0, distanceFromGround + size, 0]}
        scale={[8 * (currentHp / totalHp), 1, 1]}
      />
    </a.group>
  )
}

// const findFirstAvailableIndex = (arr: any) => {
//   for (let i = 0; i < arr.length; i++) {
//     if (!arr[i]) {
//       return i
//     }
//   }
//   return arr.length
// }

// const ImperativeEnemies = () => {
//   const enemies = useMemoryStore(s => s.enemies)
//   const removeEnemy = useMemoryStore(s => s.removeEnemy)
//   const decrementLivesLeft = useMemoryStore(s => s.decrementLivesLeft)

//   const fastEnemiesRef = useRef<InstancedMesh>(null)
//   const basicEnemiesRef = useRef<InstancedMesh>(null)
//   const tankEnemiesRef = useRef<InstancedMesh>(null)
//   const bossEnemiesRef = useRef<InstancedMesh>(null)

//   const stateRef = useRef({
//     fast: { ref: fastEnemiesRef, present: [] },
//     basic: { ref: basicEnemiesRef, present: [] },
//     tank: { ref: tankEnemiesRef, present: [] },
//     boss: { ref: bossEnemiesRef, present: [] },
//   })

//   const stateList = [
//     stateRef.current.basic,
//     stateRef.current.fast,
//     stateRef.current.tank,
//     stateRef.current.boss,
//   ]

//   const tempObj = new Object3D()

//   useEffect(() => {
//     const unsubCreated = subscribeCreateEnemy(({ id, type }) => {
//       const { ref, present } = stateRef.current[type]
//       const availableIndex = findFirstAvailableIndex(present)
//       present[availableIndex] = { id, targetWaypointIndex: 0 }
//       tempObj.position.set(availableIndex * 10, distanceFromGround, 0)
//       tempObj.scale.set(
//         3 * enemiesConfig.fast.size,
//         3 * enemiesConfig.fast.size,
//         3 * enemiesConfig.fast.size
//       )
//       tempObj.updateMatrix()
//       ref.current.setMatrixAt(availableIndex, tempObj.matrix)
//       ref.current.instanceMatrix.needsUpdate = true
//     })

//     const unsubRemoved = subscribeRemoveEnemy(({ id, type }) => {
//       const { ref, present } = stateRef.current[type]
//       const instanceIndex = present.findIndex(p => p?.id === id)
//       present[instanceIndex] = null
//       tempObj.position.set(0, 0, 0)
//       tempObj.scale.set(0, 0, 0)
//       tempObj.updateMatrix()
//       ref.current.setMatrixAt(instanceIndex, tempObj.matrix)
//       ref.current.instanceMatrix.needsUpdate = true
//     })

//     return () => {
//       unsubCreated()
//       unsubRemoved()
//     }
//   }, [])

//   useFrame(() => {
//     stateList.forEach(({ ref, present }) => {
//       for (let i = 0; i < present.length; i++) {
//         const { id, targetWaypointIndex } = present[i]
//         const enemy = ref.current.getMatrixAt(i, tempObj.matrix)
//         // This may not work
//         const pos = tempObj.position

//         const targetWaypoint = waypoints[targetWaypointIndex]
//         const targetWaypointPosition = getCellPosition(targetWaypoint[0], targetWaypoint[1])

//         if (
//           Math.abs(pos.x - targetWaypointPosition.x) < 0.1 &&
//           Math.abs(pos.z - targetWaypointPosition.z) < 0.1
//         ) {
//           if (targetWaypointIndex === waypoints.length - 1) {
//             decrementLivesLeft()
//             removeEnemy(id)
//           }
//           if (targetWaypointIndex < waypoints.length - 1) {
//             present[i].targetWaypointIndex++
//           }
//         } else {
//           // tweenRef?.current?.update()
//           // updateEnemyCoordinates(id, ref.current.position.x, ref.current.position.z)
//         }
//       }
//     })
//   })

//   const hpBarsRef = useRef(null)

//   return (
//     <>
//       <instancedMesh
//         ref={fastEnemiesRef}
//         material={purpleMaterial}
//         geometry={cubeGeometry}
//         onClick={e => removeEnemy(stateRef.current.fast.present[e.instanceId].id)}
//         args={[null, null, 50]}
//       />
//       <instancedMesh
//         ref={basicEnemiesRef}
//         material={greenMaterial}
//         geometry={cubeGeometry}
//         args={[null, null, 50]}
//       />
//       <instancedMesh
//         ref={tankEnemiesRef}
//         material={redMaterial}
//         geometry={cubeGeometry}
//         args={[null, null, 50]}
//       />
//       <instancedMesh
//         ref={bossEnemiesRef}
//         material={blackMaterial}
//         geometry={cubeGeometry}
//         args={[null, null, 50]}
//       />
//       <instancedMesh
//         ref={hpBarsRef}
//         material={greenMaterial}
//         geometry={squareGeometry}
//         args={[null, null, 100]}
//       />
//     </>
//   )
// }

// If not memo, they stop moving at the first waypoint
const EnemyMemo = memo(Enemy)

const hpBarMesh = new Mesh(squareGeometry, greenMaterial)

const Enemies = () => {
  const enemies = useMemoryStore(s => s.enemies)
  const batchUpdateEnemyCoordinates = useMemoryStore(s => s.batchUpdateEnemyCoordinates)

  const fastEnemyMeshRef = useRef(new Mesh(cubeGeometry, purpleMaterial))
  const basicEnemyMeshRef = useRef(new Mesh(cubeGeometry, greenMaterial))
  const tankEnemyMeshRef = useRef(new Mesh(cubeGeometry, redMaterial))
  const bossEnemyMeshRef = useRef(new Mesh(cubeGeometry, blackMaterial))

  const fastEnemiesGroupRef = useRef<Group>(null)
  const basicEnemiesGroupRef = useRef<Group>(null)
  const tankEnemiesGroupRef = useRef<Group>(null)
  const bossEnemiesGroupRef = useRef<Group>(null)

  const enemiesByType = [
    {
      type: 'fast',
      limit: 30,
      material: purpleMaterial,
      mesh: fastEnemyMeshRef.current,
      groupRef: fastEnemiesGroupRef,
    },
    {
      type: 'basic',
      limit: 30,
      material: greenMaterial,
      mesh: basicEnemyMeshRef.current,
      groupRef: basicEnemiesGroupRef,
    },
    {
      type: 'tank',
      limit: 30,
      material: redMaterial,
      mesh: tankEnemyMeshRef.current,
      groupRef: tankEnemiesGroupRef,
    },
    {
      type: 'boss',
      limit: 30,
      material: blackMaterial,
      mesh: bossEnemyMeshRef.current,
      groupRef: bossEnemiesGroupRef,
    },
  ].map(x => ({ ...x, enemies: enemies.filter(e => e.type === x.type) }))

  useFrame(() => {
    const allEnemies = enemiesByType.reduce(
      (acc, curType) =>
        acc.concat(
          curType.groupRef.current.children?.map(c => ({
            id: c.userData.id,
            x: c.position.x,
            z: c.position.z,
          }))
        ),
      []
    )
    batchUpdateEnemyCoordinates(allEnemies)
  })

  return enemiesByType.map(({ type, enemies, mesh, limit, groupRef }) => (
    <Merged key={type} meshes={[mesh, hpBarMesh]} limit={limit}>
      {(EnemyMesh, HpBarMesh) => (
        <group ref={groupRef}>
          {enemies.map(e => (
            <EnemyMemo
              key={e.id}
              id={e.id}
              totalHp={e.totalHp}
              currentHp={e.currentHp}
              speed={e.speed}
              size={e.size}
              value={e.value}
              EnemyMesh={EnemyMesh}
              HpBarMesh={HpBarMesh}
            />
          ))}
        </group>
      )}
    </Merged>
  ))
}

export default Enemies
