import React from 'react';
import { images } from '../utils/images';

const SmartImage = ({ 
  imageKey, 
  alt, 
  className = '', 
  style = {}, 
  width, 
  height,
  loading = 'lazy'
}) => {
  const src = images[imageKey];

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
      loading={loading}
      onError={(e) => {
        console.warn(`Failed to load image: ${src}`);
        // Simple fallback - just hide the broken image
        e.target.style.display = 'none';
      }}
    />
  );
};

export default SmartImage;
