import React, { useEffect, useRef } from "react"
import { Path } from "react-konva"
import Konva from "konva"

export default function AnimatedPath({ pathData }) {
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
      const dash = length * (time / 500)
      path.dash([dash, length - dash])
    }, path.getLayer())

    animation.start()

    return () => animation.stop()
  }, [pathData])

  return (
    <Path
      ref={pathRef}
      data={pathData}
      stroke="black"
      strokeWidth={2}
      dashEnabled={true}
      dashOffset={pathLength}
      dash={[pathLength]}
    />
  )
}
