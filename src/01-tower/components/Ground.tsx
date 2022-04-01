import { useState } from 'react'

import { Interactive } from '@react-three/xr'

import { Instances, Instance } from 'components/PatchedInstances'

import { useCurrentConstruction, useMemoryStore } from '01-tower/lib/store'
import {
  cells,
  emptyCells,
  mapSize,
  towersConfig,
  TOWER_DISANCE_TO_GROUND,
} from '01-tower/lib/config'
import {
  grayMaterial,
  greenMaterial,
  redMaterial,
  undergroundMaterial,
} from '01-tower/lib/materials'
import { squareGeometry, baseGeometry } from '01-tower/lib/geometries'
import { createTower, useTowerEntities } from '01-tower/lib/ecs'
import {
  useSimpleTowerModel,
  useSplashTowerModel,
  useStrongTowerModel,
} from '01-tower/lib/model-hooks'

const Tile = ({ rowIndex, colIndex, x, z }) => {
  const { currentConstruction, clearCurrentConstruction } = useCurrentConstruction()
  const addMoney = useMemoryStore(s => s.addMoney)
  const towers = useTowerEntities()

  const simpleTowerModel = useSimpleTowerModel()
  const splashTowerModel = useSplashTowerModel()
  const strongTowerModel = useStrongTowerModel()

  const currentConstructionModel =
    currentConstruction === 'simple'
      ? simpleTowerModel
      : currentConstruction === 'splash'
      ? splashTowerModel
      : currentConstruction === 'strong'
      ? strongTowerModel
      : null

  const [hovered, setHovered] = useState(false)

  const onUniversalClick = (i, j) => {
    if (currentConstruction && !towers.some(t => t.cell.rowIndex === i && t.cell.colIndex === j)) {
      addMoney(-towersConfig[currentConstruction].cost)
      createTower({ cell: { rowIndex: i, colIndex: j }, type: currentConstruction })
      clearCurrentConstruction()
    }
  }

  return (
    <>
      <Interactive
        onHover={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onSelect={() => onUniversalClick(rowIndex, colIndex)}
      >
        <Instance
          position={[mapSize / 2 - rowIndex * 10 - 5, 0.5, mapSize / 2 - colIndex * 10 - 5]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[9, 9, 1]}
          onClick={() => onUniversalClick(rowIndex, colIndex)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          receiveShadow
        />
      </Interactive>
      {currentConstruction && hovered && (
        <mesh
          position={[x, TOWER_DISANCE_TO_GROUND - 1.4, z]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.04}
          geometry={currentConstructionModel.geometry}
          material={currentConstructionModel.material}
        />
      )}
    </>
  )
}

const Ground = () => (
  <>
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      material={undergroundMaterial}
      scale={[mapSize + 1, mapSize + 1, 1]}
      geometry={squareGeometry}
      receiveShadow
    />
    <Instances
      limit={emptyCells.length}
      geometry={squareGeometry}
      material={grayMaterial}
      receiveShadow
    >
      {emptyCells.map(ec => (
        <Tile key={`${ec.rowIndex}-${ec.colIndex}`} {...ec} />
      ))}
    </Instances>
    {cells.map((row, i) =>
      row.map((c, j) =>
        c === 2 || c === 3 ? (
          <mesh
            key={`cell-${i}-${j}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[mapSize / 2 - i * 10 - 5, 3, mapSize / 2 - j * 10 - 5]}
            material={c === 2 ? greenMaterial : redMaterial}
            geometry={baseGeometry}
            castShadow
          />
        ) : null
      )
    )}
  </>
)

export default Ground
