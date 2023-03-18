import Head from 'next/head'

export default function TailwindCSS() {
  return (
    <div style={{ padding: 32 }}>
      <Head>
        <title>Tailwind CSS Example</title>
      </Head>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Click me!
      </button>
    </div>
  )
}
