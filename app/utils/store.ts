import instanceStore from "./store/instance";
import userStore from "./store/user";
import { IUser } from "./types";
import { configureStore, createSlice } from "@reduxjs/toolkit";

interface instacne {
    banner: string | null;
    title: string;
    description: string;
}


const initInstanceState = {
    banner: null,
    title: "",
    description: ""
}
const store = configureStore({
    reducer: {
        instance: instanceStore,
        user: userStore
    },
})

export default store;