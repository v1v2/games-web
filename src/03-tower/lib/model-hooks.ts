import { useGLTF } from '@react-three/drei'
import { Mesh, MeshStandardMaterial } from 'three'
import { GLTF } from 'three-stdlib'

const SIMPLE_TOWER_PATH = '/03-tower/models/emp-tower/emp-tower.glb'
const SPLASH_TOWER_PATH = '/03-tower/models/energy-pilon/energy-pilon.glb'
const STRONG_TOWER_PATH = '/03-tower/models/big-emp-tower/big-emp-tower.glb'

const modelConfigs = {
  simple: {
    path: SIMPLE_TOWER_PATH,
    nodes: 'EMP_Tower_level_1',
    material: 'EnergyPylon_V006:l0001',
  },
  splash: { path: SPLASH_TOWER_PATH, nodes: 'pylon_level_1', material: 'pylon_01' },
  strong: { path: STRONG_TOWER_PATH, nodes: 'EMP_Tower_level_3', material: 'EnergyPylon_V006:l03' },
}

const useModel = ({ path, nodes, material }: { path: string; nodes: string; material: string }) => {
  // @ts-ignore
  const gltf = useGLTF(path) as GLTF & {
    nodes: { string: Mesh }
    materials: { string: MeshStandardMaterial }
  }

  return {
    geometry: (gltf.nodes[nodes] as Mesh).geometry,
    material: gltf.materials[material] as MeshStandardMaterial,
  }
}

export const useSimpleTowerModel = () => useModel(modelConfigs.simple)
export const useSplashTowerModel = () => useModel(modelConfigs.splash)
export const useStrongTowerModel = () => useModel(modelConfigs.strong)

useGLTF.preload(SIMPLE_TOWER_PATH)
useGLTF.preload(SPLASH_TOWER_PATH)
useGLTF.preload(STRONG_TOWER_PATH)
