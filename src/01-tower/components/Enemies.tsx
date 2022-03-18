import { useState, useRef, useEffect } from 'react'

import { useFrame } from '@react-three/fiber'
import { Tween } from '@tweenjs/tween.js'
import { Merged } from '@react-three/drei'
import { InstancedMesh, Mesh, Object3D, Vector3 } from 'three'

import { enemiesConfig, getCellPosition, waypoints } from '01-tower/lib/config'
import { useMemoryStore } from '01-tower/lib/store'
import { blackMaterial, greenMaterial, purpleMaterial, redMaterial } from '01-tower/lib/materials'
import { cubeGeometry, squareGeometry } from '01-tower/lib/geometries'
import { subscribeCreateEnemy, subscribeRemoveEnemy } from '01-tower/lib/pubsub'
import { Enemy as TEnemy } from '01-tower/lib/types'

const distanceFromGround = 2

const Enemy = ({ id, EnemyMesh, HpBarMesh }: TEnemy & { EnemyMesh: any; HpBarMesh: any }) => {
  const ref = useRef(null)
  const wave = useMemoryStore(s => s.wave)
  const tweenRef = useRef(null)
  const getEnemy = useMemoryStore(s => s.getEnemy)
  const addMoney = useMemoryStore(s => s.addMoney)
  const decrementLivesLeft = useMemoryStore(s => s.decrementLivesLeft)
  const removeEnemy = useMemoryStore(s => s.removeEnemy)
  const updateEnemyCoordinates = useMemoryStore(s => s.updateEnemyCoordinates)
  const [targetWaypointIndex, setTargetWaypointIndex] = useState(0)
  const targetWaypoint = waypoints[targetWaypointIndex]
  const targetWaypointPosition = getCellPosition(targetWaypoint[0], targetWaypoint[1])
  const targetWaypointVector = new Vector3(
    targetWaypointPosition.x,
    distanceFromGround,
    targetWaypointPosition.z
  )

  const initialWaypoint = waypoints[0]
  const initialWaypointPosition = getCellPosition(initialWaypoint[0], initialWaypoint[1])

  const enemy = getEnemy(id)
  const totalHp = enemy?.totalHp
  const currentHp = enemy?.currentHp
  const speed = enemy?.speed
  const size = enemy?.size
  const value = enemy?.value

  useEffect(() => {
    if (currentHp <= 0) {
      removeEnemy(id)
      addMoney(Math.floor(value * (1 + wave * 0.06)))
    }
  }, [currentHp])

  useEffect(() => {
    const coords = ref.current.position
    const distance = targetWaypointVector.distanceTo(coords)
    const duration = distance / speed
    tweenRef.current = new Tween(coords)
      .to(targetWaypointVector, duration)
      .onUpdate(() => {
        ref.current.position.x = coords.x
        ref.current.position.z = coords.z
      })
      .start()
  }, [targetWaypointIndex])

  useFrame(() => {
    if (
      Math.abs(ref.current.position.x - targetWaypointVector.x) < 0.1 &&
      Math.abs(ref.current.position.z - targetWaypointVector.z) < 0.1
    ) {
      if (targetWaypointIndex === waypoints.length - 1) {
        decrementLivesLeft()
        removeEnemy(id)
      }

      if (targetWaypointIndex < waypoints.length - 1) {
        setTargetWaypointIndex(targetWaypointIndex + 1)
      }
    } else {
      tweenRef?.current?.update()
      updateEnemyCoordinates(id, ref.current.position.x, ref.current.position.z)
    }
  })

  return (
    <group
      ref={ref}
      position={[initialWaypointPosition.x, distanceFromGround, initialWaypointPosition.z]}
    >
      <EnemyMesh scale={[3 * size, 3 * size, 3 * size]} />
      <HpBarMesh
        position={[0, distanceFromGround + size, 0]}
        scale={[8 * (currentHp / totalHp), 1, 1]}
      />
      {/* <Instance scale={[3 * size, 3 * size, 3 * size]} /> */}
      {/* <mesh
        material={greenMaterial}
        geometry={squareGeometry}
      /> */}
    </group>
  )
}

const findFirstAvailableIndex = (arr: any) => {
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i]) {
      return i
    }
  }
  return arr.length
}

const ImperativeEnemies = () => {
  const enemies = useMemoryStore(s => s.enemies)
  const removeEnemy = useMemoryStore(s => s.removeEnemy)
  const decrementLivesLeft = useMemoryStore(s => s.decrementLivesLeft)

  const fastEnemiesRef = useRef<InstancedMesh>(null)
  const basicEnemiesRef = useRef<InstancedMesh>(null)
  const tankEnemiesRef = useRef<InstancedMesh>(null)
  const bossEnemiesRef = useRef<InstancedMesh>(null)

  const stateRef = useRef({
    fast: { ref: fastEnemiesRef, present: [] },
    basic: { ref: basicEnemiesRef, present: [] },
    tank: { ref: tankEnemiesRef, present: [] },
    boss: { ref: bossEnemiesRef, present: [] },
  })

  const stateList = [
    stateRef.current.basic,
    stateRef.current.fast,
    stateRef.current.tank,
    stateRef.current.boss,
  ]

  const tempObj = new Object3D()

  useEffect(() => {
    const unsubCreated = subscribeCreateEnemy(({ id, type }) => {
      const { ref, present } = stateRef.current[type]
      const availableIndex = findFirstAvailableIndex(present)
      present[availableIndex] = { id, targetWaypointIndex: 0 }
      tempObj.position.set(availableIndex * 10, distanceFromGround, 0)
      tempObj.scale.set(
        3 * enemiesConfig.fast.size,
        3 * enemiesConfig.fast.size,
        3 * enemiesConfig.fast.size
      )
      tempObj.updateMatrix()
      ref.current.setMatrixAt(availableIndex, tempObj.matrix)
      ref.current.instanceMatrix.needsUpdate = true
    })

    const unsubRemoved = subscribeRemoveEnemy(({ id, type }) => {
      const { ref, present } = stateRef.current[type]
      const instanceIndex = present.findIndex(p => p?.id === id)
      present[instanceIndex] = null
      tempObj.position.set(0, 0, 0)
      tempObj.scale.set(0, 0, 0)
      tempObj.updateMatrix()
      ref.current.setMatrixAt(instanceIndex, tempObj.matrix)
      ref.current.instanceMatrix.needsUpdate = true
    })

    return () => {
      unsubCreated()
      unsubRemoved()
    }
  }, [])

  useFrame(() => {
    stateList.forEach(({ ref, present }) => {
      for (let i = 0; i < present.length; i++) {
        const { id, targetWaypointIndex } = present[i]
        const enemy = ref.current.getMatrixAt(i, tempObj.matrix)
        // This may not work
        const pos = tempObj.position

        const targetWaypoint = waypoints[targetWaypointIndex]
        const targetWaypointPosition = getCellPosition(targetWaypoint[0], targetWaypoint[1])

        if (
          Math.abs(pos.x - targetWaypointPosition.x) < 0.1 &&
          Math.abs(pos.z - targetWaypointPosition.z) < 0.1
        ) {
          if (targetWaypointIndex === waypoints.length - 1) {
            decrementLivesLeft()
            removeEnemy(id)
          }
          if (targetWaypointIndex < waypoints.length - 1) {
            present[i].targetWaypointIndex++
          }
        } else {
          // tweenRef?.current?.update()
          // updateEnemyCoordinates(id, ref.current.position.x, ref.current.position.z)
        }
      }
    })
  })

  const hpBarsRef = useRef(null)

  return (
    <>
      <instancedMesh
        ref={fastEnemiesRef}
        material={purpleMaterial}
        geometry={cubeGeometry}
        onClick={e => removeEnemy(stateRef.current.fast.present[e.instanceId].id)}
        args={[null, null, 50]}
      />
      <instancedMesh
        ref={basicEnemiesRef}
        material={greenMaterial}
        geometry={cubeGeometry}
        args={[null, null, 50]}
      />
      <instancedMesh
        ref={tankEnemiesRef}
        material={redMaterial}
        geometry={cubeGeometry}
        args={[null, null, 50]}
      />
      <instancedMesh
        ref={bossEnemiesRef}
        material={blackMaterial}
        geometry={cubeGeometry}
        args={[null, null, 50]}
      />
      <instancedMesh
        ref={hpBarsRef}
        material={greenMaterial}
        geometry={squareGeometry}
        args={[null, null, 100]}
      />
    </>
  )
}

const hpBarMesh = new Mesh(squareGeometry, greenMaterial)

const Enemies = () => {
  const enemies = useMemoryStore(s => s.enemies)

  const fastEnemyMeshRef = useRef(new Mesh(cubeGeometry, purpleMaterial))
  const basicEnemyMeshRef = useRef(new Mesh(cubeGeometry, greenMaterial))
  const tankEnemyMeshRef = useRef(new Mesh(cubeGeometry, redMaterial))
  const bossEnemyMeshRef = useRef(new Mesh(cubeGeometry, blackMaterial))

  const enemiesByType = [
    { type: 'fast', limit: 30, material: purpleMaterial, mesh: fastEnemyMeshRef.current },
    { type: 'basic', limit: 30, material: greenMaterial, mesh: basicEnemyMeshRef.current },
    { type: 'tank', limit: 30, material: redMaterial, mesh: tankEnemyMeshRef.current },
    { type: 'boss', limit: 30, material: blackMaterial, mesh: bossEnemyMeshRef.current },
  ].map(x => ({ ...x, enemies: enemies.filter(e => e.type === x.type) }))

  return (
    <>
      {/* {enemiesByType.map(({ type, material, enemies, limit }) => (
        <Instances key={type} limit={limit} geometry={cubeGeometry} material={material}>
          {enemies.map(e => (
            <Enemy key={e.id} {...e} />
          ))}
        </Instances>
      ))} */}
      {enemiesByType.map(({ type, enemies, mesh }) => (
        <Merged key={type} meshes={[mesh, hpBarMesh]}>
          {(EnemyMesh, HpBarMesh) =>
            enemies.map(e => (
              <Enemy key={e.id} {...e} EnemyMesh={EnemyMesh} HpBarMesh={HpBarMesh} />
            ))
          }
        </Merged>
      ))}
      {/* <Merged meshes={[boxMesh, sphereMesh]}>
        {(Box, Sphere) => (
          <>
            <Box position={[0, 0, 0]} color="red" />
            <Box position={[10, 0, 0]} color="tomato" />
            <Sphere scale={0.7} position={[20, 0, 0]} color="green" />
            <Sphere scale={0.7} position={[40, 0, 0]} color="teal" />
          </>
        )}
      </Merged> */}
    </>
  )
}

export default Enemies
