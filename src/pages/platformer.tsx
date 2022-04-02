import Head from 'next/head'

import UnityFullCanvas from 'components/UnityFullCanvas'

const PlatformerPage = () => (
  <>
    <Head>
      <title>01-platformer</title>
    </Head>
    <UnityFullCanvas path="01-platformer" name="platformer" />
  </>
)

export default PlatformerPage
