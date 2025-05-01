import { BehaviorSubject } from "rxjs";
import { TokenSet } from "../model/tokenSet";
import { getActiveUser } from "./user.Service";

const tokenSubject = new BehaviorSubject<string | null>(null);

export function getTokenSubject() {
    return tokenSubject;
}

interface RefreshToken {
    refreshToken: string;
}

export function getTokenFromRefreshToken(refreshToken: RefreshToken){
    const headers = {
            "Content-Type": "application/json",
        };
        return fetch(process.env.REACT_APP_API_URL + "/auth/refresh", {
            method: "POST",
            credentials: "include",
            headers: headers,
            body: JSON.stringify(refreshToken),
    
        }).then((response) => {
            if (response.status == 200){
                return response.json();
            }
            else {
                throw new Error("Enable to refresh token");
            }
          }).then((data) => {
            console.log(data);
            const tokenSet = data! as TokenSet;
            getTokenSubject().next(tokenSet.token);
            localStorage.setItem("refreshToken", tokenSet.refreshToken);
          })

}