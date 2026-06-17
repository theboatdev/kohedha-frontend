import Head from 'next/head'

interface PerformanceOptimizerProps {
  preloadImages?: string[]
  preloadFonts?: string[]
  preconnectDomains?: string[]
  dnsPrefetchDomains?: string[]
}

export default function PerformanceOptimizer({
  preloadImages = [],
  preloadFonts = [],
  preconnectDomains = [],
  dnsPrefetchDomains = []
}: PerformanceOptimizerProps) {
  return (
    <Head>
      {/* Resource Hints for Performance */}
      
      {/* Preconnect to external domains */}
      {preconnectDomains.map((domain, index) => (
        <link key={`preconnect-${index}`} rel="preconnect" href={domain} crossOrigin="anonymous" />
      ))}
      
      {/* DNS Prefetch for performance */}
      {dnsPrefetchDomains.map((domain, index) => (
        <link key={`dns-prefetch-${index}`} rel="dns-prefetch" href={domain} />
      ))}
      
      {/* Preload critical images */}
      {preloadImages.map((image, index) => (
        <link key={`preload-image-${index}`} rel="preload" as="image" href={image} />
      ))}
      
      {/* Preload critical fonts */}
      {preloadFonts.map((font, index) => (
        <link key={`preload-font-${index}`} rel="preload" as="font" href={font} crossOrigin="anonymous" />
      ))}
      
      {/* Performance optimizations */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* HTTP/2 Server Push hints */}
      <link rel="preload" href="/fonts/league-spartan.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      
      {/* Critical CSS preload */}
      <link rel="preload" href="/globals.css" as="style" />
      
      {/* Service Worker registration */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `
        }}
      />
    </Head>
  )
}
