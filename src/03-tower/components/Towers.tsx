import { Interactive } from '@react-three/xr'

import { Instance, Instances } from 'components/PatchedInstances'

import { useMemoryStore } from '03-tower/lib/store'
import { Entities, Entity, useTowerEntities } from '03-tower/lib/ecs'
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

const Towers = () => {
  const towers = useTowerEntities()
  const simpleTowerModel = useSimpleTowerModel()
  const splashTowerModel = useSplashTowerModel()
  const strongTowerModel = useStrongTowerModel()

  const towersByType = [
    { type: 'simple', model: simpleTowerModel },
    { type: 'splash', model: splashTowerModel },
    { type: 'strong', model: strongTowerModel },
  ].map(x => ({ ...x, towers: towers.filter(t => t.towerType === x.type) }))

  return (
    <>
      {towersByType.map(({ model, towers, type }) => (
        <Instances key={type} material={model.material} geometry={model.geometry} castShadow>
          <Entities entities={towers}>{entity => <Tower entity={entity} />}</Entities>
        </Instances>
      ))}
    </>
  )
}

export default Towers
