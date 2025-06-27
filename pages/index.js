
import FenceVisualizer from '../components/FenceVisualizer'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Top Rail Fence - Fence Visualizer</h1>
      <p className="mb-4 text-center max-w-xl">Upload a photo of your yard, place fence styles visually, and request a quote directly from your design.</p>
      <FenceVisualizer />
    </main>
  )
}
