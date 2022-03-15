import { useState, useRef, useEffect } from 'react'

import { useFrame } from '@react-three/fiber'
import { Tween } from '@tweenjs/tween.js'
import { Vector3 } from 'three'

import { getCellPosition, waypoints } from '01-tower/lib/config'
import { useMemoryStore } from '01-tower/lib/store'

const distanceFromGround = 2

const Enemy = ({ id }) => {
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
  const color = enemy?.color
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
      <mesh>
        <boxGeometry args={[3 * size, 3 * size, 3 * size]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, distanceFromGround + size, 0]} scale={[currentHp / totalHp, 1, 1]}>
        <planeGeometry args={[10, 1]} />
        <meshStandardMaterial color="#0f0" />
      </mesh>
    </group>
  )
}

export default Enemy
