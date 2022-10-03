import { useEffect, useState } from 'react';
import { ReactComponent as RightWard } from "./assets/rightward.svg";
import './App.scss';
import GridLines from 'react-gridlines';
import LeftBar from './components/LeftBar';
import RightBar from './components/RightBar';
import MainGraph from './components/MainGraph';
import MainPDF from './components/MainPDF';

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
const block = [35, 70, 105, 140, 175, 210, 245, 280, 315, 350, 385, 420, 455, 490, 525]
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
  const [elementColumn, setElementColumn] = useState(-1)
  const [polygon, setPolygon] = useState([])
  const [solution, setSolution] = useState([])
  const [elementName, setElementName] = useState('')
  const [elementNameBack, setElementNameBack] = useState('')
  const [displayFlag, setDisplayFlag] = useState(false)
  const [leftBarFlag, setLeftBarFlag] = useState(true)
  const [rightBarFlag, setRightBarFlag] = useState(false)
  const [drawMode, setDrawMode] = useState(false)
  const [pdfMode, setPdfMode] = useState(false)
  const [globalCoords, setGlobalCoords] = useState({ x: 0, y: 0 });
  const [pathString, setPathString] = useState('0% 0%')
  const [columnTopPoint, setColumnTopPoint] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [columnBottomPoint, setColumnBottomPoint] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [columnHeight, setColumnHeight] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  var total = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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
      sol.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
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
    }
  }
  function initialize() {
    setPolygon([])
    setPathString('0% 0%')
    setHeight(25)
    setBottomWidth(16)
    setTopWidth(10)
    setSkew(0)
    // setDisplayFlag(false)
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
        <LeftBar leftBarFlag={leftBarFlag} setLeftBarFlag={setLeftBarFlag} setRightBarFlag={setRightBarFlag} drawMode={drawMode}
          setDrawMode={setDrawMode} initialize={initialize} unitWidth={unitWidth} setUnitWidth={setUnitWidth} unitHeight={unitHeight}
          setCellWidth={setCellWidth} setDisplayFlag={setDisplayFlag} height={height} setHeight={setHeight} topWidth={topWidth}
          setTopWidth={setTopWidth} bottomWidth={bottomWidth} setBottomWidth={setBottomWidth} skew={skew} setSkew={setSkew}
          polygon={polygon} setPolygon={setPolygon} setBottomLeft={setBottomLeft} maxWidthNum={maxWidthNum} maxHeightNum={maxHeightNum}
          displayCalc={displayCalc} pdfMode={pdfMode} setPdfMode={setPdfMode} displayFlag={displayFlag} />
        {
          pdfMode ?
            <MainPDF />
            :
            <MainGraph setLeftBarFlag={setLeftBarFlag} setRightBarFlag={setRightBarFlag} drawMode={drawMode} unitHeight={unitHeight}
              polygon={polygon} setPolygon={setPolygon} maxWidthNum={maxWidthNum} maxHeightNum={maxHeightNum} color={color}
              rightBarFlag={rightBarFlag} block={block} solution={solution} columnHeight={columnHeight} cellWidth={cellWidth}
              cellHeight={cellHeight} displayFlag={displayFlag} columnBottomPoint={columnBottomPoint} setGlobalCoords={setGlobalCoords}
              setElementColumn={setElementColumn} setElementName={setElementName} setElementNameBack={setElementNameBack}
              pathString={pathString} setPathString={setPathString} GridLines={GridLines} />
        }
        <RightBar rightBarFlag={rightBarFlag} setRightBarFlag={setRightBarFlag} RightWard={RightWard} block={block} solution={solution}
          columnHeight={columnHeight} total={total} elementColumn={elementColumn} elementNameBack={elementNameBack} />
      </div>
    </div>
  );
}

export default App;
