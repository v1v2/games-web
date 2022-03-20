import { memo } from 'react'

import { Interactive } from '@codyjasonbennett/xr'

import { emptyCells } from '01-tower/lib/config'
import { useMemoryStore } from '01-tower/lib/store'
import { blueMaterial, greenMaterial, redMaterial } from '01-tower/lib/materials'
import { sphereGeometry } from '01-tower/lib/geometries'
import { useTowerEntities } from '01-tower/lib/ecs'
import { Instance, Instances } from '@react-three/drei'

const Tower = ({ entity }) => {
  const currentConstruction = useMemoryStore(s => s.currentConstruction)
  const selectedTower = useMemoryStore(s => s.selectedTower)
  const selectTower = useMemoryStore(s => s.selectTower)

  const onUniversalClick = () => !selectedTower && !currentConstruction && selectTower(entity)

  return (
    <Interactive onSelect={onUniversalClick}>
      <Instance
        position={[entity.position.x, entity.position.y, entity.position.z]}
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
  ].map(x => ({ ...x, towers: towers.filter(e => e.towerDetails.type === x.type) }))

  return (
    <>
      {towersByType.map(({ material, towers, type }) => (
        <Instances
          key={type}
          limit={emptyCells.length}
          material={material}
          geometry={sphereGeometry}
          castShadow
        >
          {towers.map(t => (
            <TowerMemo key={t.id} entity={t} />
          ))}
        </Instances>
      ))}
    </>
  )
}

export default Towers
