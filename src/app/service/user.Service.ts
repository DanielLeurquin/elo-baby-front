import { BehaviorSubject } from "rxjs";
import { User } from "../model/User";
import api from "../api/axios";
import { TokenSet } from "../model/tokenSet";
import { getTokenSubject } from "./token.service";
import { encodeInUrl } from "../utils/helper";
import { AuthInfo } from "../model/AuthInfo";
import { get } from "http";

const userSubject = new BehaviorSubject<User | null>(null);

export function loginUser(authInfo : AuthInfo) {
    
    const headers = {
        "Content-Type": "application/json",
    };
    return fetch(process.env.REACT_APP_API_URL + "/auth", {
        method: "POST",
        credentials: "include",
        headers: headers,
        body: JSON.stringify(authInfo),

    }).then((response) => {
        if (response.status == 200){
            return response.json();
        }
        else {
            throw new Error("Login failed");
        }
      }).then((data) => {
        console.log(data);
        const tokenSet = data! as TokenSet;
        getTokenSubject().next(tokenSet.token);
        localStorage.setItem("refreshToken", tokenSet.refreshToken);
        getActiveUser()
      })

}


export function registerUser(authInfo : AuthInfo) {
    
    const headers = {
        "Content-Type": "application/json",
    };
    return fetch(process.env.REACT_APP_API_URL + "/auth/register", {
        method: "POST",
        credentials: "include",
        headers: headers,
        body: JSON.stringify(authInfo),

    }).then((response) => {
        if (response.status == 200){
            return response.json();
        }
        else {
            throw new Error("register failed");
        }
      }).then((data) => {
        console.log(data);
        const tokenSet = data! as TokenSet;
        getTokenSubject().next(tokenSet.token);
        localStorage.setItem("refreshToken", tokenSet.refreshToken);
        getActiveUser()
      })

}

export function getActiveUser(){

    return api.get("/users/me").then((response) => {
        if (response.status == 200){
            const user = response.data as User;
            userSubject.next(user);
            return user;
        }
        else {
            throw new Error("getActiveUser failed");
        }
      }
    )
}

export function getAllUsers () {
    return api.get("/users/all").then((response) => {
        if (response.status == 200){
            const users = response.data as User[];
            return users;
        }
        else {
            throw new Error("getAllUsers failed");
        }
      }
    )
}



export default function getUserSubject() {
    return userSubject;
}