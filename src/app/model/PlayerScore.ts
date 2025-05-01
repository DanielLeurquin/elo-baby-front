import { User } from "./User";

export interface PlayerScore{
    id: number;
    score: number;
    startElo: number;
    endElo: number;
    team: string;
    position: string;
    gameId: number;
    player : User
    
}