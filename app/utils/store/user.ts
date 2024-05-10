// user
import { IUser } from "../types";
import { Dispatch, createSlice } from "@reduxjs/toolkit";

const getUser = async (id: string | number) => {
    id = id.toString();
    const f = await fetch(`http://localhost:8080/api/user/get/${id}`);
    if (!f.ok) {
        throw new Error("User not found");
    }
    return f.json();
}

export const fetchUser = (id: string | number) => async (dispatch: Dispatch) => {
    const user = await getUser(id);
    dispatch(setUser(user));
}

const initialState: IUser = {
    id: "",
    username: "",
    pfp: "",
    banner: "",
}

export const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.pfp = action.payload.pfp;
            state.banner = action.payload.banner;
        }
    }
})

export const { setUser } = user.actions;

export default user.reducer;
