import { Vector3, Color3 } from '@babylonjs/core'

import SpinningBox from 'components/SpinningBox'
import GameLayout from 'components/GameLayout'
import Ground from 'components/Ground'

const IndexPage = () => (
  <>
    <Ground />
  </>
)

IndexPage.wrappers = page => <GameLayout>{page}</GameLayout>

export default IndexPage
