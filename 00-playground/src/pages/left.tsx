import { Vector3, Color3 } from '@babylonjs/core'

import SpinningBox from 'components/SpinningBox'
import GameLayout from 'components/GameLayout'

const LeftPage = () => (
  <SpinningBox
    name="left"
    position={new Vector3(-2, 0, 0)}
    color={Color3.FromHexString('#EEB5EB')}
    hoveredColor={Color3.FromHexString('#C26DBC')}
  />
)

LeftPage.wrappers = page => <GameLayout>{page}</GameLayout>

export default LeftPage
