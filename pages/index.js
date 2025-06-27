
import dynamic from 'next/dynamic';
const FenceVisualizerPro = dynamic(() => import('../components/FenceVisualizerPro'), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-neutral">
      <h1 className="text-3xl font-bold mb-2 text-center text-primary">Top Rail Fence - Pro Fence Visualizer</h1>
      <p className="text-center mb-4 max-w-xl text-dark">Upload your yard photo, add realistic fence panels, adjust, preview, save, and request a quote instantly.</p>
      <FenceVisualizerPro />
    </main>
  );
}
