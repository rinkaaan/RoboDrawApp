import { Container, ContentLayout, Header, SpaceBetween, TextContent } from "@cloudscape-design/components"

export function Component() {
  return (
    <ContentLayout
      header={
        <Header variant="h1">Settings</Header>
      }
    >
      <SpaceBetween size="l">
        <Container header={<Header variant="h2">App Info</Header>}>
          <TextContent>
            <p>Version 1.0.0</p>
          </TextContent>
        </Container>
      </SpaceBetween>
    </ContentLayout>
  )
}
