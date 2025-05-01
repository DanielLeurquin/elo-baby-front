import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../service/user.Service";

export default function Login() {
  const [text, setText] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <h1 className="mb-12 text-2xl">Connectez vous</h1>
        <div className="flex flex-col w-1/3 mb-4">
            <input 
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="username"
              className=" text-black border-2 w-full rounded-md px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
            </input>
            <p className="text-red-500 text-sm ml-2">{error}</p>
        </div>
        <button 
          className="bg-primary-500 text-white px-4 py-2 rounded-full hover:bg-primary-600 transition duration-300 mt-8 maxSm:mt-24"
          onClick={async () => {
            try {
              await loginUser({ username: text });
              navigate("/home");
            } catch (error) {
              setError("Erreur de connexion, cet utilisateur n'existe pas");
            }
          }}
        >
            Se connecter
        </button>
        <a className="hover:underline cursor-pointer text-gray-500 mt-4" href="/register">Créer un compte</a>
    </div>
  );
}