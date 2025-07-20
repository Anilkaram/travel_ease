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
  const imgRef = useRef(null);

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
    ...style
  };

  if (hasError) {
    return (
      <div
        className={`${className} image-error`}
        style={placeholderStyle}
        ref={imgRef}
      >
        Failed to load image
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
          Loading...
        </div>
      )}
      {(isInView || loading === 'eager') && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
          style={{
            ...style,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            position: isLoaded ? 'static' : 'absolute',
            top: 0,
            left: 0
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
