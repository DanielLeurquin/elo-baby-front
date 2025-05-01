import React, { use, useEffect } from "react";
import { User } from "../../model/User";
import getUserSubject, { getAllUsers } from "../../service/user.Service";
import Layout from "../../component/layout/layout";




export default function Leaderboard(){

  const [users, setUsers] = React.useState<User[]>([]);

    useEffect(() => {
        const userSub = getUserSubject().subscribe((user) => {

            if(!user) {
                return
            }
            getAllUsers().then( async (users) => {
                try{
                    users.sort((a, b) => b.elo - a.elo);
                    setUsers(users);
                } catch (error) {
                    console.error("Unable to get users", error);
                }
            })
        });
    }, []);

  
  

  return (
    <Layout>
        <div className="min-h-screen bg-white flex flex-col items-center p-6">
        <h1 className="text-3xl font-bold text-black mb-6">Leaderboard</h1>

        <div className="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-primary-500 text-white font-semibold text-sm uppercase px-4 py-2">
            <span>Rang</span>
            <span>Username</span>
            <span className="text-right">ELO</span>
            </div>

            {/* Scrollable List */}
            <div className="max-h-96 overflow-y-auto">
            {users.map((user, index) => (
                <div
                key={user.username}
                className="grid grid-cols-3 items-center px-4 py-3 border-t border-primary-500 text-black"
                >
                <span>{index + 1}</span>
                <span className="font-medium">{user.username}</span>
                <span className="text-right font-semibold">{user.elo}</span>
                </div>
            ))}
            </div>
        </div>
        </div>
    </Layout>
  );
};

