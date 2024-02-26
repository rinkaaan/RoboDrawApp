import { createHashRouter, Navigate, Outlet, RouterProvider } from "react-router-dom"
import MainLayout from "./routes/MainLayout"
import MainLayoutError from "./routes/MainLayoutError"
import { mainSelector } from "./routes/mainSlice"
import { useSelector } from "react-redux"
import "@cloudscape-design/global-styles/index.css"
import "./app.css"
import { Fragment } from "react"

const router = createHashRouter([
  {
    path: "/",
    // Component: MainLayout,
    Component: Outlet,
    errorElement: <MainLayoutError/>,
    children: [
      {
        path: "canvas",
        lazy: () => import("./routes/canvas/CanvasRoute"),
        handle: createCrumb("Canvas", "/canvas"),
      },
      {
        path: "settings",
        lazy: () => import("./routes/settings/SettingsRoute"),
        handle: createCrumb("Settings", "/settings"),
      },
      {
        path: "*",
        Component: () => <Navigate to="/settings"/>,
      }
    ],
  },
])

export interface CrumbHandle {
  crumbs: () => { crumb: string, path: string }
}

function createCrumb(crumb: string, path: string): CrumbHandle {
  return {
    crumbs: () => {
      return {
        crumb,
        path,
      }
    }
  }
}

export default function App() {
  const { lockScroll } = useSelector(mainSelector)

  return (
    <Fragment>
      <div
        id="test"
        style={lockScroll ? { height: "100%", position: "absolute", width: "100%", overflow: "hidden" } : {}}
      >
        <RouterProvider router={router} />
      </div>
      <div id="top-filler" />
    </Fragment>
  )
}
