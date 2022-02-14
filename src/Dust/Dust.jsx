import Particles from "react-tsparticles";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import particlesJson from './particles.json';


const DustWrapper = styled.div`
  position: absolute;
  top: 2vh;
  right: 30px;
  z-index: 5;
`;

function Dust(props) {
  const [particleColors, setParticleColors] = useState(null);

  useEffect(() => {
    setParticleColors(props.colors.slice(2));

  }, [props.colors])
  
  
  return (
    <DustWrapper >
      <Particles
        id="albumParticles"
        options={{
          "particles": {
            "number": {
              "value": 150,
              "density": {
                "enable": false,
                "value_area": 1000
              }
            },
            "color": {
              "value": particleColors
            },
            "shape": {
              "type": "circle",
              "stroke": {
                "width": 0,
                "color": "#000"
              }
            },
            "opacity": {
              "value": 0.75,
              "random": true,
              "anim": {
                "enable": true,
                "speed": 0.1,
                "opacity_min": 0.5,
                "sync": false
              }
            },
            "size": {
              "value": 8,
              "random": true,
              "anim": {
                "enable": true,
                "speed": 1,
                "size_min": 2,
                "sync": false
              }
            },
            "move": {
              "enable": true,
              "speed": .1,
              "direction": "none",
              "random": true,
              "straight": false,
              "out_mode": "bounce",
              "bounce": true,
              "attract": {
                "enable": false,
                "rotateX": 6000,
                "rotateY": 12000
              }
            }
          },
          "retina_detect": true
        }}
        style={{filter:"blur(5px)"}}
      />
    </DustWrapper>
  );
}

export default Dust;

