import React, { useState, useEffect } from "react"
import { Stage, Layer, Line } from "react-konva"
import Konva from "konva"

interface Point {
  x: number
  y: number
}

export function Component() {
  const [pointA, _setPointA] = useState<Point>({ x: 50, y: 50 })
  const [pointB, _setPointB] = useState<Point>({ x: 250, y: 250 })
  const [linePoints, setLinePoints] = useState<number[]>([])

  useEffect(() => {
    const animation = new Konva.Animation((frame: any) => {
      const ratio = frame.time / 1000 // assuming 1 second animation
      const newX = pointA.x + (pointB.x - pointA.x) * ratio
      const newY = pointA.y + (pointB.y - pointA.y) * ratio
      setLinePoints([pointA.x, pointA.y, newX, newY])
      if (ratio >= 1) animation.stop()
    }, [])
    animation.start()
    return () => {
      animation.stop()
    }
  }, [pointA, pointB])

  return (
    <Stage width={1920} height={1080} style={{ border: "1px solid #000", borderRadius: "7px", width: "fit-content", height: "fit-content" }}>
      <Layer>
        <Line
          points={linePoints}
          stroke="#000"
          strokeWidth={2}
        />
      </Layer>
    </Stage>
  )
}
