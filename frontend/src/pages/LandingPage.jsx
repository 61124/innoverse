import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/LandingPage.css';

function LandingPage() {

  useEffect(() => {
    const canvas = document.getElementById('dotsCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let dots = [];
    const dotCount = 200;
    const mouse = {
      x: null,
      y: null
    };

    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    // Initialize Dots
    function createDots() {
      for (let i = 0; i < dotCount; i++) {
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: (Math.random() - 0.5) * 1.5
        });
      }
    }

    // Draw and Animate Dots
    function drawDots() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#c691e6';
      
      dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fill();
        
        dot.x += dot.speedX;
        dot.y += dot.speedY;
        
        // Reverse direction if the dot hits canvas boundaries
        if (dot.x < 0 || dot.x > canvas.width) dot.speedX *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.speedY *= -1;
      });

      drawLines();
      requestAnimationFrame(drawDots);
    }

    // Draw Lines Between Dots and Cursor
    function drawLines() {
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Draw lines between dots that are close to the mouse
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distanceToMouse < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(198, 145, 230, ${1 - distanceToMouse / 150})`;
          ctx.lineWidth = 1;
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        // Draw lines between nearby dots
        for (let j = i + 1; j < dots.length; j++) {
          const otherDot = dots[j];
          const dx = otherDot.x - dot.x;
          const dy = otherDot.y - dot.y;
          const distanceBetweenDots = Math.sqrt(dx * dx + dy * dy);

          if (distanceBetweenDots < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(200, 200, 200, ${1 - distanceBetweenDots / 100})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(otherDot.x, otherDot.y);
            ctx.stroke();
          }
        }
      }
    }

    createDots();
    drawDots();

    // Adjust Canvas on Resize
    const resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeHandler);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('mousemove', () => {});
    };
  }, []);

  return (
    <div className="landing-page">
      <Navbar />
      
      <header className="hero">
        <canvas id="dotsCanvas"></canvas>
        <div className="hero-content">
          <h1>Welcome to AutomateX</h1>
          <p>Follow along for exciting study planning and preparation</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-secondary">Sign In</Link>
          </div>
        </div>
      </header>

      <Footer />
    </div>
  );
}

export default LandingPage;
