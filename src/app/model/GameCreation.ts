import { PlayerScoreCreation } from "./PlayerScoreCreation";

export interface GameCreation {
    "type": string;
    "playerScores" : PlayerScoreCreation[];
}