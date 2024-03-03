import React, { useEffect, useRef, useState } from "react"
import { Layer, Path } from "react-konva"
import Konva from "konva"

export default function AnimatedPaths({
  pathDatas,
  strokeWidth = 2,
  strokeColor = "black",
  duration = 700,
  index, // Index prop to control visibility and animation
}) {
  const pathsRef = useRef(pathDatas.map(() => React.createRef()))
  const [pathLengths, setPathLengths] = useState([])
  const lastShownIndex = useRef(-1) // Keep track of the last shown index for comparison

  // Initialize paths and store their lengths
  useEffect(() => {
    const lengths = pathDatas.map((_, idx) => {
      const pathRef = pathsRef.current[idx]
      if (pathRef.current) {
        const length = pathRef.current.getLength()
        pathRef.current.dash([length])
        pathRef.current.dashOffset(length)
        pathRef.current.visible(false) // Initially hide all paths
        return length
      }
      return 0
    })
    setPathLengths(lengths)
  }, [pathDatas])

  useEffect(() => {
    // Determine direction of index change
    const isForward = index > lastShownIndex.current

    pathDatas.forEach((_, idx) => {
      const pathRef = pathsRef.current[idx].current
      if (pathRef) {
        if (idx <= index) {
          pathRef.visible(true)
          // Animate only if moving forward and it's the next path to be shown
          if (isForward && idx === index) {
            const length = pathLengths[idx]
            pathRef.dash([length])
            pathRef.dashOffset(length)

            const animation = new Konva.Animation((frame) => {
              const progress = Math.min(frame.time / duration, 1)
              const dashOffset = length - length * progress
              pathRef.dashOffset(dashOffset)
              if (progress === 1) animation.stop()
            }, pathRef.getLayer())

            animation.start()
          }
        } else {
          // Hide without animation if moving backward
          pathRef.visible(false)
        }
      }
    })

    // Update lastShownIndex after processing
    lastShownIndex.current = index
  }, [index, pathDatas, duration, pathLengths])

  return (
    <Layer>
      {pathDatas.map((pathData, idx) => (
        <Path
          key={idx}
          ref={pathsRef.current[idx]}
          data={pathData}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          dashEnabled={true}
          lineCap="round"
          visible={idx <= index} // Control visibility based on index
        />
      ))}
    </Layer>
  )
}
