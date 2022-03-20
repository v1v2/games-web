import { useState } from 'react'

import { Interactive } from '@codyjasonbennett/xr'
import { Instance, Instances } from '@react-three/drei'
import { Vector3 } from 'three'

import { useMemoryStore } from '01-tower/lib/store'
import {
  cells,
  emptyCells,
  getCellPosition,
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
import { squareGeometry, sphereGeometry, baseGeometry } from '01-tower/lib/geometries'
import ecs from '01-tower/lib/ecs'

const Tile = ({ rowIndex, colIndex, x, z }) => {
  const towers = useMemoryStore(s => s.towers)
  const currentConstruction = useMemoryStore(s => s.currentConstruction)
  const clearCurrentConstruction = useMemoryStore(s => s.clearCurrentConstruction)
  const addTower = useMemoryStore(s => s.addTower)

  const [hovered, setHovered] = useState(false)

  const onUniversalClick = (i, j) => {
    if (currentConstruction && !towers.some(t => t.i === i && t.j === j)) {
      addTower({ type: currentConstruction, i, j })
      const { x, z } = getCellPosition(i, j)
      ecs.world.createEntity({
        position: { x, y: TOWER_DISANCE_TO_GROUND, z },
        towerType: currentConstruction,
      })
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
          position={[x, TOWER_DISANCE_TO_GROUND, z]}
          geometry={sphereGeometry}
          material={towersConfig[currentConstruction].material}
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
        c === 2 ? (
          <mesh
            key={`cell-${i}-${j}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={new Vector3(mapSize / 2 - i * 10 - 5, 3, mapSize / 2 - j * 10 - 5)}
            material={greenMaterial}
            geometry={baseGeometry}
            castShadow
          />
        ) : c === 3 ? (
          <mesh
            key={`cell-${i}-${j}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={new Vector3(mapSize / 2 - i * 10 - 5, 3, mapSize / 2 - j * 10 - 5)}
            material={redMaterial}
            geometry={baseGeometry}
            castShadow
          />
        ) : null
      )
    )}
  </>
)

export default Ground
