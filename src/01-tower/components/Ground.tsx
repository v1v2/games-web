import { useLayoutEffect, useRef, useState } from 'react'

import { Interactive } from '@codyjasonbennett/xr'
import { InstancedMesh, Object3D, Vector3 } from 'three'

import { useMemoryStore } from '01-tower/lib/store'
import { cells, getCellPosition, mapSize, towersConfig } from '01-tower/lib/config'
import {
  grayMaterial,
  greenMaterial,
  redMaterial,
  undergroundMaterial,
} from '01-tower/lib/materials'
import { squareGeometry, sphereGeometry, baseGeometry } from '01-tower/lib/geometries'

type Cell = {
  rowIndex: number
  colIndex: number
  x: number
  z: number
}

// @ts-ignore
const emptyCells: Cell[] = cells.reduce(
  (rowAcc, rowCur, rowIndex) =>
    rowAcc.concat(
      rowCur.reduce((colAcc, colCur, colIndex) => {
        const { x, z } = getCellPosition(rowIndex, colIndex)
        return colAcc.concat(colCur === 1 ? { rowIndex, colIndex, x, z } : [])
      }, [])
    ),
  []
)

const Tiles = () => {
  const towers = useMemoryStore(s => s.towers)
  const currentConstruction = useMemoryStore(s => s.currentConstruction)
  const clearCurrentConstruction = useMemoryStore(s => s.clearCurrentConstruction)
  const addTower = useMemoryStore(s => s.addTower)
  const tilesRef = useRef<InstancedMesh>(null)
  const [hoveredId, setHoveredId] = useState(null)

  const tempObj = new Object3D()
  tempObj.rotation.set(-Math.PI / 2, 0, 0)
  tempObj.scale.set(9, 9, 1)

  useLayoutEffect(() => {
    let matrixIndex = 0
    cells.forEach((row, i) => {
      row.forEach((col, j) => {
        if (col === 1) {
          tempObj.position.set(mapSize / 2 - i * 10 - 5, 0.5, mapSize / 2 - j * 10 - 5)
          tempObj.updateMatrix()
          tilesRef.current.setMatrixAt(matrixIndex, tempObj.matrix)
          matrixIndex++
        }
      })
    })
    console.log(tilesRef.current)
    tilesRef.current.instanceMatrix.needsUpdate = true
  }, [])

  const onUniversalClick = instanceId => {
    const i = emptyCells[instanceId].rowIndex
    const j = emptyCells[instanceId].colIndex
    if (currentConstruction && !towers.some(t => t.i === i && t.j === j)) {
      addTower({ type: currentConstruction, i, j })
      clearCurrentConstruction()
    }
  }

  return (
    <>
      <Interactive
        onHover={e => setHoveredId(e.intersection.instanceId)}
        onBlur={() => setHoveredId(null)}
        onSelect={e => onUniversalClick(e.intersection.instanceId)}
      >
        <instancedMesh
          ref={tilesRef}
          geometry={squareGeometry}
          material={grayMaterial}
          onPointerMove={e => setHoveredId(e.instanceId)}
          onPointerOut={() => setHoveredId(null)}
          onClick={e => onUniversalClick(e.instanceId)}
          args={[null, null, emptyCells.length]}
        />
      </Interactive>
      {currentConstruction && hoveredId && (
        <mesh
          position={[emptyCells[hoveredId].x, 2, emptyCells[hoveredId].z]}
          geometry={sphereGeometry}
          material={towersConfig[currentConstruction].material}
        />
      )}
    </>
  )
}

const Ground = () => {
  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        material={undergroundMaterial}
        scale={[mapSize + 1, mapSize + 1, 1]}
        geometry={squareGeometry}
      />
      <Tiles />
      {cells.map((row, i) =>
        row.map((c, j) =>
          c === 2 ? (
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
}

export default Ground
