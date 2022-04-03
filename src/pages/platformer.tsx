import Head from 'next/head'

import UnityFullCanvas from 'components/UnityFullCanvas'

const Page = () => (
  <>
    <Head>
      <title>01-platformer</title>
    </Head>
    <UnityFullCanvas path="01-platformer" name="platformer" />
  </>
)

export default Page
