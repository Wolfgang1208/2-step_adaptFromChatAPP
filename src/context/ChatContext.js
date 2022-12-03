// to prevent multiple context transfering from Home->Sidebar->Chats and back to Chat


import { createContext, useContext, useReducer } from "react";

import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

// using userid and comebinedid to fetch chat messages
export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    // useReducer video (!!! remember to watch later)
    const INITIAL_STATE = {
        chatId: "null",
        user: {}
    };

    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId: currentUser.uid > action.payload.uid ? currentUser.uid + action.payload.uid : action.payload.uid + currentUser.uid,
                };
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <ChatContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
};