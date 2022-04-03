import { useRef } from 'react'

import { useController, useXR } from '@react-three/xr'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector2, Vector3 } from 'three'

// https://codesandbox.io/s/6kfsx

const SnapRotation = ({ increment = Math.PI / 6, threshold = 0.6 }) => {
  const controller = useController('right')
  const { player } = useXR()
  const snapping = useRef(false)

  useFrame(() => {
    if (controller?.inputSource?.gamepad) {
      // @ts-ignore
      const [, , ax] = controller.inputSource.gamepad.axes
      if (Math.abs(ax) > threshold) {
        !snapping.current && player.rotateY(-increment * Math.sign(ax))
        snapping.current = true
      } else {
        snapping.current = false
      }
    }
  })

  return null
}

const joystickDir = new Vector2()
const cameraDir3 = new Vector3()
const cameraDir = new Vector2()
const playerDir3 = new Vector3()

const speed = 2

const SmoothLocomotion = () => {
  const camera = useThree(s => s.camera)
  const { player } = useXR()
  const controller = useController('left')

  useFrame((_, delta) => {
    if (controller?.inputSource?.gamepad) {
      // @ts-ignore
      const [, , ax, ay] = controller.inputSource.gamepad.axes
      joystickDir.set(-ax, ay)

      camera.getWorldDirection(cameraDir3)
      cameraDir.set(cameraDir3.x, cameraDir3.z).normalize()

      // I think the problem is this, it needs to take the player's rotation into account
      player.position.x -= cameraDir.cross(joystickDir) * delta * speed
      player.position.z -= cameraDir.dot(joystickDir) * delta * speed
    }
  })

  return null
}

const Jump = ({ jump }) => {
  const controller = useController('right')

  useFrame(() => {
    if (controller?.inputSource?.gamepad) {
      // trigger, grip, ?, thumbstick, a, b
      const [trigger, , , , a] = controller.inputSource.gamepad.buttons
      if (a.pressed || trigger.pressed) {
        jump()
        // console.log(bodyApi)
        // bodyApi.applyImpulse(new Vector3(0, 10, 0), new Vector3(0, 10, 0))
        // bodyApi.applyForce(new Vector3(0, 10, 0), new Vector3(0, 10, 0))
        // bodyApi.applyLocalImpulse(new Vector3(0, 10, 0), new Vector3(0, 10, 0))
        // bodyApi.applyLocalForce(new Vector3(0, 10, 0), new Vector3(0, 10, 0))
        // if (bodyApi) {
        //   bodyApi.velocity.set(new Vector3(0, 10, 0))
        //   bodyApi.position.set(new Vector3(0, 10, 0))
        // }
        // bodyApi.applyCentralImpulse(new Vector3(0, 10, 0))
        // bodyApi.velocity.set(0, 10, 0)
        // bodyApi.position.set(0, 10, 0)
        // bodyApi.applyForce(
        // player.parent.position.y += 0.5
      }
    }
  })
  return null
}

const VRControls = ({ jump }) => (
  <>
    <SmoothLocomotion />
    <SnapRotation />
    <Jump jump={jump} />
  </>
)

export default VRControls

// const controllerDir = new Vector2()
// const controllerDir3 = new Vector3()
// const joystickDir = new Vector2()

// export default function SmoothLocomotion({ hand = 'left' }) {
//   const { player } = useXR()
//   const controller = useController(hand)
//   useFrame((_, delta) => {
//     if (controller?.inputSource?.gamepad) {
//       const [, , ax, ay] = controller.inputSource.gamepad.axes
//       joystickDir.set(ax, ay)
//       controller.controller.getWorldDirection(controllerDir3)
//       controllerDir.set(controllerDir3.x, -controllerDir3.z).normalize()

//       player.position.x += controllerDir.cross(joystickDir) * delta
//       player.position.z -= controllerDir.dot(joystickDir) * delta
//     }
//   })
//   return null
// }

// export default function SnapRotation({ hand = 'right', increment = Math.PI / 4, threshold = 0.6 }) {
//   const controller = useController(hand)
//   const { player } = useXR()
//   const snapping = useRef(false)
//   useFrame(() => {
//     if (controller?.inputSource?.gamepad) {
//       const [, , ax] = controller.inputSource.gamepad.axes
//       if (Math.abs(ax) > threshold) {
//         !snapping.current && player.rotateY(-increment * Math.sign(ax))
//         snapping.current = true
//       } else {
//         snapping.current = false
//       }
//     }
//   })
//   return null
// }
