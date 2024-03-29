import type { CapacitorElectronConfig } from "@capacitor-community/electron"
import { getCapacitorElectronConfig, setupElectronDeepLinking } from "@capacitor-community/electron"
import { app, MenuItem, MenuItemConstructorOptions } from "electron"
import electronIsDev from "electron-is-dev"
import unhandled from "electron-unhandled"

import { ElectronCapacitorApp, setupContentSecurityPolicy, setupReloadWatcher } from "./setup"

// Graceful handling of unhandled errors.
unhandled()

// Define our menu templates (these are optional)
const trayMenuTemplate: (MenuItemConstructorOptions | MenuItem)[] = [new MenuItem({ label: "Quit App", role: "quit" })]

// Get Config options from capacitor.config
const capacitorFileConfig: CapacitorElectronConfig = getCapacitorElectronConfig()

// Initialize our app. You can pass menu templates into the app here.
// const myCapacitorApp = new ElectronCapacitorApp(capacitorFileConfig);
const myCapacitorApp = new ElectronCapacitorApp(capacitorFileConfig, trayMenuTemplate)

// If deeplinking is enabled then we will set it up here.
if (capacitorFileConfig.electron?.deepLinkingEnabled) {
  setupElectronDeepLinking(myCapacitorApp, {
    customProtocol: capacitorFileConfig.electron.deepLinkingCustomProtocol ?? "mycapacitorapp",
  })
}

// If we are in Dev mode, use the file watcher components.
if (electronIsDev) {
  setupReloadWatcher(myCapacitorApp)
}

// Run Application
(async () => {
  // Wait for electron app to be ready.
  await app.whenReady()
  // Security - Set Content-Security-Policy based on whether we are in dev mode.
  setupContentSecurityPolicy()
  // Initialize our app, build windows, and load content.
  await myCapacitorApp.init()
})()

// Handle when all of our windows are close (platforms have their own expectations).
app.on("window-all-closed", function () {
  app.quit()
})

// When the dock icon is clicked.
app.on("activate", async function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (myCapacitorApp.getMainWindow().isDestroyed()) {
    await myCapacitorApp.init()
  }
})

// Place all ipc or other electron api calls and custom functionality under this line
