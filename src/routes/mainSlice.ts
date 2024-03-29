import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit"
import { FlashbarProps } from "@cloudscape-design/components"
import { AsyncStatus, sleep, uuid } from "../common/typedUtils"
import type { RootState } from "../common/reducers"
import { getActionName } from "../common/utils"

const top = "M740.69,113.28 C733.33,119.40 725.93,125.93 721.13,131.33 C714.75,138.69 708.22,147.73 706.84,150.16 C704.06,155.14 699.44,168.04 697.26,175.88 C695.26,183.27 693.27,195.40 692.76,202.37 C692.25,209.48 692.87,220.22 694.54,227.26 C695.52,231.31 697.60,237.41 699.23,240.96 C702.22,247.39 711.23,259.84 715.28,263.44 C717.70,265.56 724.02,269.85 727.80,271.69 C734.53,274.91 747.18,278.20 753.83,279.04 C760.90,279.91 775.46,280.30 783.27,279.61 C791.17,278.90 803.92,275.88 809.65,273.23 C813.14,271.60 823.46,265.55 830.79,260.11 C835.99,256.19 843.63,247.27 847.04,242.32 C850.25,237.56 855.73,225.52 858.50,217.25 C860.36,211.59 862.37,200.10 862.26,192.57 C862.07,182.66 860.93,172.42 859.49,166.19 C858.32,161.26 851.74,144.67 848.09,139.18 C844.52,133.88 832.65,121.89 826.09,116.77 C822.71,114.15 818.15,111.43 814.83,109.97 C809.19,107.55 797.52,105.14 791.70,105.13 C785.54,105.14 769.98,107.13 762.48,108.76 C749.89,111.52 732.36,119.13 728.05,121.16"
const middle = "M733.31,335.13 C733.37,339.65 735.09,349.23 735.70,353.07 C736.78,358.39 738.97,369.31 740.08,374.91 C740.98,379.22 742.79,387.75 743.71,391.97 C744.15,393.89 750.28,407.36 750.45,407.80 C751.16,409.75 755.89,420.13 757.93,424.41 C760.15,428.91 764.75,438.07 766.21,440.79 C769.74,447.23 772.61,451.40 776.29,456.22 C779.56,460.36 786.92,468.34 790.24,471.29 C791.46,472.35 798.56,479.12 803.30,481.47 C806.40,482.97 816.42,484.88 820.62,485.31 C822.97,485.50 828.83,485.81 834.76,485.47 C839.25,485.12 849.76,483.37 851.66,482.91 C855.14,482.01 863.78,479.74 868.93,478.37 C869.76,478.13 876.98,474.60 880.89,472.30 C882.66,471.23 885.29,469.63 886.15,469.10 C889.60,466.94 890.59,465.64 891.60,464.12 C894.73,459.26 898.90,451.00 900.18,447.93 C901.01,445.78 902.31,442.41 902.66,439.09 C902.85,436.87 904.17,424.86 904.12,420.97 C904.09,419.10 902.75,409.16 901.32,403.44 C900.26,399.47 897.47,388.54 896.17,383.61 C894.17,376.04 891.35,366.27 889.30,359.78 C886.62,351.94 884.69,347.38 882.46,338.98 C880.54,331.85 877.39,322.17 874.36,316.39 C871.76,311.55 862.36,300.31 857.45,295.13 C854.76,292.40 845.30,283.87 840.83,281.15 C835.94,278.26 826.74,272.87 822.42,270.36 C817.40,267.51 815.82,266.78 811.21,265.96 C806.09,264.82 793.63,263.69 789.65,263.51 C782.28,263.33 773.66,265.06 767.55,266.79 C762.30,268.42 756.46,270.24 755.87,270.42 C751.60,274.19 745.17,279.83 743.02,281.71 C741.62,282.93 741.65,283.91 740.72,285.97 C739.28,289.20 735.63,302.55 734.66,308.57 C733.75,314.76 733.26,328.02 733.28,332.78 C733.29,333.54 733.30,334.72 733.31,335.13 Z"
const bottom = "M788.17,459.52 C783.17,461.04 779.06,462.71 777.15,463.76 C774.86,464.97 770.22,472.68 768.83,474.99 C766.54,478.89 760.70,495.93 759.29,502.08 C758.52,505.79 756.79,514.49 756.24,518.71 C755.64,523.92 755.48,534.10 756.07,537.50 C756.77,541.48 761.89,550.17 764.83,553.39 C766.52,555.22 773.67,560.70 777.83,563.09 C781.67,565.24 787.86,567.90 791.55,569.15 C800.42,571.89 815.68,575.75 824.77,577.03 C830.23,577.71 847.53,578.99 854.40,579.16 C861.47,579.22 876.13,578.14 884.12,577.11 C889.76,576.23 901.01,574.14 906.94,573.02 C915.27,571.33 926.23,568.25 932.33,566.03 C933.64,565.51 941.74,562.48 944.93,561.27 C950.75,559.07 965.39,549.86 968.38,548.01 C970.07,546.90 975.30,543.26 976.09,542.57 C977.65,541.20 981.09,532.60 981.75,529.84 C982.41,527.02 983.14,520.19 983.15,518.21 C983.13,514.40 979.93,498.10 976.72,491.16 C976.66,491.02 971.20,480.92 970.02,479.24 C968.44,477.00 963.84,472.56 959.78,469.57 C956.07,466.96 941.51,459.52 933.58,456.31 C931.96,455.68 924.78,452.81 920.75,451.16 C915.65,449.14 900.47,446.36 892.49,445.17 C886.96,444.47 866.97,444.24 856.15,445.14 C847.96,445.92 830.29,449.14 824.93,450.26 C818.51,451.69 802.23,455.74 795.66,457.46 C792.83,458.23 788.19,459.51 788.17,459.52 Z"

export interface MainState {
  navigationOpen: boolean;
  notifications: Array<FlashbarProps.MessageDefinition>;
  dirty: boolean;
  dirtyModalVisible: boolean;
  dirtyRedirectUrl?: string;
  lockScroll?: boolean;
  startingPath?: string;
  asyncStatus: Record<string, AsyncStatus>;

  canvasOpen: boolean;
  pathIndex: number;
  pathDatas: Array<string>;
}

const initialState: MainState = {
  navigationOpen: false,
  notifications: [],
  dirty: false,
  dirtyModalVisible: false,
  dirtyRedirectUrl: undefined,
  lockScroll: false,
  startingPath: undefined,
  asyncStatus: {},

  canvasOpen: false,
  pathIndex: -1,
  pathDatas: [top, middle, bottom],
}

type Notification = Pick<FlashbarProps.MessageDefinition, "type" | "content">

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    updateSlice: (state, action: PayloadAction<Partial<MainState>>) => {
      return { ...state, ...action.payload }
    },
    incrementPathIndex: (state) => {
      if (state.pathIndex < state.pathDatas.length - 1) {
        state.pathIndex++
      }
    },
    decrementPathIndex: (state, forceDecrement: PayloadAction<boolean>) => {
      if (state.pathIndex > -1 || forceDecrement.payload) {
        state.pathIndex--
      }
    },
    addNotification(state, action: PayloadAction<Notification>) {
      // if there is already a notification with the same content, don't add it
      if (state.notifications.find(n => n.content === action.payload.content)) return
      const notification: FlashbarProps.MessageDefinition = {
        ...action.payload,
        dismissible: true,
        id: uuid(),
      }
      state.notifications.push(notification)
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    resetDirty(state) {
      state.dirty = false
      state.dirtyModalVisible = false
      state.dirtyRedirectUrl = undefined
    },
    resetSlice: () => {
      return initialState
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state, action) => {
        state.asyncStatus[getActionName(action)] = "pending"
      })
      .addMatcher(isRejected, (state, action) => {
        state.asyncStatus[getActionName(action)] = "rejected"
      })
      .addMatcher(isFulfilled, (state, action) => {
        state.asyncStatus[getActionName(action)] = "fulfilled"
      })
  },
})

export const redrawIndex = createAsyncThunk(
  "main/redrawIndex",
  async (_payload, { dispatch }) => {
    dispatch(mainActions.decrementPathIndex(true))
    await sleep(5)
    dispatch(mainActions.incrementPathIndex())
    await sleep(600)
  }
)

export const mainReducer = mainSlice.reducer
export const mainActions = mainSlice.actions
export const mainSelector = (state: RootState) => state.main
