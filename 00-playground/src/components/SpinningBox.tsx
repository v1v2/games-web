import { useRef, useState } from 'react'

import { Vector3, Color3 } from '@babylonjs/core'
import { useBeforeRender, useClick, useHover } from 'react-babylonjs'
import router from 'next/router'

const DefaultScale = new Vector3(1, 1, 1)
const BiggerScale = new Vector3(1.25, 1.25, 1.25)

type Props = {
  name: string
  position: Vector3
  color: Color3
  hoveredColor: Color3
  href?: string
}

const SpinningBox = ({ name, position, color, hoveredColor, href }: Props) => {
  const boxRef = useRef(null)

  const [clicked, setClicked] = useState(false)
  useClick(() => {
    if (href) {
      router.push(href)
    } else {
      setClicked(clicked => !clicked)
    }
  }, boxRef)

  const [hovered, setHovered] = useState(false)
  useHover(
    () => setHovered(true),
    () => setHovered(false),
    boxRef
  )

  const rpm = 5
  useBeforeRender(scene => {
    if (boxRef.current) {
      const deltaTimeInMillis = scene.getEngine().getDeltaTime()
      boxRef.current.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000)
    }
  })

  return (
    <box
      name={name}
      ref={boxRef}
      size={2}
      position={position}
      scaling={clicked ? BiggerScale : DefaultScale}
    >
      <standardMaterial
        name={`${name}-mat`}
        diffuseColor={hovered ? hoveredColor : color}
        specularColor={Color3.Black()}
      />
    </box>
  )
}

export default SpinningBox
