import { useState, useRef, useEffect } from 'react'

import { useFrame } from '@react-three/fiber'
import { Tween } from '@tweenjs/tween.js'
import { Vector3 } from 'three'

import { getCellPosition, waypoints } from 'lib/config'
import { useMemoryStore } from 'lib/store'

const speed = 0.05
const distanceFromGround = 2

const Enemy = ({ id }) => {
  const ref = useRef(null)
  const tweenRef = useRef(null)
  const decrementLivesLeft = useMemoryStore(s => s.decrementLivesLeft)
  const removeEnemy = useMemoryStore(s => s.removeEnemy)
  const [targetWaypointIndex, setTargetWaypointIndex] = useState(0)
  const targetWaypoint = waypoints[targetWaypointIndex]
  const targetWaypointPosition = getCellPosition(targetWaypoint[0], targetWaypoint[1])
  const targetWaypointVector = new Vector3(
    targetWaypointPosition.x,
    distanceFromGround,
    targetWaypointPosition.z
  )

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
    }
  })

  return (
    <mesh ref={ref} position={[0, distanceFromGround, 0]}>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color="#fff" />
    </mesh>
  )
}

export default Enemy
