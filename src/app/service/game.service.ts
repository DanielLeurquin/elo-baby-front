import api from "../api/axios";
import { GameCreation } from "../model/GameCreation";

export function createGame(gameCreation : GameCreation){
    return api.post("/games", gameCreation)
    .then((response) => {
        if (response.status == 200){
            return response.data;
        }
        else {
            throw new Error("Game creation failed");
        }
      })
}

export function getUserGames(userId : number){
    return api.get("/games/user/" + userId)
    .then((response) => {
        if (response.status == 200){
            return response.data;
        }
        else {
            throw new Error("Unable to get user games");
        }
      })
}

export function getAllGames(){
    return api.get("/games")
    .then((response) => {
        if (response.status == 200){
            return response.data;
        }
        else {
            throw new Error("Failed to get games");
        }
      })
}

export function deleteGame(id : number){
    return api.delete("/games/"+id)
    .then((response) => {
        console.log(response)
        if (response.status == 204){
            return response.data;
        }
        else {
            throw new Error("Failed to get games");
        }
      })

}