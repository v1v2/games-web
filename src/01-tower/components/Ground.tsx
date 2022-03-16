import { useState } from 'react'

import { Vector3 } from 'three'

import { useMemoryStore } from '01-tower/lib/store'
import { cells, mapSize, towersConfig } from '01-tower/lib/config'
import {
  grayMaterial,
  greenMaterial,
  redMaterial,
  undergroundMaterial,
} from '01-tower/lib/materials'
import { squareGeometry, sphereGeometry, baseGeometry } from '01-tower/lib/geometries'
import { Interactive } from '@codyjasonbennett/xr'

const Cell = ({ i, j }) => {
  const [hovered, setHovered] = useState(false)
  const towers = useMemoryStore(s => s.towers)
  const currentConstruction = useMemoryStore(s => s.currentConstruction)
  const clearCurrentConstruction = useMemoryStore(s => s.clearCurrentConstruction)
  const addTower = useMemoryStore(s => s.addTower)

  const onUniversalHover = () => setHovered(true)
  const onUniversalBlur = () => setHovered(false)

  const onUniversalClick = () => {
    if (currentConstruction && !towers.some(t => t.i === i && t.j === j)) {
      addTower({ type: currentConstruction, i, j })
      clearCurrentConstruction()
    }
  }

  return (
    <>
      <Interactive onSelect={onUniversalClick} onHover={onUniversalHover} onBlur={onUniversalBlur}>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={new Vector3(mapSize / 2 - i * 10 - 5, 0.5, mapSize / 2 - j * 10 - 5)}
          onPointerOver={onUniversalHover}
          onPointerOut={onUniversalBlur}
          onClick={onUniversalClick}
          material={grayMaterial}
          geometry={squareGeometry}
          scale={[9, 9, 1]}
        />
      </Interactive>
      {currentConstruction && hovered && (
        <mesh
          position={new Vector3(mapSize / 2 - i * 10 - 5, 2, mapSize / 2 - j * 10 - 5)}
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
    />
    {cells.map((row, i) =>
      row.map((c, j) =>
        c === 1 ? (
          <Cell i={i} j={j} key={`cell-${i}-${j}`} />
        ) : c === 2 ? (
          <mesh
            key={`cell-${i}-${j}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={new Vector3(mapSize / 2 - i * 10 - 5, 3, mapSize / 2 - j * 10 - 5)}
            material={greenMaterial}
            geometry={baseGeometry}
          />
        ) : c === 3 ? (
          <mesh
            key={`cell-${i}-${j}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={new Vector3(mapSize / 2 - i * 10 - 5, 3, mapSize / 2 - j * 10 - 5)}
            material={redMaterial}
            geometry={baseGeometry}
          />
        ) : null
      )
    )}
  </>
)

export default Ground
