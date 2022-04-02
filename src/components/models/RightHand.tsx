/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    r_handMeshNode: THREE.SkinnedMesh
    wrist: THREE.Bone
    ['thumb-metacarpal']: THREE.Bone
    ['thumb-phalanx-proximal']: THREE.Bone
    ['thumb-phalanx-distal']: THREE.Bone
    ['thumb-tip']: THREE.Bone
    ['index-finger-metacarpal']: THREE.Bone
    ['index-finger-phalanx-proximal']: THREE.Bone
    ['index-finger-phalanx-intermediate']: THREE.Bone
    ['index-finger-phalanx-distal']: THREE.Bone
    ['index-finger-tip']: THREE.Bone
    ['middle-finger-metacarpal']: THREE.Bone
    ['middle-finger-phalanx-proximal']: THREE.Bone
    ['middle-finger-phalanx-intermediate']: THREE.Bone
    ['middle-finger-phalanx-distal']: THREE.Bone
    ['middle-finger-tip']: THREE.Bone
    ['ring-finger-metacarpal']: THREE.Bone
    ['ring-finger-phalanx-proximal']: THREE.Bone
    ['ring-finger-phalanx-intermediate']: THREE.Bone
    ['ring-finger-phalanx-distal']: THREE.Bone
    ['ring-finger-tip']: THREE.Bone
    ['pinky-finger-metacarpal']: THREE.Bone
    ['pinky-finger-phalanx-proximal']: THREE.Bone
    ['pinky-finger-phalanx-intermediate']: THREE.Bone
    ['pinky-finger-phalanx-distal']: THREE.Bone
    ['pinky-finger-tip']: THREE.Bone
  }
  materials: {
    lambert2: THREE.MeshStandardMaterial
  }
}

export default function Model({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  // @ts-ignore
  const { nodes, materials } = useGLTF('/right-hand.glb') as GLTFResult
  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={nodes.wrist} />
      <primitive object={nodes['thumb-metacarpal']} />
      <primitive object={nodes['thumb-phalanx-proximal']} />
      <primitive object={nodes['thumb-phalanx-distal']} />
      <primitive object={nodes['thumb-tip']} />
      <primitive object={nodes['index-finger-metacarpal']} />
      <primitive object={nodes['index-finger-phalanx-proximal']} />
      <primitive object={nodes['index-finger-phalanx-intermediate']} />
      <primitive object={nodes['index-finger-phalanx-distal']} />
      <primitive object={nodes['index-finger-tip']} />
      <primitive object={nodes['middle-finger-metacarpal']} />
      <primitive object={nodes['middle-finger-phalanx-proximal']} />
      <primitive object={nodes['middle-finger-phalanx-intermediate']} />
      <primitive object={nodes['middle-finger-phalanx-distal']} />
      <primitive object={nodes['middle-finger-tip']} />
      <primitive object={nodes['ring-finger-metacarpal']} />
      <primitive object={nodes['ring-finger-phalanx-proximal']} />
      <primitive object={nodes['ring-finger-phalanx-intermediate']} />
      <primitive object={nodes['ring-finger-phalanx-distal']} />
      <primitive object={nodes['ring-finger-tip']} />
      <primitive object={nodes['pinky-finger-metacarpal']} />
      <primitive object={nodes['pinky-finger-phalanx-proximal']} />
      <primitive object={nodes['pinky-finger-phalanx-intermediate']} />
      <primitive object={nodes['pinky-finger-phalanx-distal']} />
      <primitive object={nodes['pinky-finger-tip']} />
      <skinnedMesh geometry={nodes.r_handMeshNode.geometry} material={materials.lambert2} skeleton={nodes.r_handMeshNode.skeleton} />
    </group>
  )
}

useGLTF.preload('/right-hand.glb')