import './App.scss';
import GridLines from "react-gridlines";
import { useEffect, useState } from 'react';
import { ReactComponent as RightWard } from "./assets/rightward.svg";


// const unitWidth = 1.1, unitHeight = 0.35;
// const cellWidth = unitWidth * 40, cellHeight = unitHeight * 40;
const maxWidthNum = 20;
const maxHeightNum = 30;
const color = [
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
const block = [35, 70, 105, 140, 175, 210, 245, 280, 315, 350, 385]
const overlay = 0;


function App() {

  const [unitWidth, setUnitWidth] = useState(1.1)
  const [unitHeight] = useState(0.35)
  const [cellWidth, setCellWidth] = useState(44)
  const [cellHeight] = useState(14)


  const [height, setHeight] = useState(25)
  const [bottomWidth, setBottomWidth] = useState(16)
  const [topWidth, setTopWidth] = useState(10)
  const [skew, setSkew] = useState(0)
  const [polygon, setPolygon] = useState([])
  const [columnTopPoint, setColumnTopPoint] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [columnBottomPoint, setColumnBottomPoint] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [columnHeight, setColumnHeight] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [solution, setSolution] = useState([])
  const [displayFlag, setDisplayFlag] = useState(false)
  const [leftBarFlag, setLeftBarFlag] = useState(true)
  const [rightBarFlag, setRightBarFlag] = useState(false)
  const [elementName, setElementName] = useState('')
  const [elementColumn, setElementColumn] = useState(-1)
  const [elementNameBack, setElementNameBack] = useState('')
  const [globalCoords, setGlobalCoords] = useState({ x: 0, y: 0 });
  var total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const [drawMode, setDrawMode] = useState(false)
  const [pathString, setPathString] = useState('0% 0%')
  useEffect(() => {
    if (!drawMode) {
      setPolygon([
        {
          x: 50 - topWidth / maxWidthNum * 50 - (2.5 * skew)
            - Math.min(50 - topWidth / maxWidthNum * 50 - (2.5 * skew), 50 - bottomWidth / maxWidthNum * 50 + (2.5 * skew)),
          y: Math.max(0, 100 - height / maxHeightNum * 100)
        },
        {
          x: 50 + topWidth / maxWidthNum * 50 - (2.5 * skew)
            - Math.min(50 - topWidth / maxWidthNum * 50 - (2.5 * skew), 50 - bottomWidth / maxWidthNum * 50 + (2.5 * skew)),
          y: Math.max(0, 100 - height / maxHeightNum * 100)
        },
        {
          x: 50 + bottomWidth / maxWidthNum * 50 + (2.5 * skew)
            - Math.min(50 - topWidth / maxWidthNum * 50 - (2.5 * skew), 50 - bottomWidth / maxWidthNum * 50 + (2.5 * skew)),
          y: 100
        },
        {
          x: 50 - bottomWidth / maxWidthNum * 50 + (2.5 * skew)
            - Math.min(50 - topWidth / maxWidthNum * 50 - (2.5 * skew), 50 - bottomWidth / maxWidthNum * 50 + (2.5 * skew)),
          y: 100
        }
      ])
    }
  }, [height, bottomWidth, topWidth, skew, drawMode])

  function prepareOpitization() {
    var dp = [];
    var sol = [];
    var cnt = [];

    for (let i = 0; i < N; i++) {
      sol.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
      dp.push(N)
      cnt.push(N)
    }
    dp[0] = 0;
    for (let i = 1; i < N; i++) {
      for (let j = 0; j < block.length; j++) {
        if (i <= block[j]) {
          if (dp[i] >= block[j]) {
            dp[i] = block[j];
            for (let k = 0; k < block.length; k++) {
              if (k === j) sol[i][k] = 1
              else sol[i][k] = 0
            }
            cnt[i] = 1;
          }
        }
        else {
          if (dp[i] > dp[i - block[j] + overlay] + block[j] || (dp[i] === dp[i - block[j] + overlay] + block[j] && cnt[i] > cnt[i - block[j] + overlay] + 1)) {
            dp[i] = dp[i - block[j] + overlay] + block[j];
            cnt[i] = cnt[i - block[j] + overlay] + 1;
            for (let k = 0; k < block.length; k++) {
              if (k === j) sol[i][k] = sol[i - block[j] + overlay][k] + 1;
              else sol[i][k] = sol[i - block[j] + overlay][k] + 0;
            }
          }
        }
      }
    }
    for (let i = 0; i < N; i++) {
      let tempSolItem = sol[i]
      for (let i = 0; i < block.length; i++) {
        if (tempSolItem[i] > 0) {
          for (let j = block.length; j > i + 1; j--) {
            if (tempSolItem[j] > 0) {
              tempSolItem[i]--
              tempSolItem[i + 1]++
              tempSolItem[j]--
              tempSolItem[j - 1]++
              i--
              break
            }
          }
        }
      }
      sol[i] = tempSolItem
    }
    setSolution(sol)
  }

  function calcCrossPointY(p1, p2, px) {
    return (p1.y - p2.y) * (px - p1.x) / (p1.x - p2.x) + p1.y
  }
  function setBottomLeft() {
    const tempPolygon = polygon
    let minX = 100, maxY = 0, tempPathString = ''
    for (let i = 0; i < tempPolygon.length; i++) {
      if (minX > tempPolygon[i].x) minX = tempPolygon[i].x
      if (maxY < tempPolygon[i].y) maxY = tempPolygon[i].y
    }
    for (let i = 0; i < tempPolygon.length; i++) {
      tempPolygon[i].x -= minX
      tempPolygon[i].y += (100 - maxY)
      tempPathString += `${tempPolygon[i].x}% ${tempPolygon[i].y}%`
      if (i !== tempPolygon.length - 1) tempPathString += ', '
    }
    setPolygon(tempPolygon)
    setPathString(tempPathString)
  }
  function displayCalc() {
    setBottomLeft()
    prepareOpitization()
    for (let i = 0; i < maxWidthNum; i++) {
      let px1 = i * 5, px2 = (i + 1) * 5, pxt = i * 5 + 0.0001
      let tempyt1 = -1, tempyt2 = -1, flagt = false;
      let tempPointsY = []
      for (let pp = 0; pp < polygon.length; pp++) {
        let p1 = polygon[pp], p2
        if (pp === 0) {
          p2 = polygon[polygon.length - 1]
        }
        else p2 = polygon[pp - 1]
        if ((p1.x >= px1 && px1 >= p2.x) || (p1.x <= px1 && px1 <= p2.x)) tempPointsY.push(calcCrossPointY(p1, p2, px1))
        if ((p1.x >= px2 && px2 >= p2.x) || (p1.x <= px2 && px2 <= p2.x)) tempPointsY.push(calcCrossPointY(p1, p2, px2))
        if ((p1.x >= pxt && pxt >= p2.x) || (p1.x <= pxt && pxt <= p2.x)) {
          let yy = calcCrossPointY(p1, p2, pxt)
          if (flagt) tempyt1 = yy
          else tempyt2 = yy
          flagt = true
          tempPointsY.push(yy)
        }
        if ((px2 > p1.x && p1.x > px1) || (px2 < p1.x && p1.x < px1)) tempPointsY.push(p1.y)
        if ((px2 > p2.x && p2.x > px1) || (px2 < p2.x && p2.x < px1)) tempPointsY.push(p2.y)
      }
      let minn = Math.min.apply(null, tempPointsY.filter(a => (a !== -1 && a) || (a === 0)))
      let maxx = Math.max.apply(null, tempPointsY.filter(Boolean))
      let tempArray = columnTopPoint; tempArray[i] = Math.floor(minn * 1000) / 1000; setColumnTopPoint(tempArray)
      tempArray = columnBottomPoint; tempArray[i] = Math.floor(maxx * 1000) / 1000; setColumnBottomPoint(tempArray)
      tempArray = columnHeight; tempArray[i] = Math.floor((maxx - minn) * 1000) / 1000; setColumnHeight(tempArray)
      if (tempyt1 === -1 && tempyt2 === -1) {
        tempArray = columnTopPoint; tempArray[i] = maxx; setColumnTopPoint(tempArray)
        tempArray = columnHeight; tempArray[i] = 0; setColumnHeight(tempArray)
      }
      // calcOpitization(10.5 * columnHeight[i])
      // if (i === maxWidthNum - 1) {
      //   console.log(columnHeight)
      // }
    }
  }
  function initialize() {
    setPolygon([])
    setPathString('0% 0%')
    setHeight(25)
    setBottomWidth(16)
    setTopWidth(10)
    setSkew(0)
    setDisplayFlag(false)
    setColumnTopPoint([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    setColumnBottomPoint([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    setColumnHeight([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  }
  return (
    <div className="App">
      <div className={elementName === '' ? 'hidden' : 'element-name'} style={{
        backgroundColor: elementNameBack,
        top: globalCoords.y - 80,
        left: globalCoords.x + 20,
      }}>{elementName}</div>
      <div className='header' onClick={() => { setRightBarFlag(false); setLeftBarFlag(true) }} >
        <p>Marica H.</p>
        <p>ROOFING TOOL</p>
        <p>L-Opt Problem</p>
      </div>
      <div className='main' id='number'>
        <div className={leftBarFlag ? 'slide-right left' : 'left'} onClick={() => { setRightBarFlag(false); }} >
          <div className='left-bar-button' onClick={() => { setLeftBarFlag(!leftBarFlag) }}>
            <RightWard style={leftBarFlag ? { transform: 'rotate(180deg)' } : {}} />
          </div>
          <div className='button' onClick={() => { setDrawMode(!drawMode); initialize() }}>{drawMode ? 'GOTO INPUT MODE' : 'GOTO DRAW MODE'}</div>
          <div className='button' onClick={() => {
            if(unitWidth === 1.0) {setUnitWidth(1.1); setCellWidth(44)}
            else {setUnitWidth(1.0); setCellWidth(40)}
            }}>{unitWidth ===1.0 ? 'TURN TO 1.1 M' : 'TURN TO 1.0 M'}</div>
          <div className={drawMode ? 'hidden' : 'input-mode'}>
            <div className='input-item'>
              <p>HELGHT</p>
              <div className='flex'>
                <input type="number" step={0.1} min={0} max={30} value={Number(height).toFixed(1)}
                  onChange={(e) => { setDisplayFlag(false); setHeight(e.target.value) }} />
                <p>X   0.35 =</p>
                <input type="number" step={0.1} min={0} max={10.5} value={Number(height * unitHeight).toFixed(1)}
                  onChange={(e) => { setDisplayFlag(false); setHeight(e.target.value / unitHeight) }} />
                <p>(M)</p>
              </div>
            </div>
            <div className='input-item'>
              <p>TOP-WIDTH</p>
              <div className='flex'>
                <input type="number" step={0.1} min={0} max={20} value={Number(topWidth).toFixed(1)}
                  onChange={(e) => { setDisplayFlag(false); setTopWidth(e.target.value) }} />
                <p>X 1.1 =</p>
                <input type="number" step={0.1} min={0} max={22} value={Number(topWidth * unitWidth).toFixed(1)}
                  onChange={(e) => { setDisplayFlag(false); setTopWidth(e.target.value / unitWidth) }} />
                <p>(M)</p>
              </div>
            </div>
            <div className='input-item'>
              <p>BOTTOM-WIDTH</p>
              <div className='flex'>
                <input type="number" step={0.1} min={0} max={20} value={Number(bottomWidth).toFixed(1)}
                  onChange={(e) => { setDisplayFlag(false); setBottomWidth(e.target.value) }} />
                <p>X 1.1 =</p>
                <input type="number" step={0.1} min={0} max={22} value={Number(bottomWidth * unitWidth).toFixed(1)}
                  onChange={(e) => { setDisplayFlag(false); setBottomWidth(e.target.value / unitWidth) }} />
                <p>(M)</p>
              </div>
            </div>
            <div className='input-item'>
              <p>SKEW</p>
              <div className='flex'>
                <input type="number" step={0.1} min={-20} max={20} value={Number(skew).toFixed(1)}
                  onChange={(e) => { setDisplayFlag(false); setSkew(e.target.value) }} />
                <p>X 1.1 =</p>
                <input type="number" step={0.1} min={-22} max={22} value={Number(skew * unitWidth).toFixed(1)}
                  onChange={(e) => { setDisplayFlag(false); setSkew(e.target.value / unitWidth) }} />
                <p>(M)</p>
              </div>
            </div>
          </div>
          <div className={drawMode ? 'input-mode' : 'hidden'}>
            {
              polygon?.map((item, index) => {
                return (
                  <div className='input-item' key={'draw-input-item' + index}>
                    {/* <p>Point {index + 1}</p> */}
                    <div className='flex'>
                      <p>X : </p>
                      <input type="number" step={0.1} min={-22} max={22} value={Number(item.x * unitWidth * maxWidthNum / 100).toFixed(1)}
                        onChange={(e) => {
                          let tempPolygon = polygon
                          tempPolygon[index].x = e.target.value * 100 / (unitWidth * maxWidthNum)
                          setPolygon([...tempPolygon])
                          setDisplayFlag(false)
                          setBottomLeft()
                        }} />
                      <p>Y : </p>
                      <input type="number" step={0.1} min={-10.5} max={10.5} value={Number((100 - item.y) * unitHeight * maxHeightNum / 100).toFixed(1)}
                        onChange={(e) => {
                          let tempPolygon = polygon
                          tempPolygon[index].y = 100 - (e.target.value * 100 / (unitHeight * maxHeightNum))
                          setPolygon([...tempPolygon])
                          setDisplayFlag(false)
                          setBottomLeft()
                        }} />
                      <p>(M)</p>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className='flex'>
            <div className='button' onClick={() => { initialize(); }}>RESET</div>
            <div className='button' onClick={() => { displayCalc(); setDisplayFlag(true) }}>ROOF</div>
          </div>
        </div>
        <div className='middle' onClick={() => { if (rightBarFlag) { setRightBarFlag(false); setLeftBarFlag(true) } }}>
          <div className={rightBarFlag ? 'draw-area move-left' : 'draw-area'} style={{
            width: `${cellWidth * maxWidthNum}px`, height: `${cellHeight * maxHeightNum}px`,
          }}
            onClick={(event) => {
              if (!drawMode || displayFlag || polygon.length >= 8) return
              let currentTargetRect = event.currentTarget.getBoundingClientRect();
              const x = (event.pageX - currentTargetRect.left) / (cellWidth*maxWidthNum/100)
              const y = (event.pageY - currentTargetRect.top) / (cellHeight*maxHeightNum/100)
              if (pathString === '0% 0%') setPathString(`${x}% ${y}%`)
              else setPathString(pathString + `, ${x}% ${y}%`)
              setPolygon([...polygon, { x: x, y: y }])
            }}>
            <GridLines
              className="grid-background"
              cellHeight={cellHeight}
              cellWidth={cellWidth}
              strokeWidth={1}
            ></GridLines>
            <div className={'polygon'} style={!drawMode ? {
              clipPath: `polygon(
                ${polygon[0]?.x}% ${polygon[0]?.y}%,
                ${polygon[1]?.x}% ${polygon[1]?.y}%,
                ${polygon[2]?.x}% ${polygon[2]?.y}%,
                ${polygon[3]?.x}% ${polygon[3]?.y}%
              )`} : (pathString ? { clipPath: `polygon(${pathString})` } : { clipPath: `polygon(0% 0%)` })}></div>
            {
              polygon?.map((item, index) => {
                return (
                  <div className={'polygon back-red'} style={(drawMode && !displayFlag) ? {
                    clipPath: `polygon(
                    ${item?.x - 0.25}% ${item?.y - 0.5}%,
                    ${item?.x - 0.25}% ${item?.y + 0.5}%,
                    ${item?.x + 0.25}% ${item?.y + 0.5}%,
                    ${item?.x + 0.25}% ${item?.y - 0.5}%
                  )` } : { clipPath: `polygon(0% 0%)` }} key={"polygon-point" + index}></div>
                )
              })
            }
            <div className='polygon-flag-field'>
              {
                columnHeight?.map((iItem, iIndex) => {
                  let height = 0;
                  return solution[Math.ceil(maxHeightNum * unitHeight * iItem)]?.map((jItem, jIndex) => {
                    // if(jIndex ===0 ) return <></>
                    let tempHeight = block[jIndex] / (maxHeightNum * unitHeight);          /////////////////////////////
                    return [...Array(jItem)].map((kItem, kIndex) => {
                      height += tempHeight
                      return (
                        <div key={"field-item" + iIndex + "-" + jIndex + "-" + kIndex}>
                          <div className={displayFlag ? 'polygon-flag-item' : 'hidden'} style={{
                            backgroundColor: `${color[jIndex]}`,
                            clipPath: `polygon(
                            ${(iIndex + 0) * 5}% ${columnBottomPoint[iIndex] - (height)}% ,
                            ${(iIndex + 1) * 5}% ${columnBottomPoint[iIndex] - (height)}% ,
                            ${(iIndex + 1) * 5}% ${columnBottomPoint[iIndex] - (height - tempHeight)}% ,
                            ${(iIndex + 0) * 5}% ${columnBottomPoint[iIndex] - (height - tempHeight)}% 
                          )`}}
                            onClick={() => {
                              setRightBarFlag(true)
                              setLeftBarFlag(false)
                            }}
                            onMouseOver={() => {
                              setElementName(`M${jIndex + 1}`)
                              setElementColumn(iIndex)
                              setElementNameBack(color[jIndex])
                            }}
                            onMouseLeave={() => {
                              setElementName('')
                              setElementColumn(-1)
                            }}
                            onMouseMove={(event) => {
                              setGlobalCoords({
                                x: event.screenX,
                                y: event.screenY,
                              });
                            }}
                          ></div>
                          <div className={displayFlag ? 'polygon-flag-item back-border' : 'hidden'} style={{
                            backgroundColor: `${color[jIndex]}`,
                            clipPath: `polygon(
                            ${(iIndex + 0) * 5}% ${columnBottomPoint[iIndex] - (height)}% ,
                            ${(iIndex + 1) * 5}% ${columnBottomPoint[iIndex] - (height)}% ,
                            ${(iIndex + 1) * 5}% ${columnBottomPoint[iIndex] - (height - tempHeight)}% ,
                            ${(iIndex + 0) * 5}% ${columnBottomPoint[iIndex] - (height - tempHeight)}% ,
                            
                            ${(iIndex + 0) * 5}% ${columnBottomPoint[iIndex] - (height)}%,
                            ${(iIndex + 0) * 5+0.0625}% ${columnBottomPoint[iIndex] - (height)}%,
                            ${(iIndex + 0) * 5+0.0625}% ${columnBottomPoint[iIndex] - (height - tempHeight)-0.125}% ,
                            ${(iIndex + 1) * 5-0.0625}% ${columnBottomPoint[iIndex] - (height - tempHeight)-0.125}% ,
                            ${(iIndex + 1) * 5-0.0625}% ${columnBottomPoint[iIndex] - (height)+0.125}% ,
                            ${(iIndex + 0) * 5+0.0625}% ${columnBottomPoint[iIndex] - (height)+0.125}%
                          )`}}></div>
                        </div>
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
                  [...Array(block.length)].map((item, index) => {
                    return <th key={"table-header" + index}>M{index + 1}</th>
                  })
                }
              </tr>
              {
                [...Array(21)].map((iItem, iIndex) => {
                  return <tr key={"table-item" + iIndex}>
                    <th>{iIndex === 20 ? 'Total' : iIndex + 1}</th>
                    {
                      solution[Math.ceil(10.5 * columnHeight[iIndex])]?.map((jItem, jIndex) => {
                        total[jIndex] += jItem
                        return <th key={"table-item" + iIndex + '-' + jIndex}
                          style={elementColumn === iIndex ? { backgroundColor: elementNameBack, color: 'white' } : {}}>{jItem}</th>
                      })

                    }
                    {
                      iIndex === 20 && total?.map((item, index) => {
                        return <th key={"table-item-total" + index}>{item}</th>
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
