import React, { useEffect, useState } from "react";
import { User } from "../../model/User";
import getUserSubject, { getAllUsers } from "../../service/user.Service";
import Layout from "../../component/layout/layout";
import { motion } from "framer-motion";
import { FaMedal } from "react-icons/fa";

const medalColors = ["text-yellow-400", "text-gray-400", "text-orange-500"];

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const userSub = getUserSubject().subscribe((user) => {
      if (!user) return;
      getAllUsers().then((users) => {
        try {
          users.sort((a, b) => b.elo - a.elo);
          setUsers(users);
        } catch (error) {
          console.error("Unable to get users", error);
        }
      });
    });
  }, []);

  return (
    <Layout>
      <div className="flex flex-col items-center p-6 maxSm:mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-gray-800 mb-6"
        >
        Leaderboard
        </motion.h1>

        <div className="w-full max-w-2xl rounded-2xl border border-gray-200 shadow-2xl bg-white overflow-hidden">
          {/* Sticky Header */}
          <div className="grid grid-cols-3 bg-primary-500 text-white font-bold text-sm uppercase px-6 py-4 sticky top-0 z-10 shadow-sm">
            <span>Rank</span>
            <span>Player</span>
            <span className="text-right">ELO</span>
          </div>

          {/* Scrollable List */}
          <div className="max-h-[25rem] overflow-y-auto">
            {users.map((user, index) => (
              <motion.div
                key={user.username}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`grid grid-cols-3 items-center px-6 py-3 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } border-t border-gray-200`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  {index < 3 ? (
                    <FaMedal className={medalColors[index] + " text-lg"} />
                  ) : (
                    <span className="text-gray-500">{index + 1}</span>
                  )}
                </div>
                <span className="font-medium text-gray-700">{user.username}</span>
                <span className="text-right text-indigo-700 font-bold">{user.elo}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
