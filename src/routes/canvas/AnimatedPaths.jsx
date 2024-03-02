import React, { useEffect, useRef, useState } from "react"
import { Layer, Path } from "react-konva"
import Konva from "konva"

export default function AnimatedPaths ({ pathDatas, strokeWidth = 2, strokeColor = "black", duration = 700 }) {
  const pathsRef = useRef(pathDatas.map(() => React.createRef()))
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized) {
      const animations = []

      pathDatas.forEach((pathData, index) => {
        const pathRef = pathsRef.current[index]
        if (pathRef.current) {
          const length = pathRef.current.getLength()
          pathRef.current.dash([length])
          pathRef.current.dashOffset(length)

          const animation = new Konva.Animation((frame) => {
            const time = frame.time
            const dash = length * (time / duration)
            if (!pathRef.current) {
              animation.stop()
              return
            }
            pathRef.current.dash([dash, length - dash])
          }, pathRef.current.getLayer())

          animations.push(animation)
        }
      })

      setInitialized(true)
      // start each staggered
      animations.forEach((animation, index) => {
        setTimeout(() => {
          animation.start()
          console.log('animation started')
        }, index * (duration + 100))
      })
    }
  }, [pathDatas, duration, initialized])

  return (
    <Layer>
      {pathDatas.map((pathData, index) => (
        <Path
          key={index}
          ref={pathsRef.current[index]}
          data={pathData}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          dashEnabled={true}
          lineCap="round"
        />
      ))}
    </Layer>
  )
}
