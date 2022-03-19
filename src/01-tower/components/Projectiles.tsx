import { useEffect, useState } from 'react'

import { Mesh, Vector3 } from 'three'

import { orangeMaterial } from '01-tower/lib/materials'
import { cubeGeometry, sphereGeometry } from '01-tower/lib/geometries'
import { Merged } from '@react-three/drei'
import { subscribeCreateProjectile } from '01-tower/lib/pubsub'
import { Projectile } from '01-tower/lib/types'

const Projectile = ({ fromX, toX, fromZ, toZ, LaserMesh, ImpactMesh }) => {
  const towerPos = new Vector3(fromX, 2, fromZ)
  const enemyPos = new Vector3(toX, 2, toZ)
  const distance = towerPos.distanceTo(enemyPos)

  const betweenPos = towerPos.clone().lerp(enemyPos, 0.5)
  const angle = Math.atan2(enemyPos.z - towerPos.z, enemyPos.x - towerPos.x)
  const lookAngle = -(angle - Math.PI / 2)

  return (
    <>
      <LaserMesh
        position={[betweenPos.x, betweenPos.y, betweenPos.z]}
        rotation={[0, lookAngle, 0]}
        scale={[0.3, 0.3, distance]}
      />
      <ImpactMesh position={[toX, 3, toZ]} />
    </>
  )
}

const laserMesh = new Mesh(cubeGeometry, orangeMaterial)
const impactMesh = new Mesh(sphereGeometry, orangeMaterial)

const Projectiles = () => {
  const [projectiles, setProjectiles] = useState([])

  useEffect(() => {
    const unsub = subscribeCreateProjectile((projectile: Projectile) => {
      setProjectiles(x => [...x, projectile])
      setTimeout(() => setProjectiles(x => x.filter(p => p.id !== projectile.id)), 100)
    })

    return () => {
      unsub()
    }
  }, [])

  return (
    <Merged meshes={[laserMesh, impactMesh]} limit={30}>
      {(LaserMesh, ImpactMesh) =>
        projectiles.map(p => (
          <Projectile key={p.id} LaserMesh={LaserMesh} ImpactMesh={ImpactMesh} {...p} />
        ))
      }
    </Merged>
  )
}

export default Projectiles
