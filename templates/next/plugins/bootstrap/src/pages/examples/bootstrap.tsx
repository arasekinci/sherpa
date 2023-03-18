import Head from 'next/head'
import { Button } from 'react-bootstrap'

export default function ReactBootstrap() {
  return (
    <div style={{ padding: 32 }}>
      <Head>
        <title>React Bootstrap</title>
      </Head>
      <Button variant="primary">Button</Button>
    </div>
  )
}
