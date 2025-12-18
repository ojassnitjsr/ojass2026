import React, { useRef, useEffect } from 'react'

export default function Loader() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 2;
    }
  }, []);

  return (
    <div className='fixed inset-0 w-full h-screen flex items-center justify-center bg-black z-10010'>
        <video
          ref={videoRef}
          src='/ojass_loader.mkv'
          autoPlay
          loop
          muted
          style={{ width: '400px', height: '400px', objectFit: 'contain' }}
        />
    </div>
  )
}