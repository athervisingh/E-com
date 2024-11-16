import { createSlice } from '@reduxjs/toolkit'

export const dataSlice = createSlice({
    name: "data",
    initialState: {
        ROIdata: [],
        classdata: [],
        dropdownData: [
            { "selection": null, "name": null },
            { "selection": null, "name": null }
        ],
        geoJsonData: [],
        regionOverlays: [],
        classOverlays: []
    },
    reducers: {
        setDropdownData: (state, action) => {
            const { value, name, index } = action.payload;

            if (!state.dropdownData[index]) {
                state.dropdownData[index] = { "selection": null, "name": null };//make uper func
            }

            state.dropdownData[index] = { selection: value, name: name };
        },

        setGeoJsonData: (state, action) => {
            state.geoJsonData = action.payload.payload;
        },

        addGeoJsonData: (state, action) => {
            state.geoJsonData.push(action.payload.payload); 
        },

        setRegionOverlays: (state, action) => {
            state.regionOverlays = action.payload.payload;
        },

        setClassOverlays: (state, action) => {
            console.log(action.payload.payload);
            state.classOverlays.push(action.payload.payload);
        },

        setClassOverlaysOpacity: (state, action) => {
            const { name, value, overlayIndex } = action.payload;

            if (state.classOverlays[overlayIndex] && state.classOverlays[overlayIndex][name]) {
                state.classOverlays[overlayIndex][name].opacity += parseFloat(value);
            }
        },

        setROIdata: (state, action) => {
            state.ROIdata = action.payload;
        },

        setclassdata: (state, action) => {
            state.classdata = action.payload;
        },
    }
});

export const { setDropdownData, setGeoJsonData, addGeoJsonData, setRegionOverlays, setClassOverlays, setClassOverlaysOpacity, setROIdata, setclassdata } = dataSlice.actions;

export default dataSlice.reducer;
