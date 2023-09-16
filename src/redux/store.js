import { configureStore } from '@reduxjs/toolkit'

import app from './appState/AppSlice'
import dataset from './appState/Dataset'
// import window from './windowState/WindowSlice'

export default configureStore({
  reducer: {
    app,
    dataset,
    // window,
  },
})