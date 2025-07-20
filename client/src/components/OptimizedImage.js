import React, { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  style = {}, 
  width, 
  height,
  loading = 'lazy',
  placeholder = 'blur'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef(null);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    console.warn(`Failed to load image: ${currentSrc}`);
    
    // If it's a placeholder.co URL that failed, use Unsplash fallback
    if (currentSrc.includes('placehold.co') || currentSrc.includes('placeholder.com')) {
      const fallbackSrc = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=80';
      console.log(`Trying fallback for placeholder: ${fallbackSrc}`);
      setCurrentSrc(fallbackSrc);
      return;
    }
    
    // Try fallback strategies for local images
    if (currentSrc.startsWith('/images/')) {
      // Try without leading slash
      const fallbackSrc = currentSrc.substring(1);
      console.log(`Trying fallback: ${fallbackSrc}`);
      setCurrentSrc(fallbackSrc);
      return;
    }
    
    if (currentSrc.startsWith('images/')) {
      // Try with leading slash
      const fallbackSrc = '/' + currentSrc;
      console.log(`Trying fallback: ${fallbackSrc}`);
      setCurrentSrc(fallbackSrc);
      return;
    }
    
    // Final fallback to placeholder
    setHasError(true);
    setIsLoaded(true);
  };

  const placeholderStyle = {
    backgroundColor: '#f0f0f0',
    backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
    fontSize: '14px',
    minHeight: height || '200px',
    ...style
  };

  if (hasError) {
    return (
      <div
        className={`${className} image-error`}
        style={placeholderStyle}
        ref={imgRef}
        title={`Failed to load: ${alt}`}
      >
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-image" style={{ fontSize: '2em', marginBottom: '8px', display: 'block' }}></i>
          Image not available
        </div>
      </div>
    );
  }

  return (
    <div ref={imgRef} style={{ position: 'relative', ...style }}>
      {!isLoaded && (
        <div
          className={`${className} image-placeholder`}
          style={placeholderStyle}
        >
          <div style={{ textAlign: 'center' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '1.5em', marginBottom: '8px', display: 'block' }}></i>
            Loading...
          </div>
        </div>
      )}
      {(isInView || loading === 'eager') && (
        <img
          src={currentSrc}
          alt={alt}
          className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
          style={{
            ...style,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            position: isLoaded ? 'static' : 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          width={width}
          height={height}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
