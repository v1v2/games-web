import { MeshBasicMaterial, MeshStandardMaterial } from 'three'

export const undergroundMaterial = new MeshStandardMaterial({ color: '#161616' })
export const grayMaterial = new MeshStandardMaterial({ color: '#555' })
export const purpleMaterial = new MeshStandardMaterial({ color: '#f0f' })
export const greenMaterial = new MeshStandardMaterial({ color: '#0f0' })
export const blackMaterial = new MeshStandardMaterial({ color: '#000' })
export const redMaterial = new MeshStandardMaterial({ color: '#f00' })
export const blueMaterial = new MeshStandardMaterial({ color: '#00f' })
export const wireFrameMaterial = new MeshStandardMaterial({ color: '#fff', wireframe: true })

export const basicGreenMaterial = new MeshBasicMaterial({ color: '#0f0' })
export const basicOrangeMaterial = new MeshBasicMaterial({ color: '#f60' })
