import api from "../api/axios";
import { GameCreation } from "../model/GameCreation";

export function createGame(gameCreation : GameCreation){
    api.post("/games", gameCreation)
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