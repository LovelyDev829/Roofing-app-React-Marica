import './App.scss';
import GridLines from "react-gridlines";
import { useState } from 'react';
const maxHeight = 20;
const maxWidth = 60;

function App() {
  const [height, setHeight] = useState(20)
  const [bottomWidth, setBottomWidth] = useState(60)
  const [topWidth, setTopWidth] = useState(36)
  return (
    <div className="App">
      <div className='header'></div>
      <div className='main'>
        <div className='left'>
          <div className='input-item'>
            <p>HELGHT</p>
            <input type="text" onChange={(e)=>{setHeight(e.target.value)}} value={height}/>
          </div>
          <div className='input-item'>
            <p>TOP-WIDTH</p>
            <input type="text" onChange={(e)=>{setTopWidth(e.target.value)}} value={topWidth}/>
          </div>
          <div className='input-item'>
            <p>BOTTOM-WIDTH</p>
            <input type="text" onChange={(e)=>{setBottomWidth(e.target.value)}} value={bottomWidth}/>
          </div>
          <div className='button'>Roof</div>
        </div>
        <div className='right'>
          <div className='draw-area'>
            <GridLines
              className="grid-background"
              cellHeight={20}
              cellWidth={80}
              strokeWidth={1}
            ></GridLines>
            <div className='polygon' style={{
              clipPath: `polygon(
            ${50 - topWidth / maxWidth * 50}% ${50 - height / maxHeight * 50}%,
            ${50 + topWidth / maxWidth * 50}% ${50 - height / maxHeight * 50}%,
            ${50 + bottomWidth / maxWidth * 50}% ${50 + height / maxHeight * 50}%,
            ${50 - bottomWidth / maxWidth * 50}% ${50 + height / maxHeight * 50}%
          )`}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
