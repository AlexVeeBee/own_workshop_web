// instance

import { Dispatch, createSlice } from "@reduxjs/toolkit";

const getInstance = async () => {
    const f = await fetch(`http://localhost:8080/api/info/get`);
    if (!f.ok) {
        throw new Error("404");
    }
    return f.json();
}

export const fetchInstance = () => async (dispatch: Dispatch) => {
    const instance = await getInstance();
    dispatch(setInstance(instance));
}

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