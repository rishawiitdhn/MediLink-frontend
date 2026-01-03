import { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export const AuthProvider = ({children}) => {
    const [currUser, setCurrUser] = useState(null); //null means no user is logged in
    const [role, setRole] = useState(null);

    useEffect(()=>{
        const userId = localStorage.getItem("userId");
        if(userId){
            setCurrUser(userId);
        }
    }, []);

    const value = {currUser, setCurrUser};
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}