export default function HomeVideo() {
  return (
    <div className="video-container">
      {/* Preview Image */}
      <img 
        src="https://vz-58918a1e-773.b-cdn.net/09d398d0-0e08-4210-9cb4-94038f3dcdda/preview.webp?v=1769351307"
        alt="Sun-Fai Video Preview"
        className="absolute top-0 left-0 w-full h-full object-cover blur-sm scale-110 transform transition duration-700"
      />
      
      {/* Iframe */}
      <iframe
        src="https://iframe.mediadelivery.net/embed/585843/09d398d0-0e08-4210-9cb4-94038f3dcdda?autoplay=true&loop=true&muted=true&preload=true&responsive=true"
        className="video-iframe"
        loading="eager"
        frameBorder="0"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        title="Sun-Fai Background Video"
      ></iframe>
      
      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/30 z-[1]"></div>
    </div>
  );
}
