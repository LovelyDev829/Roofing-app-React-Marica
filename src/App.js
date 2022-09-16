import './App.scss';
import GridLines from "react-gridlines";
import { useEffect, useState } from 'react';

const cellWidth = 44, cellHeight = 14;
const maxHeightNum = 30;
const maxWidthNum = 20;
var fieldFlag = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]
]
const INF = 10000;

function onSegment(p, q, r) {
  // console.log("onSegment")
  if (q.x <= Math.max(p.x, r.x) &&
    q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) &&
    q.y >= Math.min(p.y, r.y)) {
    return true;
  }
  return false;
}
function orientation(p, q, r) {
  // console.log("orientation", p , q, r)
  let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (val === 0) {
    return 0; // collinear
  }
  return (val > 0) ? 1 : 2; // clock or counterclock wise
}
function doIntersect(p1, q1, p2, q2) {
  // console.log("doIntersect")
  let o1 = orientation(p1, q1, p2);
  let o2 = orientation(p1, q1, q2);
  let o3 = orientation(p2, q2, p1);
  let o4 = orientation(p2, q2, q1);

  // General case
  if (o1 !== o2 && o3 !== o4) {
    return true;
  }
  if (o1 === 0 && onSegment(p1, p2, q1)) {
    return true;
  }
  if (o2 === 0 && onSegment(p1, q2, q1)) {
    return true;
  }
  if (o3 === 0 && onSegment(p2, p1, q2)) {
    return true;
  }
  if (o4 === 0 && onSegment(p2, q1, q2)) {
    return true;
  }
  return false;
}
function isInside(polygonTemp, n, p) {
  // console.log("isInside")
  if (n < 3) {
    return false;
  }
  // let extreme = new Point(INF, p.y);
  let count = 0, i = 0;
  do {
    let next = (i + 1) % n;
    if (doIntersect(polygonTemp[i], polygonTemp[next], p, { x: INF, y: p.y })) {
      if (orientation(polygonTemp[i], p, polygonTemp[next]) === 0) {
        return onSegment(polygonTemp[i], p, polygonTemp[next]);
      }

      count++;
    }
    i = next;
  } while (i !== 0);
  return (count % 2 === 1);
}

function App() {

  const [height, setHeight] = useState(25)
  const [bottomWidth, setBottomWidth] = useState(16)
  const [topWidth, setTopWidth] = useState(10)
  const [polygon, setPolygon] = useState([])
  const [displayFlag, setDisplayFlag] = useState(false)

  useEffect(() => {
    setPolygon([
      {
        x: 50 - topWidth / maxWidthNum * 50 - Math.min(50 - topWidth / maxWidthNum * 50, 50 - bottomWidth / maxWidthNum * 50),
        y: 100 - height / maxHeightNum * 100
      },
      {
        x: 50 + topWidth / maxWidthNum * 50 - Math.min(50 - topWidth / maxWidthNum * 50, 50 - bottomWidth / maxWidthNum * 50),
        y: 100 - height / maxHeightNum * 100
      },
      {
        x: 50 + bottomWidth / maxWidthNum * 50 - Math.min(50 - topWidth / maxWidthNum * 50, 50 - bottomWidth / maxWidthNum * 50),
        y: 100
      },
      {
        x: 50 - bottomWidth / maxWidthNum * 50 - Math.min(50 - topWidth / maxWidthNum * 50, 50 - bottomWidth / maxWidthNum * 50),
        y: 100
      }
    ])
  }, [height, bottomWidth, topWidth])
  function displayCalc(){
    for (let i = 0; i < maxWidthNum; i++) {
      for (let j = 0; j < maxHeightNum; j++) {
        if (polygon.length === 0) break;

        let flag1 = isInside(polygon, 4, { x: (i + 0) * 5 + 0.001, y: (j + 0) * 10 / 3 + 0.001})
        let flag2 = isInside(polygon, 4, { x: (i + 1) * 5 - 0.001, y: (j + 0) * 10 / 3 + 0.001})
        let flag3 = isInside(polygon, 4, { x: (i + 0) * 5 + 0.001, y: (j + 1) * 10 / 3 - 0.001})
        let flag4 = isInside(polygon, 4, { x: (i + 1) * 5 - 0.001, y: (j + 1) * 10 / 3 - 0.001})

        if (flag1 || flag2 || flag3 || flag4) fieldFlag[i][j] = 1
        else fieldFlag[i][j] = 0
      }
    }
  }
  return (
    <div className="App">
      <div className='header'></div>
      <div className='main' id='number'>
        <div className='left'>
          <div className='input-item'>
            <p>HELGHT</p>
            <div className='flex'>
              <input type="text" onChange={(e) => { setDisplayFlag(false); setHeight(e.target.value) }} value={height} />
              <p>X   35 =</p>
              <input type="text" onChange={(e) => { setDisplayFlag(false); setHeight(e.target.value / 35) }} value={height * 35} />
              <p>(M)</p>
            </div>
          </div>
          <div className='input-item'>
            <p>TOP-WIDTH</p>
            <div className='flex'>
              <input type="text" onChange={(e) => { setDisplayFlag(false); setTopWidth(e.target.value) }} value={topWidth} />
              <p>X 110 =</p>
              <input type="text" onChange={(e) => { setDisplayFlag(false); setTopWidth(e.target.value / 110) }} value={topWidth * 110} />
              <p>(M)</p>
            </div>
          </div>
          <div className='input-item'>
            <p>BOTTOM-WIDTH</p>
            <div className='flex'>
              <input type="text" onChange={(e) => { setDisplayFlag(false); setBottomWidth(e.target.value) }} value={bottomWidth} />
              <p>X 110 =</p>
              <input type="text" onChange={(e) => { setDisplayFlag(false); setBottomWidth(e.target.value / 110) }} value={bottomWidth * 110} />
              <p>(M)</p>
            </div>
          </div>
          <div className='button' onClick={()=>{displayCalc(); setDisplayFlag(true)}}>Roof</div>
        </div>
        <div className='right'>
          <div className='draw-area' style={{
            width: `${cellWidth * maxWidthNum}px`, height: `${cellHeight * maxHeightNum}px`,
            // padding: `${cellHeight}px ${cellWidth}px ${cellHeight}px ${cellWidth}px`
          }}>
            <GridLines
              className="grid-background"
              cellHeight={cellHeight}
              cellWidth={cellWidth}
              strokeWidth={1}
            ></GridLines>
            <div className='polygon' style={{
              clipPath: `polygon(
              ${polygon[0]?.x}% ${polygon[0]?.y}%,
              ${polygon[1]?.x}% ${polygon[1]?.y}%,
              ${polygon[2]?.x}% ${polygon[2]?.y}%,
              ${polygon[3]?.x}% ${polygon[3]?.y}%
            )`}}></div>
            <div className='polygon-flag-field'>
              {
                fieldFlag.map((iItem, iIndex) => {
                  return iItem.map((jItem, jIndex) => {
                    return (
                      <div className={(jItem === 1 && displayFlag) ? 'polygon-flag-item' : 'hidden'} style={{
                        clipPath: `polygon(
                          ${(iIndex + 0) * 5}% ${(jIndex + 0) * 10 / 3}% ,
                          ${(iIndex + 1) * 5}% ${(jIndex + 0) * 10 / 3}% ,
                          ${(iIndex + 1) * 5}% ${(jIndex + 1) * 10 / 3}% ,
                          ${(iIndex + 0) * 5}% ${(jIndex + 1) * 10 / 3}% 
                      )`}} key={"field-item" + iIndex + "-" + jIndex} ></div>
                    )
                  })
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
