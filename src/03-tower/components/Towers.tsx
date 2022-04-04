import { Interactive } from '@react-three/xr'

import { Instance, Instances } from 'components/PatchedInstances'

import { useMemoryStore } from '03-tower/lib/store'
import { ManagedEntities, Entity } from '03-tower/lib/ecs'
import {
  useSimpleTowerModel,
  useSplashTowerModel,
  useStrongTowerModel,
} from '03-tower/lib/model-hooks'

const Tower = ({ entity }: { entity: Entity }) => {
  const currentConstruction = useMemoryStore(s => s.currentConstruction)
  const selectedTower = useMemoryStore(s => s.selectedTower)
  const selectTower = useMemoryStore(s => s.selectTower)

  const onUniversalClick = () => !selectedTower && !currentConstruction && selectTower(entity)

  return (
    <Interactive onSelect={onUniversalClick}>
      <Instance
        rotation-x={Math.PI / 2}
        scale={0.04}
        position={[
          entity.transform.position.x,
          entity.transform.position.y - 1.4,
          entity.transform.position.z,
        ]}
        onClick={onUniversalClick}
      />
    </Interactive>
  )
}

const Towers = () => (
  <>
    <Instances {...useSimpleTowerModel()} castShadow>
      <ManagedEntities tag="tower:simple">{entity => <Tower entity={entity} />}</ManagedEntities>
    </Instances>
    <Instances {...useSplashTowerModel()} castShadow>
      <ManagedEntities tag="tower:splash">{entity => <Tower entity={entity} />}</ManagedEntities>
    </Instances>
    <Instances {...useStrongTowerModel()} castShadow>
      <ManagedEntities tag="tower:strong">{entity => <Tower entity={entity} />}</ManagedEntities>
    </Instances>
  </>
)

export default Towers
