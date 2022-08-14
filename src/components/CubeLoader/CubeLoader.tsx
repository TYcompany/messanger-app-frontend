import React from 'react'
import './CubeLoader.scss'

function CubeLoader() {
    return (
        <>
            <div className="cubeContainer">
                <div className="cube c1"></div>
                <div className="cube c2"></div>
                <div className="cube c4"></div>
                <div className="cube c3"></div>
            </div>

            <div className="textedit">
                <h1>Loading...</h1>
            </div>
        </>
    )
}

export default CubeLoader