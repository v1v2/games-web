import { useRef, MutableRefObject } from 'react'

import { useFrame } from '@react-three/fiber'
import { Object3D } from 'three'

import { Entity } from '01-tower/lib/ecs'

export const useUpdatePosition = ({
  entity,
  ref,
  modify,
}: {
  entity: Entity
  ref?: MutableRefObject<Object3D>
  modify?: (position: { x: number; y: number; z: number }) => { x?: number; y?: number; z?: number }
}) => {
  const newRef = useRef<Object3D>(null)
  const refToUse = ref ?? newRef

  useFrame(() => {
    const { x = 0, y = 0, z = 0 } = modify ? modify({ ...entity.position }) : { x: 0, y: 0, z: 0 }
    if (refToUse?.current?.position) {
      refToUse.current.position.x = entity.position.x + x
      refToUse.current.position.y = entity.position.y + y
      refToUse.current.position.z = entity.position.z + z
    }
  })

  // TODO: Fix typing
  return refToUse as any
}
