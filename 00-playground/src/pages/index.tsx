import { useEffect, useRef } from 'react'

import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

import Enemy from 'components/Enemy'
import GameLayout from 'components/GameLayout'
import Ground from 'components/Ground'
import { useMemoryStore } from 'lib/store'
import Tower from 'components/Tower'
import Projectile from 'components/Projectile'

const IndexPage = () => {
  const enemies = useMemoryStore(s => s.enemies)
  const spawnEnemy = useMemoryStore(s => s.spawnEnemy)
  const towers = useMemoryStore(s => s.towers)
  const projectiles = useMemoryStore(s => s.projectiles)
  const spawnTimerRef = useRef(0)

  useFrame((state, delta) => {
    spawnTimerRef.current += delta
    if (spawnTimerRef.current > 1) {
      spawnTimerRef.current = 0
      spawnEnemy()
    }
  })

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
    </>
  )
}

IndexPage.wrappers = page => <GameLayout>{page}</GameLayout>

export default IndexPage
