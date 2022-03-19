import { useEffect, useRef } from 'react'

import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'

import { useMemoryStore } from '01-tower/lib/store'
import { orangeMaterial } from '01-tower/lib/materials'
import { cubeGeometry, sphereGeometry } from '01-tower/lib/geometries'
import { Merged } from '@react-three/drei'

const Projectile = ({ id }) => {
  const getProjectile = useMemoryStore(s => s.getProjectile)
  const removeProjectile = useMemoryStore(s => s.removeProjectile)
  const { fromX, fromZ, toX, toZ } = getProjectile(id)

  const laserRef = useRef(null)

  useEffect(() => {
    setTimeout(() => removeProjectile(id), 100)
    // TODO: Dispose
  }, [])

  const towerPos = new Vector3(fromX, 2, fromZ)
  const enemyPos = new Vector3(toX, 2, toZ)
  const distance = towerPos.distanceTo(enemyPos)

  useFrame(() => {
    if (laserRef.current) {
      const betweenPos = towerPos.clone().lerp(enemyPos, 0.5)
      const angle = Math.atan2(enemyPos.z - towerPos.z, enemyPos.x - towerPos.x)
      const lookAngle = -(angle - Math.PI / 2)
      // towerRef.current.rotation.y = lookAngle
      laserRef.current.position.x = betweenPos.x
      laserRef.current.position.z = betweenPos.z
      laserRef.current.rotation.y = lookAngle
    }
  })

  return (
    <>
      <mesh
        ref={laserRef}
        position={[null, 2, null]}
        material={orangeMaterial}
        scale={[0.3, 0.3, distance]}
        geometry={cubeGeometry}
      />
      <mesh position={[toX, 3, toZ]} material={orangeMaterial} geometry={sphereGeometry} />
    </>
  )
}

const laserMesh = new Mesh(cubeGeometry, orangeMaterial)
const impactMesh = new Mesh(sphereGeometry, orangeMaterial)

const Projectiles = () => {
  const projectiles = []

  return (
    <Merged meshes={[laserMesh, impactMesh]} limit={30}>
      {(EnemyMesh, HpBarMesh) => null}
    </Merged>
  )
}

export default Projectiles
