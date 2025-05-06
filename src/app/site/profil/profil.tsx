import React, { useEffect, useState } from "react";
import Layout from "../../component/layout/layout";
import { User } from "../../model/User";
import getUserSubject, { getUserByUsername } from "../../service/user.Service";
import { Game } from "../../model/Game";
import { getUserGames } from "../../service/game.service";
import { LineChart } from "@mui/x-charts/LineChart";
import { PlayerScore } from "../../model/PlayerScore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import PercentageLine from "../../component/pourcentage-line/pourcentage-line";
import MultiLineToggleChart from "./multilineChart";

export function Profil() {
  const [user, setUser] = useState<User | null>(getUserSubject().value);
  const [games, setGames] = useState<Game[]>([]);
  const [chart1, setChart1] = useState<any[]>([]);
  const [pourcentage, setPourcentage] = useState<number>(50);
  const navigate = useNavigate();

  useEffect(() => {
    const userSub = getUserSubject().subscribe((usersub) => {
      //get username in path
      const path = window.location.pathname.split("/");
      const username = path[path.length - 1];
      if(!usersub){
        return;
      }
      getUserByUsername(username).then((user) => {
        if (user === null) {
          navigate("/404");
          return;
        }
        setUser(user);
        getUserGames(user.id).then((games : Game[]) => {
          games.sort((a : Game, b : Game) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setGames(games);
  
          if (games.length === 0) {
            setChart1([]);
            return;
          }
  
          const firstValue = [
            {
              x: 0,
              y: games[0].playerScores.find((ps: PlayerScore) => ps.player.id === user.id)?.startElo,
            },
          ];
  
          const chartData1 = [
            ...firstValue,
            ...games.map((game : Game, index : number) => ({
              x: index + 1,
              y: game.playerScores.find((ps) => ps.player.id === user.id)?.endElo,
            })),
          ];
  
          setChart1(chartData1);
          //victory %
          const victoryCount = games.map((game : Game) => {
            const data = game.playerScores.map((ps : PlayerScore) => {
              return {"username" : ps.player.username, "score" : ps.score}
            })
            //get max score within data
            const maxScore = Math.max(...data.map(p => p.score));
            return maxScore===data.find((elem) => elem.username === user.username)?.score
          }).filter((val) => val).length
          setPourcentage(Math.round(victoryCount/games.length*100*10)/10)
        });

      });
     
      
    });
  }, []);


  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-white flex flex-col items-center px-4 py-8 maxSm:h-[122vh]">

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="absolute right-6 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-600 transition maxSm:mb-12 maxSm:text-xs maxSm:px-3 maxSm:py-2"
          onClick={() => {
            localStorage.removeItem("refreshToken");
            navigate("/login");
            window.location.reload();
          }}
        >
          Se Déconnecter
        </motion.button>
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <FaUserCircle className="text-blue-500 text-6xl" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800">{user?.username}</h1>
          <p className="text-lg text-indigo-600 font-medium mt-2">ELO: {user?.elo}</p>
        </motion.div> 
        
        <div className="w-1/2 h-8 mb-12 flex flex-col items-center">
          <p>Ratio de victoire</p>
          <PercentageLine percentage={Number(pourcentage.toFixed(1))}></PercentageLine>
        </div>
        
        {/* Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-xl p-4 w-full max-w-4xl"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Progression du Joueur</h2>

          <div className="hidden maxSm:block">
            <LineChart
              dataset={chart1}
              xAxis={[{ dataKey: "x", scaleType: "point", label: "Game N°" }]}
              series={[{ dataKey: "y", label: "ELO" }]}
              height={400}
              width={340}
            />
          </div>

          <div className="maxSm:hidden">
            <LineChart
              dataset={chart1}
              xAxis={[{ dataKey: "x", scaleType: "point", label: "Game N°" }]}
              series={[{ dataKey: "y", label: "ELO" }]}
              height={300}
              width={800}
            />
          </div>

        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-xl p-4 w-full max-w-4xl mt-12"
        >
           <h2 className="text-xl font-semibold text-gray-700 mb-4">Progression générale</h2>

          <div>
            <MultiLineToggleChart></MultiLineToggleChart>
          </div>
        </motion.div>

        
      </div>
      
    </Layout>
  );
}
