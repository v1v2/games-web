import { ForwardedRef, forwardRef } from 'react'

import { Instances as DreiInstances, Merged as DreiMerged } from '@react-three/drei'
export { Instance } from '@react-three/drei'
import { InstancedMesh } from 'three'

export const Instances = forwardRef((props: any, ref: ForwardedRef<InstancedMesh>) => {
  const { children, ...rest } = props

  return (
    <DreiInstances ref={ref} position={[999, 999, 999]} {...rest}>
      <group position={[-999, -999, -999]}>{children}</group>
    </DreiInstances>
  )
})

export const Merged = (props: any) => {
  const { children, ...rest } = props

  return (
    <DreiMerged position={[-500, -500, -500]} {...rest}>
      {(...args) => <group position={[1000, 1000, 1000]}>{children(...args)}</group>}
    </DreiMerged>
  )
}
