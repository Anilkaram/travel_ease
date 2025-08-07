import React, { useEffect, useState } from 'react';

const ImageDebugger = () => {
  const [imageTests, setImageTests] = useState([]);

  useEffect(() => {
    const imagePaths = [
      '/images/logo.png',
      '/images/paris.jpg',
      '/images/rome.jpg',
      '/images/bali.jpg',
      'images/logo.png',
      'images/paris.jpg',
      './images/logo.png'
    ];

    const testImages = imagePaths.map(path => {
      const img = new Image();
      return new Promise((resolve) => {
        img.onload = () => resolve({ path, status: 'success', width: img.width, height: img.height });
        img.onerror = () => resolve({ path, status: 'error' });
        img.src = path;
        
        // Timeout after 5 seconds
        setTimeout(() => resolve({ path, status: 'timeout' }), 5000);
      });
    });

    Promise.all(testImages).then(results => {
      setImageTests(results);
      console.log('Image test results:', results);
    });
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>Image Debug Info:</h4>
      {imageTests.map((test) => (
        <div key={test.path} style={{ marginBottom: '5px' }}>
          <strong>{test.path}</strong>: 
          <span style={{ color: test.status === 'success' ? 'lightgreen' : 'lightcoral' }}>
            {test.status}
          </span>
          {test.width && ` (${test.width}x${test.height})`}
        </div>
      ))}
    </div>
  );
};

export default ImageDebugger;
