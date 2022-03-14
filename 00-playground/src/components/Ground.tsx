import { useState } from 'react'

import { Vector3 } from 'three'

import { useMemoryStore } from 'lib/store'
import { cells, mapSize, towersConfig, waypoints } from 'lib/config'

const Cell = ({ i, j }) => {
  const [hovered, setHovered] = useState(false)
  const constructionDetails = useMemoryStore(s => s.constructionDetails)
  const currentConstruction = useMemoryStore(s => s.currentConstruction)
  const clearCurrentConstruction = useMemoryStore(s => s.clearCurrentConstruction)
  const addConstructionDetails = useMemoryStore(s => s.addConstructionDetails)

  const foundConstruction = constructionDetails.find(cd => cd.i === i && cd.j === j)

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={new Vector3(mapSize / 2 - i * 10 - 5, 0.5, mapSize / 2 - j * 10 - 5)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => {
          if (currentConstruction) {
            addConstructionDetails({ type: currentConstruction, i, j })
            clearCurrentConstruction()
          }
        }}
      >
        <planeGeometry args={[9, 9, 1]} />
        <meshStandardMaterial color="#777" />
      </mesh>

      {currentConstruction && hovered && (
        <mesh position={new Vector3(mapSize / 2 - i * 10 - 5, 0.1, mapSize / 2 - j * 10 - 5)}>
          <sphereGeometry args={[5, 5, 10, 10, 10]} />
          <meshStandardMaterial color={towersConfig[currentConstruction].color} />
        </mesh>
      )}
      {foundConstruction && (
        <mesh position={new Vector3(mapSize / 2 - i * 10 - 5, 0.1, mapSize / 2 - j * 10 - 5)}>
          <sphereGeometry args={[5, 5, 10, 10, 10]} />
          <meshStandardMaterial color={towersConfig[foundConstruction.type].color} />
        </mesh>
      )}
    </>
  )
}

const Ground = () => (
  <>
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[mapSize + 1, mapSize + 1, 1]} />
      <meshStandardMaterial color="#333" />
    </mesh>
    {cells.map((row, i) =>
      row.map((c, j) =>
        c === 1 ? (
          <Cell i={i} j={j} key={`cell-${i}-${j}`} />
        ) : c === 2 ? (
          <mesh
            key={`cell-${i}-${j}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={new Vector3(mapSize / 2 - i * 10 - 5, 3, mapSize / 2 - j * 10 - 5)}
          >
            <boxGeometry args={[9, 9, 5]} />
            <meshStandardMaterial color="#3f3" />
          </mesh>
        ) : c === 3 ? (
          <mesh
            key={`cell-${i}-${j}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={new Vector3(mapSize / 2 - i * 10 - 5, 3, mapSize / 2 - j * 10 - 5)}
          >
            <boxGeometry args={[9, 9, 5]} />
            <meshStandardMaterial color="#f33" />
          </mesh>
        ) : null
      )
    )}
    {/* {waypoints.map(([i, j]) => (
      <mesh
        key={`waypoint-${i}-${j}`}
        rotation={[-Math.PI / 2, 0, 0]}
        position={new Vector3(mapSize / 2 - i * 10 - 5, 3, mapSize / 2 - j * 10 - 5)}
      >
        <boxGeometry args={[3, 3, 10]} />
        <meshStandardMaterial color="#f33" />
      </mesh>
    ))} */}
  </>
)

export default Ground
