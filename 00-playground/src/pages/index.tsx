import { Vector3, Color3 } from '@babylonjs/core'

import SpinningBox from 'components/SpinningBox'
import GameLayout from 'components/GameLayout'

const IndexPage = () => (
  <>
    <SpinningBox
      name="left"
      position={new Vector3(-2, 0, 0)}
      color={Color3.FromHexString('#EEB5EB')}
      hoveredColor={Color3.FromHexString('#C26DBC')}
      href="/left"
    />
    <SpinningBox
      name="right"
      position={new Vector3(2, 0, 0)}
      color={Color3.FromHexString('#C8F4F9')}
      hoveredColor={Color3.FromHexString('#3CACAE')}
      href="right"
    />
  </>
)

IndexPage.wrappers = page => <GameLayout>{page}</GameLayout>

export default IndexPage
