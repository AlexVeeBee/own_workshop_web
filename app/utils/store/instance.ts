// instance

import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    banner: null,
    title: "",
    description: ""
}

export const instance = createSlice({
    name: "instance",
    initialState,
    reducers: {
        setInstance: (state, action) => {
            state.banner = action.payload.banner;
            state.title = action.payload.title;
            state.description = action.payload.description;
        }
    }
})

export const { setInstance } = instance.actions;

export default instance.reducer;