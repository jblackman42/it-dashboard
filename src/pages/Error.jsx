import React from 'react';
import { motion } from "framer-motion";

import background from '../assets/mountains-background.jpg';

function Error() {
  return (
    <main>
      <div className="fullscreen-background">
        <img src={background} alt="mountain scene" />
        <div className="gradient-overlay"></div>
      </div>
      {/* < Navbar /> */}
      <section className="content">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          className="content flex column center"
        >
          <h1 className='font-light text-shadow' style={{"textAlign": "center"}}>Error 404</h1>
          <p className='font-light' style={{"textAlign": "center"}}>Sorry, the page you're looking for doesn't exist.</p>
          <a href="/" className="clear-button font-light" style={{"margin": "1rem auto", "fontSize": "1.15rem"}}>Return Home</a>
        </motion.div>
      </section>
    </main>
    // <>
    //   <div className="fullscreen-background">
    //     <img src={background} alt="mountain scene" />
    //     <div className="gradient-overlay"></div>
    //   </div>
    //   <section className="content flex column center">
    //     <motion.div
    //       initial={{ y: 250, opacity: 0 }}
    //       animate={{ y: 0, opacity: 1 }}
    //       exit={{ y: -250, opacity: 0 }}
    //     >
    //       <h1 className='font-light text-shadow' style={{"text-align": "center"}}>Error 404</h1>
    //       <p className='font-light' style={{"text-align": "center"}}>Sorry, the page you're looking for doesn't exist.</p>
    //       <a href="/" className="clear-button font-light" style={{"margin": "1rem auto", "font-size": "1.15rem"}}>Return Home</a>
    //     </motion.div>
    //   </section>
    // </>
  )
}

export default Error