import { PlayerScore } from "./PlayerScore";

export interface Game{
    id: number;
    date: Date;
    type: string;
    playerScores : PlayerScore[];
}