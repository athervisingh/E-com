import { createSlice } from "@reduxjs/toolkit";

const addDetailsSlice = createSlice({
    name: "addDetailsSlice",
    initialState: {
        bandValues: { band1: "B4", band2: "B3", band3: "B2", },
        ThresholdClass: [],
        modelSelection: "Mahalanobis Distance Classifier",
        modelThresHold: '1',
    },
    reducers: {
        setBandValues: (state, action) => {
            const { bandkey, value } = action.payload;
            state.bandValues[bandkey] = value;
        },
        setThresholdClass: (state, action) => {
            const { name } = action.payload;
            state.ThresholdClass.push(name);
        },
        setModelSelection: (state, action) => {
            const { value } = action.payload;
            state.modelSelection = value;
        },
        setModelThresHoldValue: (state, action) => {
            const {value} = action.payload;
            state.modelThresHold = value;
        },
        setModelThresHoldObject: (state, action) => {
            const {name , value} = action.payload;
            state.modelThresHold[name] = value;
        },
    }
});

export const { setBandValues , setThresholdClass , setModelSelection , setModelThresHoldObject , setModelThresHoldValue } = addDetailsSlice.actions;
export default addDetailsSlice.reducer;