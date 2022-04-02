import { useEffect, useState } from 'react'

import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { Button, Icon, Stack } from '@chakra-ui/react'
import { useHotkeys } from 'react-hotkeys-hook'

import FullCanvas from 'components/FullCanvas'
import { GunIcon, LaserIcon, SplashIcon } from 'lib/icons'

import { useCurrentConstruction, useMemoryStore } from '03-tower/lib/store'
import { towersConfig } from '03-tower/lib/config'
import { destroyEntity, flushQueue, queueDestroyEntity, useEnemyEntities } from '03-tower/lib/ecs'

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
      enemies.forEach(e => queueDestroyEntity(e))
      flushQueue()
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
        <Stack direction="row" p={2}>
          {currentConstruction ? (
            <Button onClick={() => clearCurrentConstruction()}>Cancel</Button>
          ) : (
            <>
              <Button
                leftIcon={<Icon as={GunIcon} />}
                disabled={money < towersConfig.simple.cost}
                onClick={() => setCurrentConstruction('simple')}
              >
                Simple
              </Button>
              <Button
                leftIcon={<Icon as={SplashIcon} />}
                disabled={money < towersConfig.splash.cost}
                onClick={() => setCurrentConstruction('splash')}
              >
                Splash
              </Button>
              <Button
                leftIcon={<Icon as={LaserIcon} />}
                disabled={money < towersConfig.strong.cost}
                onClick={() => setCurrentConstruction('strong')}
              >
                Laser
              </Button>

              {!isStarted && (
                <Button
                  bgColor="#292"
                  onClick={() => {
                    start()
                    if (!process.env.NEXT_PUBLIC_DISABLE_MUSIC) {
                      music.play()
                    }
                  }}
                >
                  Start
                </Button>
              )}
              {selectedTower && (
                <>
                  <Button
                    onClick={() => {
                      addMoney(Math.round(towersConfig[selectedTower.towerType].cost / 2))
                      destroyEntity(selectedTower)
                      selectTower(null)
                    }}
                  >
                    Sell
                  </Button>
                  <Button onClick={() => selectTower(null)}>Cancel selection</Button>
                </>
              )}
            </>
          )}
        </Stack>
        <div style={{ color: 'white', fontSize: 24 }}>{livesLeft} lives left</div>
        <div style={{ color: 'white', fontSize: 24 }}>Money: ${money}</div>
        <div style={{ color: 'white', fontSize: 24 }}>Wave {wave}</div>
        {isWebGPUEnabled && <div style={{ color: 'white', fontSize: 24 }}>WebGPU!</div>}
      </div>
      <FullCanvas>
        <ambientLight intensity={0.6} />
        <OrbitControls makeDefault maxPolarAngle={Math.PI / 3} minPolarAngle={Math.PI / 3} />
        <OrthographicCamera makeDefault position={[100, 0, 100]} zoom={8} />
        {children}
      </FullCanvas>
    </>
  )
}

export default GameLayout
