import { useTexture } from '@react-three/drei'

const BUGGY_RED_PATH = '/03-tower/models/buggy/buggy-red.jpg'
const BUGGY_ORANGE_PATH = '/03-tower/models/buggy/buggy-orange.jpg'
const BUGGY_GREEN_PATH = '/03-tower/models/buggy/buggy-green.jpg'
const BUGGY_PURPLE_PATH = '/03-tower/models/buggy/buggy-purple.jpg'

const useFlippedTexture = (path: string) => {
  const texture = useTexture(path)
  texture.flipY = false
  return texture
}

export const useBuggyRedTexture = () => useFlippedTexture(BUGGY_RED_PATH)
export const useBuggyOrangeTexture = () => useFlippedTexture(BUGGY_ORANGE_PATH)
export const useBuggyGreenTexture = () => useFlippedTexture(BUGGY_GREEN_PATH)
export const useBuggyPurpleTexture = () => useFlippedTexture(BUGGY_PURPLE_PATH)

useTexture.preload(BUGGY_RED_PATH)
useTexture.preload(BUGGY_ORANGE_PATH)
useTexture.preload(BUGGY_GREEN_PATH)
useTexture.preload(BUGGY_PURPLE_PATH)
