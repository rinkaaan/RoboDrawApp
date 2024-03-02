import { Button, Container, ContentLayout, Header, SpaceBetween } from "@cloudscape-design/components"
import { appDispatch } from "../../common/store"
import { mainActions, mainSelector } from "../mainSlice"
import { Fragment } from "react"
import Canvas from "./Canvas"
import { useSelector } from "react-redux"

export function Component() {
  const { canvasOpen } = useSelector(mainSelector)

  function openCanvas() {
    appDispatch(mainActions.updateSlice({ canvasOpen: true }))
  }

  return (
    <Fragment>
      <ContentLayout
        header={<Header variant="h1">Canvas</Header>}
      >
        <SpaceBetween size="l">
          <Container header={<Header variant="h2">Open here</Header>}>
            <Button
              onClick={openCanvas}
              variant="primary"
            >Click this</Button>
          </Container>
        </SpaceBetween>
      </ContentLayout>
      {canvasOpen && <Canvas/>}
    </Fragment>
  )
}
