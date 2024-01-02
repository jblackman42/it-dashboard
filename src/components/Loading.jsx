import React from 'react';

import background from '../assets/mountains-background.jpg';

const Loading = () => {

  return (
    <>
      <div className="fullscreen-background">
        <img src={background} alt="mountain scene" />
        <div className="gradient-overlay"></div>
      </div>
      <div className="loading-container">
        <div className="load-spinner-container slide-in">
          <div className="load-spinner"></div>
          <div className="load-spinner"></div>
          <div className="load-spinner"></div>
          <div className="load-spinner"></div>
          <div className="load-spinner"></div>
          <div className="load-spinner"></div>
          <div className="load-spinner"></div>
          <div className="load-spinner"></div>
          <div className="load-spinner"></div>
          <div className="load-spinner"></div>
        </div>
      </div>
    </>
  )
}

export default Loading;