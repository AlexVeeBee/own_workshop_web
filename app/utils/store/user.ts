// user
import { useDispatch } from "react-redux";
import { IUser } from "../types";
import { Dispatch, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { serverHost } from "../vars";
import cookie from "../cookie";

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
    loginToken?: string;
} = {
    loggedIn: false,
    id: "",
    username: "",
    pfp: "",
    banner: "",
    nsfw: false,
    admin: false,
}

export const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser | null>) => {
            if (action.payload === null) {
                state.loggedIn = false;
                cookie.remove("login");

                Array.from(Object.keys(initialState)).forEach(key => {
                    // @ts-ignore
                    state[key] = initialState[key];
                });

                return;
            }

            Array.from(Object.keys(action.payload)).forEach(key => {
                if (key === "token") {
                    state.loggedIn = true;
                    return;
                }
                // @ts-ignore
                state[key] = action.payload[key];
            });
        },
    }
})

export const { setUser } = user.actions;

export default user.reducer;
