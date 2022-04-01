import { Suspense, useEffect, useRef } from 'react'

import { useFrame } from '@react-three/fiber'
import { DefaultXRControllers, Interactive, useXR } from '@react-three/xr'
import { Billboard, Text } from '@react-three/drei'
import { Object3D } from 'three'

import Enemies from '03-tower/components/Enemies'
import GameLayout from '03-tower/components/GameLayout'
import Ground from '03-tower/components/Ground'
import { isAliveSelector, useMemoryStore } from '03-tower/lib/store'
import Towers from '03-tower/components/Towers'
import { cubeGeometry, sphereGeometry } from '03-tower/lib/geometries'
import { blueMaterial, greenMaterial, redMaterial } from '03-tower/lib/materials'
import { createEnemy } from '03-tower/lib/ecs'
import { enemiesConfig } from '03-tower/lib/config'
import { EnemyType } from '03-tower/lib/types'
import Systems from '03-tower/components/Systems'
import Projectiles from '03-tower/components/Projectiles'

// This component is to contain useThree because it causes re-renders
// Ideally, it should be only the camera in that component, but it's okay for now.
const PlayerEnv = () => {
  const setCurrentConstruction = useMemoryStore(s => s.setCurrentConstruction)
  const clearCurrentConstruction = useMemoryStore(s => s.clearCurrentConstruction)
  const start = useMemoryStore(s => s.start)
  const wave = useMemoryStore(s => s.wave)

  const { isPresenting, player, controllers } = useXR()

  const uiRef = useRef<Object3D>(null)

  useEffect(() => {
    if (isPresenting) {
      player.position.x = 60
      player.position.y = 50
      player.position.z = 60
      player.rotation.y = Math.PI / 4
      uiRef.current.visible = true
    } else {
      player.position.x = 50
      player.position.y = 50
      player.position.z = 50
      player.rotation.y = 0
      uiRef.current.visible = false
    }
  }, [isPresenting, JSON.stringify(controllers?.[0]?.controller)])

  return (
    <>
      <group ref={uiRef} visible={false} position={[-100, 0, 0]}>
        <Billboard position={[0, 50, 0]} scale={[10, 10, 1]}>
          <Suspense fallback={null}>
            <Text fontSize={1}>Wave {wave}</Text>
          </Suspense>
        </Billboard>
        <Interactive onSelect={() => setCurrentConstruction('simple')}>
          <mesh scale={[3, 3, 3]} geometry={sphereGeometry} material={greenMaterial} />
        </Interactive>
        <Interactive onSelect={() => setCurrentConstruction('splash')}>
          <mesh
            position={[0, 0, 20]}
            scale={[3, 3, 3]}
            geometry={sphereGeometry}
            material={redMaterial}
          />
        </Interactive>
        <Interactive onSelect={() => setCurrentConstruction('strong')}>
          <mesh
            position={[0, 0, 40]}
            scale={[3, 3, 3]}
            geometry={sphereGeometry}
            material={blueMaterial}
          />
        </Interactive>
        <Interactive onSelect={() => start()}>
          <mesh
            position={[0, 30, 0]}
            scale={[10, 10, 10]}
            geometry={cubeGeometry}
            material={greenMaterial}
          />
        </Interactive>
        <Interactive onSelect={() => clearCurrentConstruction()}>
          <mesh
            position={[0, 30, 20]}
            scale={[10, 10, 10]}
            geometry={cubeGeometry}
            material={redMaterial}
          />
        </Interactive>
      </group>
      <DefaultXRControllers />
    </>
  )
}

const TowerPage = () => {
  const isStarted = useMemoryStore(s => s.isStarted)
  const wave = useMemoryStore(s => s.wave)
  const spawnTimerRef = useRef(0)
  const isAlive = useMemoryStore(isAliveSelector)

  // console.log('tower re-rendered')

  useEffect(() => {
    if ('gpu' in navigator) {
      console.log('WebGPU supported')
    }
  }, [])

  useFrame((state, delta) => {
    if (isStarted && isAlive) {
      spawnTimerRef.current += delta
      if (spawnTimerRef.current > 1) {
        spawnTimerRef.current = 0
        const typeIndex = Math.floor(Math.random() * 10) % 4
        const type = ['basic', 'fast', 'tank', 'boss'][typeIndex] as EnemyType
        const { hpFactor, killRewardFactor } = enemiesConfig[type]
        const baseHp = 50 + wave * 70
        const maxHealth = hpFactor * baseHp
        createEnemy({
          type,
          maxHealth,
          killReward: Math.floor(killRewardFactor * (1 + wave * 0.3)),
        })
      }
    }
  })
  // useHelper(ref, DirectionalLightHelper, 1)

  return (
    <>
      <Ground />
      <Towers />
      <Enemies />
      <Systems />
      <Projectiles />
      <PlayerEnv />
      <directionalLight
        position={[10, 40, -20]}
        intensity={0.7}
        castShadow
        shadow-bias={-0.001}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
      />

      {/* 
      
      // This completely breaks VR
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={1} height={500} intensity={0.05} />
      </EffectComposer> */}
    </>
  )
}

TowerPage.wrappers = page => <GameLayout>{page}</GameLayout>

export default TowerPage
