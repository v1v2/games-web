import { memo } from 'react'

import { Vector3 } from 'three'

import { makeInstanceComponents } from 'lib/InstancesTrinity'

import { basicOrangeMaterial } from '03-tower/lib/materials'
import { cubeGeometry, sphereGeometry } from '03-tower/lib/geometries'
import { useProjectilesEntities } from '03-tower/lib/ecs'

const ImpactInstancer = makeInstanceComponents()
const LaserInstancer = makeInstanceComponents()

const Projectile = ({ fromX, toX, fromZ, toZ }) => {
  const towerPos = new Vector3(fromX, 2, fromZ)
  const enemyPos = new Vector3(toX, 2, toZ)
  const distance = towerPos.distanceTo(enemyPos)

  const betweenPos = towerPos.clone().lerp(enemyPos, 0.5)
  const angle = Math.atan2(enemyPos.z - towerPos.z, enemyPos.x - towerPos.x)
  const lookAngle = -(angle - Math.PI / 2)

  return (
    <group position={[-999, -999, -999]}>
      <LaserInstancer.Instance
        position={[betweenPos.x, betweenPos.y, betweenPos.z]}
        rotation={[0, lookAngle, 0]}
        scale={[0.3, 0.3, distance]}
      />
      <ImpactInstancer.Instance position={[toX, 3, toZ]} />
    </group>
  )
}

const ProjectileMemo = memo(Projectile)

const Projectiles = () => {
  const projectiles = useProjectilesEntities()

  return (
    <>
      <group position={[999, 999, 999]}>
        <LaserInstancer.Root geometry={cubeGeometry} material={basicOrangeMaterial} />
        <ImpactInstancer.Root geometry={sphereGeometry} material={basicOrangeMaterial} />
      </group>

      {projectiles.map(p => (
        <ProjectileMemo key={p.id} {...p.segment} />
      ))}
    </>
  )
}

export default Projectiles
