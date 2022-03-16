import { BoxGeometry, PlaneGeometry, SphereGeometry } from 'three'

export const squareGeometry = new PlaneGeometry(1, 1)
export const hpBarGeometry = new PlaneGeometry(10, 1)

export const cubeGeometry = new BoxGeometry(1, 1, 1)
export const baseGeometry = new BoxGeometry(9, 9, 5)

export const sphereGeometry = new SphereGeometry(3, 10)
