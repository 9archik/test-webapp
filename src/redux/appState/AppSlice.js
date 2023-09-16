import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	language: 'ru',

	isSelected: false,

	selected_category: 'mini',

	bikeState: {
		name: '',
	},
};

export const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		setLanguage: (state, action) => {
			state.language = action.payload;
		},
		setCategory: (state, action) => {
			state.selected_category = action.payload;
      		state.isSelected = true;
		},
	},
});

export const { setLanguage, setCategory } = appSlice.actions;

export default appSlice.reducer;
