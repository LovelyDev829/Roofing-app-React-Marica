import './App.scss';
import GridLines from "react-gridlines";
import { useState } from 'react';
const cellWidth = 44, cellHeight = 14;
const maxHeightNum = 30;
const maxWidthNum = 20;
// var fieldFlag = []

function App() {

  const [height, setHeight] = useState(25)
  const [bottomWidth, setBottomWidth] = useState(16)
  const [topWidth, setTopWidth] = useState(10)

  return (
    <div className="App">
      <div className='header'></div>
      <div className='main' id='number'>
        <div className='left'>
          <div className='input-item'>
            <p>HELGHT</p>
            <div className='flex'>
              <input type="text" onChange={(e) => { setHeight(e.target.value) }} value={height} />
              <p>X   35 =</p>
              <input type="text" onChange={(e) => { setHeight(e.target.value/35) }} value={height*35} />
              <p>(M)</p>
            </div>
          </div>
          <div className='input-item'>
            <p>TOP-WIDTH</p>
            <div className='flex'>
              <input type="text" onChange={(e) => { setTopWidth(e.target.value) }} value={topWidth} />
              <p>X 110 =</p>
              <input type="text" onChange={(e) => { setTopWidth(e.target.value/110) }} value={topWidth*110} />
              <p>(M)</p>
            </div>
          </div>
          <div className='input-item'>
            <p>BOTTOM-WIDTH</p>
            <div className='flex'>
              <input type="text" onChange={(e) => { setBottomWidth(e.target.value) }} value={bottomWidth} />
              <p>X 110 =</p>
              <input type="text" onChange={(e) => { setBottomWidth(e.target.value/110) }} value={bottomWidth*110} />
              <p>(M)</p>
            </div>
          </div>
          <div className='button'>Roof</div>
        </div>
        <div className='right'>
          <div className='draw-area' style={{
            width: `${cellWidth * maxWidthNum + 1}px`, height: `${cellHeight * maxHeightNum}px`,
            padding: `${cellHeight}px ${cellWidth}px ${cellHeight}px ${cellWidth}px`
          }}>
            <GridLines
              className="grid-background"
              cellHeight={cellHeight}
              cellWidth={cellWidth}
              strokeWidth={1}
            ></GridLines>
            <div className='polygon' style={{ clipPath: `polygon(
              ${50-topWidth/maxWidthNum*50    - Math.min(50-topWidth/maxWidthNum*50, 50-bottomWidth/maxWidthNum*50)}% ${100-height/maxHeightNum*100}%,
              ${50+topWidth/maxWidthNum*50    - Math.min(50-topWidth/maxWidthNum*50, 50-bottomWidth/maxWidthNum*50)}% ${100-height/maxHeightNum*100}%,
              ${50+bottomWidth/maxWidthNum*50 - Math.min(50-topWidth/maxWidthNum*50, 50-bottomWidth/maxWidthNum*50)}% 100%,
              ${50-bottomWidth/maxWidthNum*50 - Math.min(50-topWidth/maxWidthNum*50, 50-bottomWidth/maxWidthNum*50)}% 100%
            )`}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
