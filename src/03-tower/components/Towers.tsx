import { Fragment, memo } from 'react'

import { Interactive } from '@react-three/xr'

import { makeInstanceComponents } from 'lib/InstancesTrinity'

import { useMemoryStore } from '03-tower/lib/store'
import { Entity, useTowerEntities } from '03-tower/lib/ecs'
import {
  useSimpleTowerModel,
  useSplashTowerModel,
  useStrongTowerModel,
} from '03-tower/lib/model-hooks'

const SimpleInstancer = makeInstanceComponents()
const SplashInstancer = makeInstanceComponents()
const StrongInstancer = makeInstanceComponents()

const Tower = ({ entity, Instancer }: { entity: Entity; Instancer: typeof SimpleInstancer }) => {
  const currentConstruction = useMemoryStore(s => s.currentConstruction)
  const selectedTower = useMemoryStore(s => s.selectedTower)
  const selectTower = useMemoryStore(s => s.selectTower)

  const onUniversalClick = () => !selectedTower && !currentConstruction && selectTower(entity)

  return (
    <Interactive onSelect={onUniversalClick}>
      <Instancer.Instance
        rotation={[Math.PI / 2, 0, 0]}
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

const TowerMemo = memo(Tower)

const Towers = () => {
  const towers = useTowerEntities()
  const simpleTowerModel = useSimpleTowerModel()
  const splashTowerModel = useSplashTowerModel()
  const strongTowerModel = useStrongTowerModel()

  const towersByType = [
    { type: 'simple', model: simpleTowerModel, Instancer: SimpleInstancer },
    { type: 'splash', model: splashTowerModel, Instancer: SplashInstancer },
    { type: 'strong', model: strongTowerModel, Instancer: StrongInstancer },
  ].map(x => ({ ...x, towers: towers.filter(t => t.towerType === x.type) }))

  return (
    <>
      {towersByType.map(({ model, towers, type, Instancer }) => (
        <Fragment key={type}>
          <Instancer.Root
            key={type}
            material={model.material}
            geometry={model.geometry}
            castShadow
          />
          {towers.map(t => (
            <TowerMemo key={t.id} entity={t} Instancer={Instancer} />
          ))}
        </Fragment>
      ))}
    </>
  )
}

export default Towers
