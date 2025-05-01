import React, { useEffect } from "react";
import Layout from "../../component/layout/layout";
import { User } from "../../model/User";
import { get } from "http";
import getUserSubject from "../../service/user.Service";
import { Game } from "../../model/Game";
import { getUserGames } from "../../service/game.service";
import { LineChart } from "@mui/x-charts/LineChart";
import { PlayerScore } from "../../model/PlayerScore";


export function Profil() {
    const [user, setUser] = React.useState<User | null>(getUserSubject().value);
    const [games , setGames] = React.useState<Game[]>([]);

    const [chart1, setChart1] = React.useState<any[]>([]);


    useEffect(() => {
        const userSub = getUserSubject().subscribe((user) => {
            setUser(user);
            if(user=== null) {
                return
            }
            getUserGames(user.id).then((games) => {
                //Sort games by date
                games.sort((a : Game, b : Game) => {
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                });
                
                setGames(games);
                const firstValue = [{x: 0, y :games[0].playerScores.find((ps : PlayerScore) => ps.player.id === user.id)?.startElo}];
                const chartData1 = [...firstValue, ...games.map((game : Game) => {
                    const date = new Date(game.date).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                    });
                    return {
                        x: games.indexOf(game) + 1,
                        y: game.playerScores.find((ps : PlayerScore) => ps.player.id === user.id)?.endElo,
                    };
                })];
                setChart1(chartData1);
            })
        });

        
    }, []);

  return (
    <Layout>
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md text-center">
                <h1 className="text-5xl font-bold text-black mb-4">{user?.username}</h1>
                <p className="text-xl text-blue-500 font-semibold">ELO: {user?.elo}</p>
            </div>
            <div className="block maxSm:hidden">
                <LineChart
                    dataset={chart1}
                    xAxis={[{ dataKey: "x", scaleType: "point", label: "Game N°" }]}
                    series={[{ dataKey: "y", label: "ELO" }]}
                    height={400}
                    width={800}
                />
            </div>

            <div className="hidden maxSm:block">
                <LineChart
                    dataset={chart1}
                    xAxis={[{ dataKey: "x", scaleType: "point", label: "Game N°" }]}
                    series={[{ dataKey: "y", label: "ELO" }]}
                    height={500}
                    width={350}
                />
            </div>

        </div>
    </Layout>
  );
}