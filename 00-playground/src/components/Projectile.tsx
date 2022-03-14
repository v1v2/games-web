import { useCallback, useEffect, useMemo, useRef } from 'react'

import { Mesh, Vector3 } from 'three'

import { useMemoryStore } from 'lib/store'

const Projectile = ({ id }) => {
  const getProjectile = useMemoryStore(s => s.getProjectile)
  const removeProjectile = useMemoryStore(s => s.removeProjectile)
  const { fromX, fromZ, toX, toZ } = getProjectile(id)

  useEffect(() => {
    setTimeout(() => removeProjectile(id), 100)
  }, [])

  const fromVector = new Vector3(fromX, 2, fromZ)
  const toVector = new Vector3(toX, 2, toZ)
  const distance = fromVector.distanceTo(toVector)
  // const towerVector = new Vector3(fromX, 2, fromZ /*+ distance / 2*/)
  const towerVector = fromVector
  const angle = fromVector.angleTo(toVector)
  // const angle = Math.atan2(toZ - fromZ, toX - fromX)
  // console.log(angle)

  // const ref = useRef()
  // const points = useMemo(() => [fromVector, toVector], [])
  const onUpdate = useCallback(
    (self: Mesh) => {
      self.setRotationFromAxisAngle(new Vector3(0, 1, 0), Math.PI * angle)
      // self.translateOnAxis(new Vector3(1, 0, 0), distance / 2)
    },
    [angle]
  )

  return (
    <>
      <mesh position={towerVector} onUpdate={onUpdate}>
        <boxGeometry args={[0.3, 0.3, distance]} />
      </mesh>
      <mesh position={[toX, 3, toZ]}>
        {/* <planeGeometry args={[1, 1]} /> */}
        <sphereGeometry args={[3, 3, 10, 10, 10]} />
        <meshStandardMaterial color="#f60" />
      </mesh>
    </>
  )
}

export default Projectile
