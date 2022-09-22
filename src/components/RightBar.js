import React from 'react'

function RightBar({rightBarFlag,setRightBarFlag,RightWard,block,solution,columnHeight,total,elementColumn,elementNameBack}) {
    return (
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
    )
}

export default RightBar