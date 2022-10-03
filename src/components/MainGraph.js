import React from 'react'

function MainGraph({ setLeftBarFlag, setRightBarFlag, drawMode, unitHeight, polygon, setPolygon, maxWidthNum, maxHeightNum, color,
    rightBarFlag, block, solution, columnHeight, cellWidth, cellHeight, displayFlag, columnBottomPoint, setGlobalCoords,
    setElementColumn, setElementName, setElementNameBack, pathString, setPathString, GridLines, setElementId }) {
    return (
        <div className='middle' onClick={() => { if (rightBarFlag) { setRightBarFlag(false); setLeftBarFlag(true) } }}>
            <div className={rightBarFlag ? 'draw-area move-left' : 'draw-area'} style={{
                width: `${cellWidth * maxWidthNum}px`, height: `${cellHeight * maxHeightNum}px`,
            }}
                onClick={(event) => {
                    if (!drawMode || displayFlag || polygon.length >= 8) return
                    let currentTargetRect = event.currentTarget.getBoundingClientRect();
                    const x = (event.pageX - currentTargetRect.left) / (cellWidth * maxWidthNum / 100)
                    const y = (event.pageY - currentTargetRect.top) / (cellHeight * maxHeightNum / 100)
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
                    )`} : (pathString ? { clipPath: `polygon(${pathString})` } : { clipPath: `polygon(0% 0%)` })}>
                </div>
                {
                    polygon?.map((item, index) => {
                        return (
                            <div className={'polygon back-red'} style={(drawMode && !displayFlag) ? {
                                clipPath: `polygon(
                                    ${item?.x - 0.25}% ${item?.y - 0.5}%,
                                    ${item?.x - 0.25}% ${item?.y + 0.5}%,
                                    ${item?.x + 0.25}% ${item?.y + 0.5}%,
                                    ${item?.x + 0.25}% ${item?.y - 0.5}%
                                )` } : { clipPath: `polygon(0% 0%)` }} key={"polygon-point" + index}>
                            </div>
                        )
                    })
                }
                <div className='polygon-flag-field'>
                    {
                        columnHeight?.map((iItem, iIndex) => {
                            let height = 0;
                            return solution[Math.ceil(maxHeightNum * unitHeight * iItem - 3)]?.map((jItem, jIndex) => {  /////////////remove - 3////////////////
                                // if(jIndex ===0 ) return <></>
                                let tempHeight = block[jIndex] / (maxHeightNum * unitHeight);
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
                                                    setElementId(jIndex)
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
                                                    ${(iIndex + 0) * 5 + 0.0625}% ${columnBottomPoint[iIndex] - (height)}%,
                                                    ${(iIndex + 0) * 5 + 0.0625}% ${columnBottomPoint[iIndex] - (height - tempHeight) - 0.125}% ,
                                                    ${(iIndex + 1) * 5 - 0.0625}% ${columnBottomPoint[iIndex] - (height - tempHeight) - 0.125}% ,
                                                    ${(iIndex + 1) * 5 - 0.0625}% ${columnBottomPoint[iIndex] - (height) + 0.125}% ,
                                                    ${(iIndex + 0) * 5 + 0.0625}% ${columnBottomPoint[iIndex] - (height) + 0.125}%
                                                )`}}>
                                            </div>
                                        </div>
                                    )
                                })
                            })
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default MainGraph