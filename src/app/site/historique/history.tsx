import React, { useEffect } from "react";
import Layout from "../../component/layout/layout";
import HistoryComponent from "./historique-component/historyComponent";
import { Game } from "../../model/Game";
import { getAllGames } from "../../service/game.service";
import getUserSubject from "../../service/user.Service";
import { TiDeleteOutline } from "react-icons/ti";

export function History() {
  const [games, setGames] = React.useState<Game[]>([]);

  useEffect(() => {
    getUserSubject().subscribe((user) => {
      if (user === null) {
        return;
      }
      getAllGames().then((games: Game[]) => {
        games.sort((a: Game, b: Game) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setGames(games);
      });
    });
  }, []);

  // 🗑️ Delete handler
  const handleDeleteFirstGame = () => {
    setGames((prevGames) => prevGames.slice(1));
  };

  return (
    <Layout>
      <div>
        {games.map((game: Game, index: number) => {
          return (
            <div key={game.id} className="relative mb-4">
              {/* 🛑 Show delete button only on first game */}
              
              <HistoryComponent game={game} deleteable={index===0}/>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
