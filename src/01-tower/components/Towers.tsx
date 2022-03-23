import { memo } from 'react'

import { Interactive } from '@codyjasonbennett/xr'
import { Instance } from '@react-three/drei'

import PatchedInstances from 'components/PatchedInstances'

import { emptyCells } from '01-tower/lib/config'
import { useMemoryStore } from '01-tower/lib/store'
import { blueMaterial, greenMaterial, redMaterial } from '01-tower/lib/materials'
import { sphereGeometry } from '01-tower/lib/geometries'
import { Entity, useTowerEntities } from '01-tower/lib/ecs'

const Tower = ({ entity }: { entity: Entity }) => {
  const currentConstruction = useMemoryStore(s => s.currentConstruction)
  const selectedTower = useMemoryStore(s => s.selectedTower)
  const selectTower = useMemoryStore(s => s.selectTower)

  const onUniversalClick = () => !selectedTower && !currentConstruction && selectTower(entity)

  return (
    <Interactive onSelect={onUniversalClick}>
      <Instance
        position={[
          entity.transform.position.x,
          entity.transform.position.y,
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

  const towersByType = [
    { type: 'simple', material: greenMaterial },
    { type: 'splash', material: redMaterial },
    { type: 'strong', material: blueMaterial },
  ].map(x => ({ ...x, towers: towers.filter(t => t.towerType === x.type) }))

  return (
    <>
      {towersByType.map(({ material, towers, type }) => (
        <PatchedInstances
          key={type}
          limit={emptyCells.length}
          material={material}
          geometry={sphereGeometry}
          castShadow
        >
          {towers.map(t => (
            <TowerMemo key={t.id} entity={t} />
          ))}
        </PatchedInstances>
      ))}
    </>
  )
}

export default Towers
