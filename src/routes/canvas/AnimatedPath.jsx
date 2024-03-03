import React, { useEffect, useRef } from "react"
import { Path } from "react-konva"
import Konva from "konva"

export default function AnimatedPath({ pathData, strokeWidth = 2, strokeColor = "blue", duration = 500 }) {
  const pathRef = useRef(null)
  const [pathLength, setPathLength] = React.useState(0)

  useEffect(() => {
    const path = pathRef.current
    const length = path.getLength()
    if (length) {
      setPathLength(length)
    }

    const animation = new Konva.Animation((frame) => {
      const time = frame.time
      const dash = length * (time / duration)
      path.dash([dash, length - dash])
    }, path.getLayer())

    animation.start()

    return () => animation.stop()
  }, [pathData])

  return (
    <Path
      ref={pathRef}
      data={pathData}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      dashEnabled={true}
      dashOffset={pathLength}
      dash={[pathLength]}
    />
  )
}
