import { ForwardedRef, forwardRef } from 'react'

import { Instances } from '@react-three/drei'
import { InstancedMesh } from 'three'

const PatchedInstances = forwardRef((props: any, ref: ForwardedRef<InstancedMesh>) => (
  <Instances ref={ref} position={[999, 999, 999]} {...props}>
    <group position={[-999, -999, -999]}>{props.children}</group>
  </Instances>
))

export default PatchedInstances
