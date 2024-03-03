import React, { useRef, useState } from "react"
import { Stage } from "react-konva"
import { AppLayout, Button, HelpPanel, SpaceBetween } from "@cloudscape-design/components"
import { appDispatch } from "../../common/store"
import { mainActions, mainSelector, redrawIndex } from "../mainSlice"
import useWindowSize from "../../hooks/useWindowSize"
import Konva from "konva"
import { useHotkeys } from "react-hotkeys-hook"
import { useSelector } from "react-redux"
import AnimatedPaths from "./AnimatedPaths"

export default function Canvas() {
  useHotkeys("esc", onClose)
  const stageRef = useRef<Konva.Stage>(null)
  const { pathIndex, pathDatas, asyncStatus } = useSelector(mainSelector)
  const { width, height } = useWindowSize()
  const [toolsOpen, setToolsOpen] = useState(true)
  const [stageData, setStageData] = useState({ scale: 1, position: { x: 0, y: 0 } })

  function onMouseWheel (e) {
    e.evt.preventDefault()
    // if deltaY is abnormally large then ignore it
    if (Math.abs(e.evt.deltaY) > 1000) return

    // if ctrl is not pressed, pan
    if (!e.evt.ctrlKey) {
      // if shift pressed, pan horizontally
      if (e.evt.shiftKey) {
        setStageData({
          ...stageData,
          position: {
            x: stageData.position.x - e.evt.deltaY,
            y: stageData.position.y,
          },
        })
      } else {
        setStageData({
          ...stageData,
          position: {
            x: stageData.position.x - e.evt.deltaX,
            y: stageData.position.y - e.evt.deltaY,
          },
        })
      }
      // else zoom
    } else {
      if (!stageRef.current) return
      const pointer = stageRef.current.getPointerPosition()
      const stage = stageRef.current.position()
      const scale = stageRef.current.scaleX()
      const pointerPosition = {
        x: (pointer.x - stage.x) / scale,
        y: (pointer.y - stage.y) / scale,
      }
      // calculate new scale
      const newScale = stageData.scale - e.evt.deltaY / 400 * stageData.scale
      // const newScale = stageData.scale - e.evt.deltaY / 100 * stageData.scale
      // calculate new stage position so that viewport doesn't jump
      const newStagePosition = {
        x: pointer.x - pointerPosition.x * newScale,
        y: pointer.y - pointerPosition.y * newScale,
      }
      // limit max and min zoom
      if (newScale < 0.3 || newScale > 800) return
      setStageData({
        ...stageData,
        scale: newScale,
        position: newStagePosition,
      })
    }
  }

  function onClose() {
    appDispatch(mainActions.updateSlice({ canvasOpen: false }))
  }

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 3000, overflow: "hidden" }}>
      <AppLayout
        content={
          <Stage
            width={width}
            height={height}
            ref={stageRef}
            style={{ backgroundColor: "#fff", position: "absolute", width: "100%", height: "100%", top: 0, left: 0, cursor: "crosshair" }}
            x={stageData.position.x}
            y={stageData.position.y}
            scale={{ x: stageData.scale, y: stageData.scale }}
            onWheel={onMouseWheel}
          >
            <AnimatedPaths
              pathDatas={pathDatas}
              strokeWidth={5}
              strokeColor="blue"
              index={pathIndex}
            />
            {/*<Layer>*/}
            {/*  {*/}
            {/*    // splice so that only pathDatas 0 to pathIndex are drawn*/}
            {/*    pathDatas.slice(0, pathIndex + 1).map((pathData, i) => (*/}
            {/*      <AnimatedPath*/}
            {/*        key={i}*/}
            {/*        pathData={pathData}*/}
            {/*      />*/}
            {/*    ))*/}
            {/*  }*/}
            {/*</Layer>*/}
          </Stage>
        }
        navigationHide
        toolsOpen={toolsOpen}
        onToolsChange={(e) => {
          setToolsOpen(e.detail.open)
        }}
        tools={
          <HelpPanel
            header={<h2>Canvas Editor</h2>}
            footer={
              <SpaceBetween
                size="s"
                direction="horizontal"
              >
                <Button onClick={onClose}>Close</Button>
              </SpaceBetween>
            }
          >
            <SpaceBetween size="s" direction="horizontal">
              <Button
                onClick={() => appDispatch(mainActions.decrementPathIndex())}
              >
                Previous
              </Button>
              <Button
                onClick={() => appDispatch(mainActions.incrementPathIndex())}
              >
                Next
              </Button>
              <Button
                onClick={() => appDispatch(redrawIndex())}
                disabled={asyncStatus["redrawIndex"] === "pending"}
              >
                Redraw
              </Button>
            </SpaceBetween>
          </HelpPanel>
        }
      />
    </div>
  )
}
