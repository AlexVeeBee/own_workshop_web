import instanceStore from "./store/instance";
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

const initUserState: IUser = {
    id: "",
    username: "",
    pfp: "",
    banner: null
}

const reducer = {
}

// const reducer = (state = defaultState, action: updateAction) => {
    
// }

const store = configureStore({
    reducer: {
        instance: instanceStore,
    }
})

export default store;