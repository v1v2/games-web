import { useRef, MutableRefObject } from 'react'

import { useFrame } from '@react-three/fiber'
import { Object3D } from 'three'

import { Entity } from '03-tower/lib/ecs'

export const useUpdateTransform = ({
  entity,
  ref,
  modify,
}: {
  entity: Entity
  ref?: MutableRefObject<Object3D>
  modify?: (transform: {
    position?: { x?: number; y?: number; z?: number }
    rotation?: { x?: number; y?: number; z?: number }
    scale?: { x?: number; y?: number; z?: number }
  }) => {
    position?: { x?: number; y?: number; z?: number }
    rotation?: { x?: number; y?: number; z?: number }
    scale?: { x?: number; y?: number; z?: number }
  }
}) => {
  const newRef = useRef<Object3D>(null)
  const refToUse = ref ?? newRef

  useFrame(() => {
    const userTransform = modify
      ? modify(entity.transform)
      : { position: {}, rotation: {}, scale: {} }

    if (refToUse?.current) {
      refToUse.current.position.x = userTransform.position?.x ?? entity.transform?.position?.x ?? 0
      refToUse.current.position.y = userTransform.position?.y ?? entity.transform?.position?.y ?? 0
      refToUse.current.position.z = userTransform.position?.z ?? entity.transform?.position?.z ?? 0
      refToUse.current.rotation.x = userTransform.rotation?.x ?? entity.transform?.rotation?.x ?? 0
      refToUse.current.rotation.y = userTransform.rotation?.y ?? entity.transform?.rotation?.y ?? 0
      refToUse.current.rotation.z = userTransform.rotation?.z ?? entity.transform?.rotation?.z ?? 0
      refToUse.current.scale.x = userTransform.scale?.x ?? entity.transform?.scale?.x ?? 1
      refToUse.current.scale.y = userTransform.scale?.y ?? entity.transform?.scale?.y ?? 1
      refToUse.current.scale.z = userTransform.scale?.z ?? entity.transform?.scale?.z ?? 1
    }
  })

  // TODO: Fix typing
  return refToUse as any
}
