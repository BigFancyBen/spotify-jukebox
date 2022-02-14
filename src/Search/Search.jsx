import React, { useState, useEffect } from 'react';
import styled from 'styled-components';



const SearchWrapper = styled.div`
  position: absolute;
  top: 2vh;
  right: 30px;
  z-index: 999999999999999999999999999999;
`;

function Search(props) {
  const [query, setQuery] = useState("");

  async function handleSearch(){
    if(query===""){return;}
    const songs = await props.searchSong(query);
    
  }
  
  return (
    <SearchWrapper >
      <input type="text" value={query} onChange={e => setQuery(e.target.value)} onBlur={handleSearch} />
    </SearchWrapper>
  );
}

export default Search;

