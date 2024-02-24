WORKPLACE="$HOME/workplace/RoboDraw"

WORKSPACE="$WORKPLACE/RoboDrawApi"

(
  cd "$WORKSPACE"
  ./scripts/gen.sh
)

WORKSPACE="$WORKPLACE/RoboDrawApp"
SCHEMA_PATH="$WORKPLACE/RoboDrawApi/api/openapi.yaml"

(
  cd "$WORKSPACE"
  rm -rf openapi-client
  npx openapi -i "$SCHEMA_PATH" -o openapi-client
)
