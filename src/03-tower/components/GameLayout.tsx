import { useEffect, useState } from 'react'

import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { useHotkeys } from 'react-hotkeys-hook'

import FullCanvas from 'components/FullCanvas'

import { useCurrentConstruction, useMemoryStore } from '03-tower/lib/store'
import { towersConfig } from '03-tower/lib/config'
import { destroyEntity, useEnemyEntities } from '03-tower/lib/ecs'

const music =
  typeof window !== 'undefined' && new Audio('/03-tower/audio/Quincas Moreira - Chtulthu.mp3')

const GameLayout = ({ children }) => {
  const { currentConstruction, setCurrentConstruction, clearCurrentConstruction } =
    useCurrentConstruction()
  const [isWebGPUEnabled, setIsWebGPUEnabled] = useState(false)
  const selectedTower = useMemoryStore(s => s.selectedTower)
  const addMoney = useMemoryStore(s => s.addMoney)
  const isStarted = useMemoryStore(s => s.isStarted)
  const selectTower = useMemoryStore(s => s.selectTower)
  const start = useMemoryStore(s => s.start)
  const wave = useMemoryStore(s => s.wave)
  const livesLeft = useMemoryStore(s => s.livesLeft)
  const money = useMemoryStore(s => s.money)
  const enemies = useEnemyEntities()

  // console.log('GameLayout re-rendered')

  useEffect(() => {
    if ('gpu' in navigator) {
      setIsWebGPUEnabled(true)
    }
  }, [])

  useEffect(() => {
    if (livesLeft <= 0) {
      enemies.forEach(e => destroyEntity(e))
      console.log(`You lost at wave ${wave}!`)
      // window.location.reload()
    }
  }, [livesLeft])

  useHotkeys('esc', () => {
    clearCurrentConstruction()
    selectTower(null)
  })

  return (
    <>
      <div style={{ position: 'fixed', zIndex: 1 }}>
        {currentConstruction ? (
          <button onClick={() => clearCurrentConstruction()}>Cancel</button>
        ) : (
          <>
            <button
              disabled={money < towersConfig.simple.cost}
              onClick={() => setCurrentConstruction('simple')}
            >
              Simple Tower
            </button>
            <button
              disabled={money < towersConfig.splash.cost}
              onClick={() => setCurrentConstruction('splash')}
            >
              Splash Tower
            </button>
            <button
              disabled={money < towersConfig.strong.cost}
              onClick={() => setCurrentConstruction('strong')}
            >
              Strong Tower
            </button>
          </>
        )}
        {selectedTower && (
          <>
            <button
              onClick={() => {
                addMoney(Math.round(towersConfig[selectedTower.towerDetails.type].cost / 2))
                destroyEntity(selectedTower)
                selectTower(null)
              }}
            >
              Sell
            </button>
            <button onClick={() => selectTower(null)}>Cancel selection</button>
          </>
        )}
        <div style={{ color: 'white', fontSize: 24 }}>{livesLeft} lives left</div>
        <div style={{ color: 'white', fontSize: 24 }}>Money: ${money}</div>
        <div style={{ color: 'white', fontSize: 24 }}>Wave {wave}</div>
        {isWebGPUEnabled && <div style={{ color: 'white', fontSize: 24 }}>WebGPU!</div>}
        {!isStarted && (
          <div>
            <button
              onClick={() => {
                start()
                if (!process.env.NEXT_PUBLIC_DISABLE_MUSIC) {
                  music.play()
                }
              }}
            >
              Start
            </button>
          </div>
        )}
      </div>
      <FullCanvas>
        <ambientLight intensity={0.7} />
        <OrbitControls makeDefault maxPolarAngle={Math.PI / 3} minPolarAngle={Math.PI / 3} />
        <OrthographicCamera makeDefault position={[100, 0, 100]} zoom={8} />
        {children}
      </FullCanvas>
    </>
  )
}

export default GameLayout
