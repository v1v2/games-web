import { FC, forwardRef, useLayoutEffect, useRef } from 'react'

import { useFrame, InstancedMeshProps, GroupProps } from '@react-three/fiber'
import { IEntity } from 'miniplex'
import { createECS } from 'miniplex-react'
import mergeRefs from 'react-merge-refs'
import { Group, InstancedMesh, Object3D } from 'three'

type InstanceEntity = {
  instance: {
    /** The Three.js scene object defining this instance's transform. */
    sceneObject: Object3D
  }
} & IEntity

export const makeInstanceComponents = () => {
  /* We're using Miniplex as a state container. */
  const ecs = createECS<InstanceEntity>()

  /* This component renders the InstancedMesh itself and continuously updates it
     from the data in the ECS. */
  const Root: FC<InstancedMeshProps & { countStep?: number }> = ({
    children,
    countStep = 1000,
    ...props
  }) => {
    const instancedMesh = useRef<InstancedMesh>(null!)

    /* The following hook will make sure this entire component gets re-rendered when
       the number of instance entities changes. We're using this to dynamically grow
       or shrink the instance buffer. */
    const { entities } = ecs.useArchetype('instance')

    const instanceLimit = Math.floor(entities.length / countStep + 1) * countStep

    function updateInstances() {
      const l = entities.length
      for (let i = 0; i < l; i++) {
        const { instance } = entities[i]
        instancedMesh.current!.setMatrixAt(i, instance.sceneObject.matrixWorld)
      }

      instancedMesh.current.instanceMatrix.needsUpdate = true
      instancedMesh.current.count = entities.length
    }

    useFrame(updateInstances)

    return (
      <instancedMesh ref={instancedMesh} {...props} args={[null!, null!, instanceLimit]}>
        {children}
      </instancedMesh>
    )
  }

  /* The Instance component will create a new ECS entity storing a reference
     to a three.js scene object. */
  const Instance = forwardRef<Group, GroupProps>(({ children, ...groupProps }, ref) => {
    const group = useRef<Group>(null!)

    useLayoutEffect(() => {
      const entity = ecs.world.createEntity({
        instance: {
          sceneObject: group.current,
        },
      })

      return () => ecs.world.destroyEntity(entity)
    }, [])

    return (
      <group ref={mergeRefs([ref, group])} {...groupProps}>
        {children}
      </group>
    )
  })

  return { world: ecs.world, useArchetype: ecs.useArchetype, Root, Instance }
}
