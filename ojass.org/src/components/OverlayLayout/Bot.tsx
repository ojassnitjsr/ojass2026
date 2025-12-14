import Spline from '@splinetool/react-spline/next';

export default function Bot() {
    return (
        <main className='fixed inset-0 w-full h-screen z-0 pointer-events-none'>
            <Spline
                scene="https://prod.spline.design/dVC7qdACxFHcUmCV/scene.splinecode"
            />
        </main>
    );
}
