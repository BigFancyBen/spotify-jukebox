import React, { useState, useEffect } from 'react';
import styled, {keyframes} from 'styled-components';

const gradient = keyframes`
	0% {
		background-position: 50% 30%;
	}
	50% {
		background-position: 50% 70%;
	}
	100% {
		background-position: 50% 30%;
	}
`;

const Outer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 2;
  animation: ${gradient} 15s ease-in-out infinite;
`;

const AlbumWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 10;
  position: relative;
`;

const SongName = styled.div`
  text-align: left;
  font-size: 5vh;
  font-weight: 600;
  border-radius: 10px;
  position: absolute;
  left: 30px;
  bottom: 2vh;
  text-shadow: 2px 2px 2px rgba(0,0,0,0.2);
  z-index: 10;
  width: calc(100vw - 60px);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;


const AlbumArt = styled.img`
  height: 75vh;
  width: 75vh;
  border-radius: 5px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
`;

const Texture = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 3;
  mix-blend-mode: overlay;
`;

const PalletteWrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
`;

const PalletteItem = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 5px;
  margin: 10px;
  border: 1px solid black;
`;

function RecordPlayer(props) {
  console.log(props.track)

  //props.track.name
  //props.album
  return (
    <Outer style={{backgroundImage:`linear-gradient( ${props.colors[1]}, ${props.colors[0]})`, backgroundSize:"200% 200%"}}>
      <Texture src="paper.jpg" />
      <AlbumWrapper>
        <AlbumArt src={props.album} style={{boxShadow:`0 10px 30px ${props.colors[1]}`}}/>
      </AlbumWrapper>
      <SongName style={{color:props.colors[1]}}>{props.track.name} - {props.track.artists[0].name}</SongName>
      <PalletteWrapper>
        {props.colors.map((color) =>
          <PalletteItem style={{backgroundColor:`${color}`}}/>
        )}
      </PalletteWrapper>
    </Outer>
  );
}

export default RecordPlayer;

