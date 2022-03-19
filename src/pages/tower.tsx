import { useEffect, useRef } from 'react'

import { useFrame, useThree } from '@react-three/fiber'
import { DefaultXRControllers, Interactive, useXR } from '@codyjasonbennett/xr'

import Enemies from '01-tower/components/Enemies'
import GameLayout from '01-tower/components/GameLayout'
import Ground from '01-tower/components/Ground'
import { isAliveSelector, useMemoryStore } from '01-tower/lib/store'
import Towers from '01-tower/components/Towers'
// import Projectile from '01-tower/components/Projectile'
import { cubeGeometry, sphereGeometry } from '01-tower/lib/geometries'
import { blueMaterial, greenMaterial, redMaterial } from '01-tower/lib/materials'
import ecs from '01-tower/lib/ecs'
import { detailedWaypoints, enemiesConfig, ENEMY_DISTANCE_TO_GROUND } from '01-tower/lib/config'
import { EnemyType } from '01-tower/lib/types'
import Systems from '01-tower/components/Systems'
import Projectiles from '01-tower/components/Projectiles'

const IndexPage = () => {
  const isStarted = useMemoryStore(s => s.isStarted)
  const wave = useMemoryStore(s => s.wave)
  const setCurrentConstruction = useMemoryStore(s => s.setCurrentConstruction)
  const clearCurrentConstruction = useMemoryStore(s => s.clearCurrentConstruction)
  const start = useMemoryStore(s => s.start)
  const spawnTimerRef = useRef(0)
  const isAlive = useMemoryStore(isAliveSelector)

  const { camera } = useThree()
  const { isPresenting, player, controllers } = useXR()

  const cameraRigRef = useRef(null)
  const uiRef = useRef(null)

  console.log('tower re-rendered')

  // useEffect(() => {}, [])

  useEffect(() => {
    if (isPresenting) {
      player.removeFromParent()
      cameraRigRef.current.add(player)

      // player.add(uiRef.current)
      // console.log(controllers?.[0]?.controller)
      if (controllers?.[0]?.controller) {
        // console.log('ADD')
        // uiRef.current.removeFromParent()
        // controllers[0].controller.add(uiRef.current)
      }
      uiRef.current.visible = true
    } else {
      uiRef.current.visible = false
    }
  }, [isPresenting, JSON.stringify(controllers?.[0]?.controller)])

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
        const { hpFactor, value } = enemiesConfig[type]
        const baseHp = 50 + wave * 70
        const hp = hpFactor * baseHp
        const firstWaypoint = detailedWaypoints[0]
        ecs.world.createEntity({
          position: { x: firstWaypoint.x, y: ENEMY_DISTANCE_TO_GROUND, z: firstWaypoint.z },
          enemyDetails: {
            type,
            currentHealth: hp,
            maxHealth: hp,
            value: Math.floor(value * (1 + wave * 0.3)),
          },
        })
      }
    }
  })

  return (
    <>
      <Ground />
      <Enemies />
      <Systems />
      <Towers />
      <Projectiles />

      <group ref={cameraRigRef} position={[70, 70, 70]}>
        <primitive object={camera} />
      </group>
      <group ref={uiRef} visible={false} position={[-100, 0, 0]}>
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

IndexPage.wrappers = page => <GameLayout>{page}</GameLayout>

export default IndexPage
