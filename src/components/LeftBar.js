import React from 'react'
import { ReactComponent as RightWard } from "../assets/rightward.svg";

function LeftBar({ leftBarFlag, setLeftBarFlag, setRightBarFlag, drawMode, setDrawMode, initialize, unitWidth, setUnitWidth,
    unitHeight, setCellWidth, setDisplayFlag, height, setHeight, topWidth, setTopWidth, bottomWidth, setBottomWidth, displayFlag,
    skew, setSkew, polygon, setPolygon, setBottomLeft, maxWidthNum, maxHeightNum, displayCalc, pdfMode, setPdfMode }) {
    return (
        <div className={leftBarFlag ? 'slide-right left' : 'left'} onClick={() => { setRightBarFlag(false); }} >
            <div className='left-bar-button' onClick={() => { setLeftBarFlag(!leftBarFlag) }}>
                <RightWard style={leftBarFlag ? { transform: 'rotate(180deg)' } : {}} />
            </div>
            <div className='button' onClick={() => { setDrawMode(!drawMode); initialize() }}>{drawMode ? 'GOTO INPUT MODE' : 'GOTO DRAW MODE'}</div>
            <div className='button' onClick={() => {
                if (unitWidth === 1.0) { setUnitWidth(1.1); setCellWidth(44) }
                else { setUnitWidth(1.0); setCellWidth(40) }
            }}>{unitWidth === 1.0 ? 'TURN TO 1.1 M' : 'TURN TO 1.0 M'}</div>
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
            <div className={displayFlag ? 'button' : 'button-disabled'}
                onClick={() => { if(displayFlag) setPdfMode(!pdfMode) }}>GENERATE PDF</div>
        </div>
    )
}

export default LeftBar