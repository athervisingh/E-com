import { createSlice, UnknownAction } from '@reduxjs/toolkit';
import { BandValue, BandValues, Model } from './additional-details.types';

const { B_2, B_3, B_4 } = BandValue;

// MARK: Initial State
type AdditionalDetailsInitialState = {
	bandValues: BandValues;
	ThresholdClass: string[];
	modelSelection: Model;
	modelThresHold: string[];
};

const initialState: AdditionalDetailsInitialState = {
	bandValues: { band1: B_4, band2: B_3, band3: B_2 },
	ThresholdClass: [],
	modelSelection: Model.MAHALANOBIS_DISTANCE_CLASSIFIER,
	modelThresHold: ['1'],
};

// MARK: Types
type BandKeyValue = {
	bandkey: keyof BandValues;
	value: BandValue;
};

// MARK: Action Types
type SetBandValuesAction = UnknownAction & {
	payload: BandKeyValue;
};

// MARK: Helper Functions
const getNewBandValues = (bandValues: BandValues, { bandkey, value }: BandKeyValue) => {
	const newBandValues = { ...bandValues };
	newBandValues[bandkey] = value;
	return newBandValues;
};

// MARK: Slice
const addDetailsSlice = createSlice({
	name: 'additional-details',
	initialState,
	reducers: {
        setBandValues: (state, action: SetBandValuesAction) => {
            state.bandValues = getNewBandValues(state.bandValues, action.payload);
        },
		setThresholdClass: (state, action) => {
            state.ThresholdClass.push(action.payload.name);
		},
		setModelSelection: (state, action) => {
			const { value } = action.payload;
			state.modelSelection = value;
		},
		setModelThresHoldValue: (state, action) => {
			const { value } = action.payload;
			state.modelThresHold = value;
		},
		setModelThresHoldObject: (state, action) => {
			const { name, value } = action.payload;
			state.modelThresHold[name] = value;
		},
	},
});

// MARK: Actions
export const {
	setBandValues,
	setThresholdClass,
	setModelSelection,
	setModelThresHoldObject,
	setModelThresHoldValue,
} = addDetailsSlice.actions;
export default addDetailsSlice.reducer;
