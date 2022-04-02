import { ForwardedRef, forwardRef } from 'react'

import { Instances as DreiInstances, Merged as DreiMerged } from '@react-three/drei'
export { Instance } from '@react-three/drei'
import { InstancedMesh } from 'three'

import { BRING_BACK_POS, MOVE_AWAY_POS } from 'lib/InstancesTrinity'

export const Instances = forwardRef((props: any, ref: ForwardedRef<InstancedMesh>) => {
  const { children, ...rest } = props

  return (
    <DreiInstances ref={ref} position={MOVE_AWAY_POS} {...rest}>
      <group position={BRING_BACK_POS}>{children}</group>
    </DreiInstances>
  )
})

export const Merged = (props: any) => {
  const { children, ...rest } = props

  return (
    // Use contants instead of -500 and 1000 when I have a use case
    <DreiMerged position={-500} {...rest}>
      {(...args) => <group position={1000}>{children(...args)}</group>}
    </DreiMerged>
  )
}
