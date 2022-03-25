import { memo } from 'react'

import { Mesh, Vector3 } from 'three'

import { Merged } from 'components/PatchedInstances'

import { basicOrangeMaterial } from '01-tower/lib/materials'
import { cubeGeometry, sphereGeometry } from '01-tower/lib/geometries'
import { Projectile } from '01-tower/lib/types'
import { useProjectilesEntities } from '01-tower/lib/ecs'

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

const ProjectileMemo = memo(Projectile)

const laserMesh = new Mesh(cubeGeometry, basicOrangeMaterial)
const impactMesh = new Mesh(sphereGeometry, basicOrangeMaterial)

const Projectiles = () => {
  const projectiles = useProjectilesEntities()

  return (
    <Merged meshes={[laserMesh, impactMesh]} limit={60}>
      {(LaserMesh, ImpactMesh) =>
        projectiles.map(p => (
          <ProjectileMemo key={p.id} LaserMesh={LaserMesh} ImpactMesh={ImpactMesh} {...p.segment} />
        ))
      }
    </Merged>
  )
}

export default Projectiles
