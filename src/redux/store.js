import { configureStore } from '@reduxjs/toolkit'
import dataSlice from './Slices/DataSlice/dataSlice'
import buttonSlice from './Slices/ButtonSlice/buttonSlice'
import addDetailsSlice from './Slices/additional-details/additional-details.slice'

export default configureStore({
  reducer: {
    dataSlice: dataSlice,
    buttonSlice: buttonSlice,
    addDetailsSlice: addDetailsSlice,
  },
})