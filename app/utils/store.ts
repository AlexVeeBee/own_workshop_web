import instanceStore from "./store/instance";
import userStore from "./store/user";
import { configureStore, createSlice } from "@reduxjs/toolkit";

interface instacne {
    banner: string | null;
    title: string;
    description: string;
}

const store = configureStore({
    reducer: {
        instance: instanceStore,
        user: userStore
    },
})

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;