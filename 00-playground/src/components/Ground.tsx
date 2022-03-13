import { useState, useRef } from 'react'

import { Vector3, Color3 } from '@babylonjs/core'
import { useHover } from 'react-babylonjs'

import { useMemoryStore } from 'lib/store'

const cells = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 2],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

const mapSize = 120

const Cell = ({ i, j }) => {
  const [hovered, setHovered] = useState(false)
  const currentConstruction = useMemoryStore(s => s.currentConstruction)
  const ref = useRef(null)

  useHover(
    () => setHovered(true),
    () => setHovered(false),
    ref
  )

  return (
    <plane
      ref={ref}
      name={`${i}-${j}`}
      size={9}
      position={new Vector3(mapSize / 2 - i * 10 - 5, 0.1, mapSize / 2 - j * 10 - 5)}
      rotation={new Vector3(Math.PI / 2, 0, 0)}
    >
      <standardMaterial
        name="cell"
        diffuseColor={Color3.FromHexString(hovered && currentConstruction ? '#55ff55' : '#aaaaaa')}
        specularColor={Color3.Black()}
      />
    </plane>
  )
}

const Ground = () => (
  <>
    <plane
      name="ground"
      size={mapSize + 1}
      position={new Vector3(0, 0, 0)}
      rotation={new Vector3(Math.PI / 2, 0, 0)}
    >
      <standardMaterial
        name={`${name}-mat`}
        diffuseColor={Color3.FromHexString('#333333')}
        specularColor={Color3.Black()}
      />
    </plane>
    {cells.map((row, i) =>
      row.map((c, j) =>
        c === 1 ? (
          <Cell i={i} j={j} />
        ) : c === 2 ? (
          <box
            name="start"
            size={9}
            position={
              new Vector3(mapSize / 2 - i * 10 - 5, (0.7 / 2) * 9 + 0.1, mapSize / 2 - j * 10 - 5)
            }
            scaling={new Vector3(1, 0.7, 1)}
          >
            <standardMaterial
              name="cell"
              diffuseColor={Color3.FromHexString('#66ff66')}
              specularColor={Color3.Black()}
            />
          </box>
        ) : c === 3 ? (
          <box
            name="end"
            size={9}
            position={
              new Vector3(mapSize / 2 - i * 10 - 5, (0.7 / 2) * 9 + 0.1, mapSize / 2 - j * 10 - 5)
            }
            scaling={new Vector3(1, 0.7, 1)}
          >
            <standardMaterial
              name="cell"
              diffuseColor={Color3.FromHexString('#ff6666')}
              specularColor={Color3.Black()}
            />
          </box>
        ) : null
      )
    )}
  </>
)

export default Ground
