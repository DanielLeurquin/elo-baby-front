import React, { use, useEffect } from "react";
import Layout from "../../component/layout/layout";
import HistoryComponent from "./historique-component/historyComponent";
import { Game } from "../../model/Game";
import { PlayerScore } from "../../model/PlayerScore";
import { getAllGames } from "../../service/game.service";
import getUserSubject from "../../service/user.Service";



export function History() {

  const [games, setGames] = React.useState<Game[]>([]);

  useEffect(() => {
    getUserSubject().subscribe((user) => {
      if(user === null) {
        return
      }
      getAllGames().then((games : Game[]) => {
        //Sort games by date
        games.sort((a : Game, b : Game) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setGames(games);
      })

    })
   
  }, []);

  return (
    <Layout>
        <div className="">
          {games.map((game : Game) => {
            return (
              <div key={game.id} className="mb-4">
                <HistoryComponent game={game} ></HistoryComponent>
              </div>
            )
          })}
        </div>
    </Layout>
  );
}
