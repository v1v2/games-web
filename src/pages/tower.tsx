import { useEffect, useRef } from 'react'

import { useFrame } from '@react-three/fiber'
import { Vector3, Quaternion, Euler } from 'three'

import Enemy from '01-tower/components/Enemy'
import GameLayout from '01-tower/components/GameLayout'
import Ground from '01-tower/components/Ground'
import { useMemoryStore } from '01-tower/lib/store'
import Tower from '01-tower/components/Tower'
import Projectile from '01-tower/components/Projectile'

// const distanceFromGround = 2

// let enemyisGoingPositive = true

// const initialEnemyPos = new Vector3(-5, distanceFromGround, 0)
// const initialTowerPos = new Vector3(5, distanceFromGround, 0)

const IndexPage = () => {
  const isStarted = useMemoryStore(s => s.isStarted)
  const wave = useMemoryStore(s => s.wave)
  const enemies = useMemoryStore(s => s.enemies)
  const spawnEnemy = useMemoryStore(s => s.spawnEnemy)
  const towers = useMemoryStore(s => s.towers)
  const projectiles = useMemoryStore(s => s.projectiles)
  const spawnTimerRef = useRef(0)

  const enemyRef = useRef(null)
  const towerRef = useRef(null)
  const laserRef = useRef(null)

  useFrame((state, delta) => {
    if (isStarted) {
      spawnTimerRef.current += delta
      if (spawnTimerRef.current > 1) {
        spawnTimerRef.current = 0
        const typeIndex = Math.floor(Math.random() * 10) % 4
        // @ts-ignore
        spawnEnemy(['basic', 'fast', 'tank', 'boss'][typeIndex], 50 + wave * 50)
      }
    }
    // if (enemyisGoingPositive) {
    //   enemyRef.current.position.z += 0.1
    // } else {
    //   enemyRef.current.position.z -= 0.1
    // }
    // if (enemyRef.current.position.z <= -3) {
    //   enemyisGoingPositive = true
    // }
    // if (enemyRef.current.position.z >= 3) {
    //   enemyisGoingPositive = false
    // }

    // This works
    // const towerPos = towerRef.current.position
    // const enemyPos = enemyRef.current.position
    // const betweenPos = towerPos.clone().lerp(enemyPos, 0.5)
    // const angle = Math.atan2(enemyPos.z - towerPos.z, enemyPos.x - towerPos.x)
    // const lookAngle = -(angle - Math.PI / 2)
    // towerRef.current.rotation.y = lookAngle
    // laserRef.current.position.x = betweenPos.x
    // laserRef.current.position.z = betweenPos.z
    // laserRef.current.rotation.y = lookAngle
  })
  // const enemyPos = new Vector3(-5, distanceFromGround, 5)

  // const dir = enemyPos.sub(originPos)
  // const lookRot = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir)
  // const rot = lookRot.
  // console.log(dir)

  return (
    <>
      <Ground />
      {enemies.map(e => (
        <Enemy key={e.id} id={e.id} />
      ))}
      {towers.map(t => (
        <Tower key={t.id} id={t.id} />
      ))}
      {projectiles.map(p => (
        <Projectile key={p.id} id={p.id} />
      ))}
      {/* <group ref={towerRef} position={initialTowerPos}>
        <mesh position={[0, 0, 1]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#0f0" />
        </mesh>
        <mesh>
          <boxGeometry args={[0.5, 10, 0.5]} />
          <meshStandardMaterial color="#f60" />
        </mesh>
      </group>
      <mesh ref={enemyRef} position={initialEnemyPos}>
        <boxGeometry args={[0.5, 10, 0.5]} />
        <meshStandardMaterial color="#f00" />
      </mesh>
      <mesh ref={laserRef}>
        <boxGeometry args={[0.3, 0.3, 5]} />
      </mesh> */}
    </>
  )
}

IndexPage.wrappers = page => <GameLayout>{page}</GameLayout>

export default IndexPage
