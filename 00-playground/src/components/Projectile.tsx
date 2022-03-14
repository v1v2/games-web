import { useEffect, useRef } from 'react'

import { useMemoryStore } from 'lib/store'

const Projectile = ({ id }) => {
  const getProjectile = useMemoryStore(s => s.getProjectile)
  const removeProjectile = useMemoryStore(s => s.removeProjectile)
  const { fromX, fromZ, toX, toZ } = getProjectile(id)

  useEffect(() => {
    setTimeout(() => removeProjectile(id), 100)
  }, [])

  return (
    <mesh position={[toX, 3, toZ]}>
      <sphereGeometry args={[3, 3, 10, 10, 10]} />
      <meshStandardMaterial color="#f60" />
    </mesh>
  )
}

export default Projectile
