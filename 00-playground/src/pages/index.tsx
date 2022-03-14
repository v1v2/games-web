import { useEffect } from 'react'

import Enemy from 'components/Enemy'
import GameLayout from 'components/GameLayout'
import Ground from 'components/Ground'
import { useMemoryStore } from 'lib/store'
import Tower from 'components/Tower'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

const IndexPage = () => {
  const enemies = useMemoryStore(s => s.enemies)
  const spawnEnemy = useMemoryStore(s => s.spawnEnemy)
  const towers = useMemoryStore(s => s.towers)
  const decreaseEnemyHp = useMemoryStore(s => s.decreaseEnemyHp)

  useEffect(() => {
    setInterval(() => {
      spawnEnemy()
    }, 1000)
  }, [])

  useFrame(() => {
    enemies.forEach(e => {
      towers.forEach(t => {
        const enemyVector = new Vector3(e.x, 0, e.z)
        const towerVector = new Vector3(t.x, 0, t.z)
        if (enemyVector.distanceTo(towerVector) < 20) {
          decreaseEnemyHp(e.id, 100)
        }
      })
    })
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
    </>
  )
}

IndexPage.wrappers = page => <GameLayout>{page}</GameLayout>

export default IndexPage
