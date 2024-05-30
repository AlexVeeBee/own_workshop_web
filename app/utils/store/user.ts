// user
import { useDispatch } from "react-redux";
import { IUser } from "../types";
import { Dispatch, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { serverHost } from "../vars";

const getUser = async (id: string | number) => {
    id = id.toString();
    const f = await fetch(`${serverHost}/api/user/get/${id}`);
    if (!f.ok) {
        throw new Error("User not found");
    }
    return f.json();
}

const userLogin = async (username: string, password: string) => {
    const f = await fetch(`${serverHost}/api/user/login`, {
        method: "POST",
        body: JSON.stringify({
            username,
            password
        })
    });
    if (!f.ok) {
        throw new Error("User not found");
    }
    return f.json();

}

export const fetchUser = (id: string | number) => async (dispatch: Dispatch) => {
    const user = await getUser(id);
    dispatch(setUser(user));
}

export const fetchUserLogin = async (username: string, password: string) => async (dispatch: Dispatch) => {
    const user = await userLogin(username, password);
    dispatch(setUser(user));
}

const initialState: IUser & {
    loggedIn: boolean;
    attemptingLogin: boolean;
    loginToken?: string;
} = {
    loggedIn: false,
    attemptingLogin: false,
    id: "",
    username: "",
    pfp: "",
    banner: "",
    nsfw: false,
}

export const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.pfp = action.payload.pfp;
            state.banner = action.payload.banner;
        },
        setAttemptingLogin: (state, action: PayloadAction<boolean>) => {
            state.attemptingLogin = action.payload;
        },
    }
})

export const { setUser } = user.actions;

export default user.reducer;
