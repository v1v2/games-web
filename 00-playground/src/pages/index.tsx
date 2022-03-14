import { useEffect } from 'react'

import Enemy from 'components/Enemy'
import GameLayout from 'components/GameLayout'
import Ground from 'components/Ground'
import { useMemoryStore } from 'lib/store'

const IndexPage = () => {
  const enemies = useMemoryStore(s => s.enemies)
  const spawnEnemy = useMemoryStore(s => s.spawnEnemy)

  console.log(enemies)

  useEffect(() => {
    setInterval(() => {
      spawnEnemy()
    }, 1000)
  }, [])

  return (
    <>
      <Ground />
      {enemies.map(e => (
        <Enemy key={e.id} id={e.id} />
      ))}
    </>
  )
}

IndexPage.wrappers = page => <GameLayout>{page}</GameLayout>

export default IndexPage
