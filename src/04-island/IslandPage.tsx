import { useEffect } from 'react'

import { DefaultXRControllers, useController, useXR } from '@react-three/xr'
import { Debug, Physics, useBox, usePlane, useSphere } from '@react-three/cannon'
import { FirstPersonControls, PointerLockControls, Sky } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

import { sphereGeometry, squareGeometry } from '04-island/lib/geometries'
import { greenMaterial, redMaterial } from '04-island/lib/materials'

import FullCanvas from 'components/FullCanvas'
import LeftHandModel from 'components/models/LeftHand'
import RightHandModel from 'components/models/RightHand'
import VRControls from 'components/VRControls'

function Cube(props) {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position: [0, 5, 0],
    rotation: [0.4, 0.2, 0.5],
    ...props,
  }))

  useEffect(() => {
    setInterval(() => api.velocity.set(0, 5, 0), 3000)
  }, [])

  return (
    <mesh receiveShadow castShadow ref={ref}>
      <boxGeometry />
      <meshLambertMaterial color="hotpink" />
    </mesh>
  )
}

const Ball = props => {
  const [ref] = useSphere(() => ({ mass: 10, position: [0, 5, 0], scale: 10, ...props }))

  return <mesh ref={ref} geometry={sphereGeometry} material={redMaterial} />
}

const Ground = props => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))

  return <mesh ref={ref} geometry={squareGeometry} material={greenMaterial} scale={100} />
}

const LeftHand = () => (
  <LeftHandModel
    position={[-0.04, 0.01, 0.13]}
    rotation={[Math.PI / 2, Math.PI / 2, -Math.PI / 9]}
  />
)

const RightHand = () => (
  <RightHandModel
    position={[0.04, 0.01, 0.13]}
    rotation={[Math.PI / 2, -Math.PI / 2, Math.PI / 9]}
  />
)

// For some reason useBox didn't work if the player stuff was directly
// in the descendants. It works with this wrapper.
const PlayerContainer = ({ children }) => {
  const [ref, api] = useBox(() => ({ mass: 60, angularFactor: [0, 1, 0] }))

  const jump = () => {
    api.velocity.set(0, 5, 0)
  }

  return (
    <group ref={ref}>
      {children}
      <VRControls jump={jump} />
    </group>
  )
}

const Player = () => {
  const { player, isPresenting } = useXR()
  const camera = useThree(s => s.camera)
  const leftController = useController('left')
  const rightController = useController('right')

  if (!isPresenting || !leftController || !rightController) {
    return null
  }

  return (
    <PlayerContainer>
      <primitive object={player}>
        <primitive object={camera} />
        <primitive object={leftController.controller}>
          <LeftHand />
        </primitive>
        <primitive object={rightController.controller}>
          <RightHand />
        </primitive>
        <DefaultXRControllers />
      </primitive>
    </PlayerContainer>
  )
}

const IslandGame = () => {
  console.log('island.tsx re-rendered')

  return (
    <>
      <ambientLight intensity={0.7} />

      {/* <FlyControls /> */}
      <FirstPersonControls lookSpeed={0.3} />
      <PointerLockControls />
      {/* <Systems /> */}
      <Physics>
        <Debug color="black" scale={1.1}>
          <Player />
          <Cube position={[0.1, 5, 0]} />
          <Cube position={[0, 10, -1]} />
          <Cube position={[0, 20, -2]} />
          <Ground />
        </Debug>
      </Physics>
      <Sky />
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
    </>
  )
}

const IslandPage = () => (
  <FullCanvas>
    <IslandGame />
  </FullCanvas>
)

export default IslandPage
