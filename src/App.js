import './App.scss';
import GridLines from "react-gridlines";
import { useEffect, useState } from 'react';
import { ReactComponent as RightWard } from "./assets/rightward.svg";

const cellWidth = 44, cellHeight = 14;
const unitWidth = 1.1, unitHeight = 0.35;
const maxHeightNum = 30;
const maxWidthNum = 20;
var columnTopPoint = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var columnBottomPoint = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var columnHeight = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
var color = [
  'rgb(103, 10, 89)',
  'rgb(103, 10, 10)',
  'rgb(53, 50, 53)',
  'rgb(100, 103, 10)',
  'rgb(47, 103, 10)',
  'rgb(10, 103, 63)',
  'rgb(10, 83, 103)',
  'rgb(10, 47, 103)',
  'rgb(12, 10, 103)',
  'rgb(53, 10, 103)',
  'rgb(93, 56, 135)',
  'rgb(56, 135, 60)',
  'rgb(135, 128, 56)',
  'rgb(135, 56, 56)',
  'rgb(61, 56, 135)'
]

const N = 1e5;
var block = [47, 82, 117, 152, 187, 222, 257, 292, 327, 362, 397, 432, 467, 502, 537], bn = 15;
const over = 2;
var b = new Array(15);
var dp = [];
var sol = [];
var cnt = [];

function App() {

  const [height, setHeight] = useState(25)
  const [bottomWidth, setBottomWidth] = useState(16)
  const [topWidth, setTopWidth] = useState(10)
  const [polygon, setPolygon] = useState([])
  const [displayFlag, setDisplayFlag] = useState(false)
  const [polyNumber] = useState(4)
  const [leftBarFlag, setLeftBarFlag] = useState(true)
  const [rightBarFlag, setRightBarFlag] = useState(false)
  const [elementName, SetElementName] = useState('')
  const [elementNameBack, SetElementNameBack] = useState('')
  const [globalCoords, setGlobalCoords] = useState({ x: 0, y: 0 });
  var total = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

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

  function prepareOpitization() {
    for (let i = 0; i < N; i++) {
      sol.push([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
      dp.push(N)
      cnt.push(N)
    }

    for (let i = 0; i < bn; i++) {
      b[i] = block[i]
    }
    let ov = over;
    dp[0] = 0;
    for (let i = 1; i < N; i++) {
      for (let j = 0; j < bn; j++) {
        if (i <= b[j]) {
          if (dp[i] > b[j]) {
            dp[i] = b[j];
            for (let k = 0; k < bn; k++) {
              if (k === j) sol[i][k] = 1
              else sol[i][k] = 0
            }
            cnt[i] = 1;
          }
        }
        else {
          if (dp[i] > dp[i - b[j] + ov] + b[j] || (dp[i] === dp[i - b[j] + ov] + b[j] && cnt[i] > cnt[i - b[j] + ov] + 1)) {
            dp[i] = dp[i - b[j] + ov] + b[j];
            cnt[i] = cnt[i - b[j] + ov] + 1;
            for (let k = 0; k < bn; k++) {
              if (k === j) sol[i][k] = sol[i - b[j] + ov][k] + 1;
              else sol[i][k] = sol[i - b[j] + ov][k] + 0;
            }
          }
        }
      }
    }
  }

  // function calcOpitization(x) {
  //   let h = Math.ceil(x)
  //   console.log(dp[h], sol[h])
  //   // setSolution(sol[h])
  // }

  function calcCrossPointY(p1, p2, px) {
    return (p1.y - p2.y) * (px - p1.x) / (p1.x - p2.x) + p1.y
  }
  function displayCalc() {
    prepareOpitization()
    for (let i = 0; i < maxWidthNum; i++) {
      let px1 = i * 5, px2 = (i + 1) * 5, pxt = i * 5 + 0.0001
      let tempy11 = -1, tempy12 = -1, tempy21 = -1, tempy22 = -1, tempyt1 = -1, tempyt2 = -1;
      let flag1 = false, flag2 = false, flagt = false
      for (let pp = 0; pp < polyNumber; pp++) {
        let p1 = polygon[pp], p2
        if (pp === 0) p2 = polygon[polyNumber - 1]
        else p2 = polygon[pp - 1]
        if ((p1.x >= px1 && px1 >= p2.x) || (p1.x <= px1 && px1 <= p2.x)) {
          let yy = calcCrossPointY(p1, p2, px1)
          if (flag1) tempy11 = yy
          else tempy12 = yy
          flag1 = true
        }
        if ((p1.x >= px2 && px2 >= p2.x) || (p1.x <= px2 && px2 <= p2.x)) {
          let yy = calcCrossPointY(p1, p2, px2)
          if (flag2) tempy21 = yy
          else tempy22 = yy
          flag2 = true
        }
        if ((p1.x >= pxt && pxt >= p2.x) || (p1.x <= pxt && pxt <= p2.x)) {
          let yy = calcCrossPointY(p1, p2, pxt)
          if (flagt) tempyt1 = yy
          else tempyt2 = yy
          flagt = true
        }
      }
      let minn = Math.min.apply(null, [tempy11, tempy12, tempy21, tempy22].filter(a => a !== -1 && a))
      let maxx = Math.max.apply(null, [tempy11, tempy12, tempy21, tempy22].filter(Boolean))
      columnTopPoint[i] = minn
      columnBottomPoint[i] = maxx
      columnHeight[i] = maxx - minn
      console.log(tempy11, tempy12, tempy21, tempy22, maxx, minn)  ///////////
      if (tempyt1 === -1 && tempyt2 === -1) {
        columnTopPoint[i] = maxx
        columnHeight[i] = 0
      }
      // calcOpitization(10.5 * columnHeight[i])
      console.log("columnHeight", columnHeight)
    }
  }
  return (
    <div className="App">
      <div className={elementName === '' ? 'hidden' : 'element-name'} style={{
        backgroundColor: elementNameBack,
        top: globalCoords.y - 80,
        left: globalCoords.x + 20,
      }}>{elementName}</div>
      <div className='header' onClick={()=>{setRightBarFlag(false)}} >
        <p>Marica H.</p>
        <p>ROOFING TOOL</p>
        <p>L-Opt Problem</p>
      </div>
      <div className='main' id='number'>
        <div className={leftBarFlag ? 'slide-right left' : 'left'} onClick={()=>{setRightBarFlag(false)}} >
          <div className='left-bar-button' onClick={() => { setLeftBarFlag(!leftBarFlag) }}>
            <RightWard style={leftBarFlag ? { transform: 'rotate(180deg)' } : {}} />
          </div>
          <div className='input-item'>
            <p>HELGHT</p>
            <div className='flex'>
              <input type="text" onChange={(e) => { setDisplayFlag(false); setHeight(e.target.value) }} value={height} />
              <p>X   0.35 =</p>
              <input type="text" onChange={(e) => { setDisplayFlag(false); setHeight(e.target.value / unitHeight) }} value={height * unitHeight} />
              <p>(M)</p>
            </div>
          </div>
          <div className='input-item'>
            <p>TOP-WIDTH</p>
            <div className='flex'>
              <input type="text" onChange={(e) => { setDisplayFlag(false); setTopWidth(e.target.value) }} value={topWidth} />
              <p>X 1.1 =</p>
              <input type="text" onChange={(e) => { setDisplayFlag(false); setTopWidth(e.target.value / unitWidth) }} value={topWidth * unitWidth} />
              <p>(M)</p>
            </div>
          </div>
          <div className='input-item'>
            <p>BOTTOM-WIDTH</p>
            <div className='flex'>
              <input type="text" onChange={(e) => { setDisplayFlag(false); setBottomWidth(e.target.value) }} value={bottomWidth} />
              <p>X 1.1 =</p>
              <input type="text" onChange={(e) => { setDisplayFlag(false); setBottomWidth(e.target.value / unitWidth) }} value={bottomWidth * unitWidth} />
              <p>(M)</p>
            </div>
          </div>
          <div className='button' onClick={() => { displayCalc(); setDisplayFlag(true) }}>R O O F</div>
        </div>
        <div className='middle' onClick={()=>{if(rightBarFlag) setRightBarFlag(false)}}>
          <div className='draw-area' style={{
            width: `${cellWidth * maxWidthNum}px`, height: `${cellHeight * maxHeightNum}px`,
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
                columnHeight?.map((iItem, iIndex) => {
                  let height = 0;
                  return sol[Math.ceil(maxHeightNum * unitHeight * iItem)]?.map((jItem, jIndex) => {
                    let tempHeight = block[jIndex] / (maxHeightNum * unitHeight);          /////////////////////////////
                    return [...Array(jItem)].map((kItem, kIndex) => {
                      height += tempHeight
                      return (
                        <div className={displayFlag ? 'polygon-flag-item' : 'hidden'} style={{
                          backgroundColor: `${color[jIndex]}`,
                          clipPath: `polygon(
                            ${(iIndex + 0) * 5}% ${columnBottomPoint[iIndex] - (height)}% ,
                            ${(iIndex + 1) * 5}% ${columnBottomPoint[iIndex] - (height)}% ,
                            ${(iIndex + 1) * 5}% ${columnBottomPoint[iIndex] - (height - tempHeight)}% ,
                            ${(iIndex + 0) * 5}% ${columnBottomPoint[iIndex] - (height - tempHeight)}% 
                          )`}} key={"field-item" + iIndex + "-" + jIndex + "-" + kIndex}
                          onClick={() => { setRightBarFlag(true) }}
                          onMouseOver={() => {
                            SetElementName(`M${jIndex + 1}`)
                            SetElementNameBack(color[jIndex])
                          }}
                          onMouseLeave={() => { SetElementName('') }}
                          onMouseMove={(event) => {
                            setGlobalCoords({
                              x: event.screenX,
                              y: event.screenY,
                            });
                          }}
                        ></div>
                      )
                    })
                  })
                })
              }
            </div>
          </div>
        </div>
        <div className={rightBarFlag ? 'slide-left right' : 'right'}>
          <div className='right-bar-button' onClick={() => { setRightBarFlag(!rightBarFlag) }}>
            <RightWard style={rightBarFlag ? {} : { transform: 'rotate(180deg)' }} />
          </div>
          <table>
            <tbody>
              <tr>
                <th>Column</th>
                {
                  [...Array(15)].map((item, index) => {
                    return <th key={"table-header"+index} style={{padding: '0px 10px 0px 10px'}}>M{index + 1}</th>
                  })
                }
              </tr>
              {
                [...Array(21)].map((iItem, iIndex) => {
                  return <tr key={"table-item"+iIndex}>
                    <th>{iIndex===20 ? 'Total' : iIndex+1}</th>
                    {
                      sol[Math.ceil(10.5 * columnHeight[iIndex])]?.map((jItem, jIndex) => {
                        // if(sol[Math.ceil(10.5 * columnHeight[iIndex])][jIndex]){
                        //   return <th key={"table-item"+iIndex+'-'+jIndex}>{sol[Math.ceil(10.5 * columnHeight[iIndex])][jIndex]}</th>
                        // }
                        // return <></>
                        total[jIndex] +=jItem
                        return <th key={"table-item"+iIndex+'-'+jIndex}>{jItem}</th>
                      })

                    }
                    {
                      iIndex===20 && total?.map((item, index)=>{
                        return <th key={"table-item-total"+index}>{item}</th>
                      })
                    }
                  </tr>
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
