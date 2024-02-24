import { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.nguylinc.photos",
  appName: "RoboDraw",
  webDir: "dist",
  server: {
    androidScheme: "https"
  },
}

export default config
