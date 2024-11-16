import { createSlice } from '@reduxjs/toolkit'

export const buttonSlice = createSlice({
    name: "button",
    initialState: {
        enableClasses: false,
        drawControl: false,
        enableROI: true,
        showImageButton: true,
        imageButtonDisabled: true,
        segmentButtonDisabled: true
    },
    reducers: {
        changeButton: (state , action) => {
            const { type, payload } = action.payload;
            state[type] = payload;
        }
    }
})

export const { changeButton } = buttonSlice.actions;

export default buttonSlice.reducer