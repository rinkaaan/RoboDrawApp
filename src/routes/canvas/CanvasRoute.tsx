import { Button, Container, ContentLayout, Header, SpaceBetween, TextContent } from "@cloudscape-design/components"

export function Component() {
  return (
    <ContentLayout
      header={
        <Header variant="h1">Canvas</Header>
      }
    >
      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Open here</Header>}>
          <Button variant="primary">Click this</Button>
        </Container>
      </SpaceBetween>
    </ContentLayout>
  )
}
