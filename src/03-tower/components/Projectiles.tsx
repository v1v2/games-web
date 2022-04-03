import { useEffect, useRef } from 'react'

import { Vector3 } from 'three'

import { makeInstanceComponents } from 'lib/InstancesTrinity'

import { basicOrangeMaterial } from '03-tower/lib/materials'
import { cubeGeometry, sphereGeometry } from '03-tower/lib/geometries'
import { destroyEntity, Entity, Collection } from '03-tower/lib/ecs'

const ImpactInstancer = makeInstanceComponents()
const LaserInstancer = makeInstanceComponents()

const Projectile = ({ entity }: { entity: Entity }) => {
  const {
    segment: { fromX, fromY, fromZ, toX, toY, toZ },
    towerType,
  } = entity
  const towerPos = new Vector3(fromX, fromY, fromZ)
  const enemyPos = new Vector3(toX, toY, toZ)
  const distance = towerPos.distanceTo(enemyPos)

  const betweenPos = towerPos.clone().lerp(enemyPos, 0.5)
  const horizAngle = Math.atan2(enemyPos.z - towerPos.z, enemyPos.x - towerPos.x)
  const horizAngleWtf = -(horizAngle - Math.PI / 2)
  const verticalAngle = Math.atan2(towerPos.y - enemyPos.y, distance)

  const timeoutRef = useRef(null)

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      destroyEntity(entity)
    }, 100)
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <>
      <LaserInstancer.Instance
        position={[betweenPos.x, betweenPos.y, betweenPos.z]}
        rotation={[verticalAngle, horizAngleWtf, 0, 'YZX']}
        scale={[0.3, 0.3, distance]}
      />
      <ImpactInstancer.Instance
        position={[toX, toY, toZ]}
        scale={towerType === 'splash' ? [4, 1, 4] : towerType === 'strong' ? [1, 3, 1] : undefined}
      />
    </>
  )
}

const Projectiles = () => (
  <>
    <LaserInstancer.Root geometry={cubeGeometry} material={basicOrangeMaterial} />
    <ImpactInstancer.Root geometry={sphereGeometry} material={basicOrangeMaterial} />
    <Collection tag="projectile">{entity => <Projectile entity={entity} />}</Collection>
  </>
)

export default Projectiles
