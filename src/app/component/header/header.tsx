import React, { useEffect } from "react";
import { User } from "../../model/User";
import { get } from "http";
import getUserSubject from "../../service/user.Service";

function Header() {

  const [user, setUser] = React.useState<User | null>(getUserSubject().value);
  useEffect(() => {
    getUserSubject().subscribe((user) => {
      setUser(user);
    })

  }, []);

  const getProfilePath = () => {
    return user ? `/profile/${user.username}` : "/login";
  }

  return (
    <header className="bg-primary-500 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Babyfoot Elo</h1>
        <nav className="space-x-6">
          <a href={getProfilePath()} className="hover:underline transition-colors">Mon profil</a>
          <a href="/game" className="hover:underline transition-colors">Partie</a>
          <a href="/leaderboard" className="hover:underline transition-colors">Classement</a>
          <a href="/history" className="hover:underline transition-colors">Historique</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
