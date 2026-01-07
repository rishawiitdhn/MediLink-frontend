import { useState, useEffect, useContext, createContext } from "react";

const AuthContext = createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export const AuthProvider = ({children}) => {
    const [currUser, setCurrUser] = useState(() => {
  return localStorage.getItem("userId") || null;}); //null means no user is logged in
    const [currRole, setCurrRole] = useState(() => {
  return localStorage.getItem("role") || null;});

    useEffect(()=>{
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("role");
        if(userId){
            setCurrUser(userId);
        }
        if(role){
            setCurrRole(role);
        }
    }, []);

    const value = {currUser, setCurrUser, currRole, setCurrRole};
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}