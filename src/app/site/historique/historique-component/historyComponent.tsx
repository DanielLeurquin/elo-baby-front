import React, { useEffect, useState } from 'react';
import { Game } from '../../../model/Game';
import { GiQueenCrown } from 'react-icons/gi';
import { motion } from 'framer-motion';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md';


type HistoryComponentProps = {
  game: Game;
};

const HistoryComponent: React.FC<HistoryComponentProps> = ({ game }) => {
  const [winner, setWinner] = useState<string>('GRIS');

  const getTeam = (team: string) => game.playerScores.filter(player => player.team === team);

  useEffect(() => {
    const grisScore = getTeam('GRIS')[0]?.score || 0;
    const noirScore = getTeam('NOIR')[0]?.score || 0;
    setWinner(grisScore > noirScore ? 'GRIS' : 'NOIR');
  }, []);

  const renderPlayer = (player: any, isDark: boolean) => {
    const diff = player.endElo - player.startElo;
    const isPositive = diff >= 0;
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const diffColor = isPositive ? 'text-green-400' : 'text-red-400';
    const Icon = isPositive ? MdArrowDropUp : MdArrowDropDown;

    return (
      <div key={player.id} className="flex items-center justify-between py-1 px-3 bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all">
        <p className={`font-semibold ${textColor}`}>{player.player.username}</p>
        <div className="flex items-center gap-1">
          <p className={`${textColor}`}>{player.startElo}</p>
          <Icon className={`${diffColor} text-xl`} />
          <p className={`${diffColor} font-bold`}>{Math.abs(diff)}</p>
        </div>
      </div>
    );
  };

  const renderScoreBoard = (team: string, isDark: boolean) => {
    const teamPlayers = getTeam(team);
    const teamScore = teamPlayers[0]?.score || 0;
    const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-100';
    const textColor = isDark ? 'text-white' : 'text-gray-900';

    return (
      <div className={`relative w-full p-6 rounded-xl shadow-xl ${bgColor} flex flex-col gap-3`}>        
        {winner === team && (
          <motion.div
            initial={{ scale: 0 , x: '-50%'}}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20"
          >
            <GiQueenCrown size={50} className="text-yellow-400 drop-shadow-lg" />
          </motion.div>
        )}

        <div className="flex justify-between items-center mb-3">
          <h2 className={`text-xl font-bold ${textColor}`}>{team}</h2>
          <div className="bg-white text-gray-800 text-sm font-bold px-3 py-1 rounded-full shadow">
            Score: {teamScore}
          </div>
        </div>

        <div className="space-y-2">
          {teamPlayers.map(player => renderPlayer(player, isDark))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="relative flex flex-row maxSm:flex-col justify-between items-center gap-6 border border-gray-300 rounded-3xl bg-gradient-to-br from-white to-gray-50 p-6 shadow-xl flex-1 items-stretch mt-8">
        <div className="absolute -top-[15px] maxSm:-top-[38px] left-1/2 -translate-x-1/2 bg-white text-gray-500 px-3 py-1 rounded-full text-sm shadow-md border">
            {new Date(game.date).toLocaleDateString()}
        </div>
        
        {/* Left Team */}
        {renderScoreBoard('GRIS', false)}

    

        {/* Right Team */}
        {renderScoreBoard('NOIR', true)}
      </div>
    </div>
  );
};

export default HistoryComponent;
