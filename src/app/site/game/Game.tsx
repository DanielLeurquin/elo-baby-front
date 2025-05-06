// src/pages/Game.tsx

import React, { use, useEffect } from "react";
import SelectMenu from "../../component/select-menu/select-menu";
import NumberInput from "../../component/input-number/input-number";
import Layout from "../../component/layout/layout";
import { User } from "../../model/User";
import getUserSubject, { getActiveUser, getAllUsers } from "../../service/user.Service";
import { Error } from "../../model/error";
import { PlayerScoreCreation } from "../../model/PlayerScoreCreation";
import { GameCreation } from "../../model/GameCreation";
import { create } from "domain";
import { createGame } from "../../service/game.service";
import { get } from "http";
import Modal from "../../component/modal/modal";
import { GiQueenCrown } from 'react-icons/gi';
import { Game } from "../../model/Game";
import { PlayerScore } from "../../model/PlayerScore";

interface UserInfoProps {
  name: string;
  elo: number;
}


function checkValidForm(selectedGris1: User, 
                        selectedGris2: User, 
                        selectedNoir1: User, 
                        selectedNoir2: User, 
                        score1: number, 
                        score2: number) : Error {

    // check if all players are unique
    const players = [selectedGris1, selectedGris2, selectedNoir1, selectedNoir2];
    const uniquePlayers = new Set(players.filter(player => player.id !== 0));
    
    // check if each team has at least one player
    if((selectedGris1.id === 0 && selectedGris2.id === 0) || (selectedNoir1.id === 0 && selectedNoir2.id === 0)) {
        return {"message" : "Chaque équipe doit avoir au moins un joueur", "status" : 403} as Error;
    }

    if (uniquePlayers.size !== players.filter(player => player.id !== 0).length) {
        console.log("Players: ", uniquePlayers);
        return {"message" : "Un joueur ne peut pas être selectionné deux fois", "status" : 403} as Error;
    }
    
    // check if scores are different
    if(score1 === score2) {
        return {"message" : "Les scores doivent être différents", "status" : 403} as Error;
    }

    return {"message" : "OK", "status" : 200} as Error;
}


function buildCreateGameRequest(selectedGris1: User,
                                selectedGris2: User,
                                selectedNoir1: User,
                                selectedNoir2: User,
                                score1: number,
                                score2: number) : GameCreation {

    const players = [selectedGris1, selectedGris2, selectedNoir1, selectedNoir2];
    const uniquePlayers = new Set(players.filter(player => player.id !== 0));
    let type;
    if(uniquePlayers.size === 2) {
        type = "DUO";
    }
    else if(uniquePlayers.size === 3) {
        type = "TRIO";
    }
    else if(uniquePlayers.size === 4) {
        type = "QUATUOR";
    }
    let PlayerScore : PlayerScoreCreation[] = [];
    if(selectedGris1.id !== 0) {
        PlayerScore.push({
            "score": score1,
            "team": "GRIS",
            "position": selectedGris2.id === 0 ? "LES_DEUX" : "DEFENSE",
            "playerId": selectedGris1.id
        } as PlayerScoreCreation)
    }
    if(selectedGris2.id !== 0) {
        PlayerScore.push({
            "score": score1,
            "team": "GRIS",
            "position": selectedGris1.id === 0 ? "LES_DEUX" : "ATTAQUE",
            "playerId": selectedGris2.id
        } as PlayerScoreCreation)
    }
    if(selectedNoir1.id !== 0) {
        PlayerScore.push({
            "score": score2,
            "team": "NOIR",
            "position": selectedNoir2.id === 0 ? "LES_DEUX" : "ATTAQUE",
            "playerId": selectedNoir1.id
        } as PlayerScoreCreation)
    }
    if(selectedNoir2.id !== 0) {
        PlayerScore.push({
            "score": score2,
            "team": "NOIR",
            "position": selectedNoir1.id === 0 ? "LES_DEUX" : "DEFENSE",
            "playerId": selectedNoir2.id
        } as PlayerScoreCreation)
    }
    return {
        "type": type,
        "playerScores": PlayerScore
    } as GameCreation;
    
}


const GamePage: React.FC = () => {
    const vide = [{"id" : 0, "username" : "Vide", "elo" : 0, "role" : ""} as User]

    const [score1, setScore1] = React.useState(0);
    const [score2, setScore2] = React.useState(0);
    const [user, setUser] = React.useState<User | null>(getUserSubject().value);
    const [userListValue, setUserListValue] = React.useState<User[]>([]);

    const [selectedGris1, setSelectedGris1] = React.useState<User>(vide[0]);
    const [selectedGris2, setSelectedGris2] = React.useState<User>(vide[0]);
    const [selectedNoir1, setSelectedNoir1] = React.useState<User>(vide[0]);
    const [selectedNoir2, setSelectedNoir2] = React.useState<User>(vide[0]);

    const [error, setError] = React.useState<string>("");

    const [showSucess, setShowSuccess] = React.useState<boolean>(false);
    const [showModal, setShowModal] = React.useState<boolean>(true);
    const [gameSummary, setGameSummary] = React.useState<Game | null>(null)

    const getGameWinner = (game: Game) => {
        const grisScore = game.playerScores.filter(player => player.team === "GRIS")[0]?.score || 0;
        const noirScore = game.playerScores.filter(player => player.team === "NOIR")[0]?.score || 0;
        return grisScore > noirScore ? 'GRIS' : 'NOIR';
    }

    const getGameTeamScore = (game: Game, team: string) => {
        const teamScore = game.playerScores.filter(player => player.team === team)[0]?.score || 0;
        return teamScore;
    }


    useEffect(() => {
        if(user !== null) {
            return
        }
        const userSub = getUserSubject().subscribe((user) => {
            setUser(user);
            if(!user) {
                return
            }
            getAllUsers().then( async (users) => {
                try{
                    const userListvalue = [...vide,  ...users];
                    setUserListValue(userListvalue);
                    setSelectedGris1(userListvalue[0]);
                    setSelectedGris2(userListvalue[0]);
                    setSelectedNoir1(userListvalue[0]);
                    setSelectedNoir2(userListvalue[0]);
                } catch (error) {
                    console.error("Unable to get users", error);
                }
            })
        });
        
        
    },[])
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSuccess(false);
        }, 3000); // 2000 milliseconds = 2 seconds

        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, [showSucess]);


  return (
    <Layout>
        <div className="flex justify-center items-center flex-col bg-white text-white relative">
        {/* User Info in Top-Right */}
        <div className=" absolute top-4 right-4 text-right border-2 border-black bg-white rounded-lg p-4 shadow-lg h-16 justify-center flex items-center flex-col">
            <p className="text-lg font-semibold text-black">{user?.username}</p>
            <p className="text-sm text-black">ELO: {user?.elo}</p>
        </div>
        

        {showModal && gameSummary ? (
        <Modal title="" onClose={() => setShowModal(false)}>
            <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-4 maxSm:text-xl">Résumé de la partie</h2>
            <div className="flex justify-center items-center text-green-600 text-2xl font-bold">
                <GiQueenCrown className="text-yellow-400 w-10 h-10 mr-3 maxSm:w-7 maxSm:h-7" />
                <span className="maxSm:text-base">{getGameWinner(gameSummary)} a gagné</span>
            </div>
            </div>

            <div className="flex gap-8 mb-6 w-[90vh] maxSm:flex-col maxSm:w-full">
            {/* Équipe GRIS */}
            <div className="bg-gray-100 rounded-2xl p-6 shadow-md flex-1 w-full maxSm:p-4">
                <h3 className="text-2xl font-bold text-gray-700 mb-3 maxSm:text-base">Équipe GRIS</h3>
                <p className="text-xl font-semibold mb-4 maxSm:text-sm">
                Score :{" "}
                <span className="text-gray-900">
                    {getGameTeamScore(gameSummary, "GRIS")}
                </span>
                </p>
                <ul className="space-y-2">
                {gameSummary.playerScores
                    .filter((ps: PlayerScore) => ps.team === "GRIS")
                    .map((p: PlayerScore, i) => {
                    const eloChange = p.endElo - p.startElo;
                    return (
                        <li
                        key={i}
                        className="flex justify-between text-lg font-medium maxSm:text-sm"
                        >
                        <a href={"/profile/" + p.player.username}className="text-black hover:underline">{p.player.username} : </a>
                        <div className="flex">
                            <p className="text-black mr-2">{p.startElo}</p>
                            <span
                                
                                className={`${
                                eloChange >= 0 ? "text-green-600" : "text-red-500"
                                }`}
                            >
                                {eloChange >= 0 ? `+${eloChange}` : eloChange} ELO
                            </span>

                        </div>
                        
                        </li>
                    );
                    })}
                </ul>
            </div>

            {/* Équipe NOIR */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-md flex-1 maxSm:p-4">
                <h3 className="text-2xl font-bold text-white mb-3 maxSm:text-base">Équipe NOIR</h3>
                <p className="text-xl text-white font-semibold mb-4 maxSm:text-sm">
                Score :{" "}
                <span className="text-white">
                    {getGameTeamScore(gameSummary, "NOIR")}
                </span>
                </p>
                <ul className="space-y-2">
                {gameSummary.playerScores
                    .filter((ps: PlayerScore) => ps.team === "NOIR")
                    .map((p: PlayerScore, i) => {
                    const eloChange = p.endElo - p.startElo;
                    return (
                        <li
                        key={i}
                        className="flex justify-between text-lg font-medium maxSm:text-sm"
                        >
                        <a href={"/profile/" + p.player.username}className="text-white hover:underline">{p.player.username} : </a>
                        <div className="flex">
                            <p className="text-white mr-2">{p.startElo}</p>
                            <span
                                
                                className={`${
                                eloChange >= 0 ? "text-green-600" : "text-red-500"
                                }`}
                            >
                                {eloChange >= 0 ? `+${eloChange}` : eloChange} ELO
                            </span>

                        </div>
                        
                        </li>
                    );
                    })}
                </ul>
            </div>
            </div>
        </Modal>
        ) : null}



        <div className="flex items-center justify-around h-full mb-4 w-72 maxSm:flex-col-reverse maxSm:mb-16 mt-12">
            <div>
                <p className="text-black">Equipe Grise</p>
                <NumberInput
                    value={score1}
                    onChange={setScore1}
                    min={0}
                    max={100}
                    step={1}
                    className="h-16"
                />
            </div>

            <div>
                <p className="text-black">Equipe Noire</p>
                <NumberInput
                    value={score2}
                    onChange={setScore2}
                    min={0}
                    max={100}
                    step={1}
                    className="h-16"
                />
            </div>
            
        </div>
        
        <div className="flex items-center justify-center h-full">
            <div className="relative w-54 mr-4">
                <div className="absolute top-[-130px] left-[-192px] w-48 maxSm:w-32 maxSm:top-[126px] maxSm:left-[-13px]">
                    <p className="text-black font-bold">Defense</p>
                    <SelectMenu users={userListValue} selected={selectedGris1} onChange={setSelectedGris1}/>
                </div>
        
                <div className="absolute top-[-19px] left-[-192px] w-48 maxSm:w-32 maxSm:top-[126px] maxSm:left-[151px]">
                    <p className="text-black font-bold">Attaque</p>
                    <SelectMenu users={userListValue} selected={selectedGris2} onChange={setSelectedGris2}/>
                </div>
                
            </div>
            <img src="./images/babyfoot.png" className="w-64 maxSm:-rotate-90 lg:rotate-0"></img> 
            <div className="relative w-full ml-4">
                <div className="absolute top-[-96px] left-0 w-48 maxSm:w-32 maxSm:top-[-209px] maxSm:left-[-282px]">
                    <p className="text-black font-bold">Attaque</p>
                    <SelectMenu users={userListValue} selected={selectedNoir1} onChange={setSelectedNoir1}/>
                </div>
        
                <div className="absolute top-[14px] left-0 w-48  maxSm:w-32 maxSm:top-[-209px] maxSm:left-[-105px]">
                    <p className="text-black font-bold">Defense</p>
                    <SelectMenu users={userListValue} selected={selectedNoir2} onChange={setSelectedNoir2}/>
                </div>
                
            </div>
            
        </div>
        <p className="text-red-500 text-sm mt-4 maxSm:mt-24 maxSm:mb-4">{error}</p>
        <button 
            className="bg-primary-500 text-white px-4 py-2 rounded-full hover:bg-primary-600 transition duration-300 mt-8 maxSm:mt-0 maxSm:mb-24"
            onClick={() => {
                const error = checkValidForm(selectedGris1, selectedGris2, selectedNoir1, selectedNoir2, score1, score2);
                console.log("Error: ", error);
                if (error.status !== 200) {
                    setError(error.message);
                    return;
                }else {
                    setError("");
                    const gameCreation = buildCreateGameRequest(selectedGris1, selectedGris2, selectedNoir1, selectedNoir2, score1, score2);
                    try {
                        createGame(gameCreation)
                        .then((game) => {
                            setGameSummary(game);
                            setShowModal(true);
                            setError("");
                        })
                        
                        setScore1(0);
                        setScore2(0);
                        setSelectedGris1(vide[0]);
                        setSelectedGris2(vide[0]);
                        setSelectedNoir1(vide[0]);
                        setSelectedNoir2(vide[0]);
                        getActiveUser()
                    } catch (error) {   
                        setError("Une erreur est survenue lors de la création de la partie, veuillez réessayer.");
                    }
                }

            }}
            >
            Start Game
        </button>

        </div>
    </Layout>
  );
};

export default GamePage;
