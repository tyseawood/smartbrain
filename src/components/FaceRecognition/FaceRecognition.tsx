import './FaceRecognition.css'
import React from "react";

type FaceProp = {
    imageUrl: string
    box: {
        topRow: number
        rightCol: number
        bottomRow: number
        leftCol: number
    }
}

const FaceRecognition: React.FC<FaceProp> = ({imageUrl, box}
) => {
    return (
        <div className={'center ma'}>
            <div className={'absolute mt2'}>
                <img
                    id={'input-image'}
                    src={imageUrl}
                    alt=""
                    width={'500px'}
                    height={'auto'}
                />
                <div
                    className={'bounding-box'}
                    style={{
                        top: box.topRow,
                        right: box.rightCol,
                        bottom: box.bottomRow,
                        left: box.leftCol,
                    }}
                ></div>
            </div>
        </div>
    )
}

export default FaceRecognition
