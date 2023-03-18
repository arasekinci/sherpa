import Head from 'next/head'
import { Button } from 'antd'

export default function AntDesign() {
  return (
    <div style={{ padding: 32 }}>
      <Head>
        <title>Ant Design</title>
      </Head>
      <Button type="primary">Button</Button>
    </div>
  )
}
