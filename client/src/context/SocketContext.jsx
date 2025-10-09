// context/SocketContext.jsx
"use client"

import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { AuthContext } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;

    const host = "http://localhost:8000"
    const socketIo = io(host);

    // Rejoindre la room personnelle
    socketIo.emit("joinRoom", user.idutilisateur.toString());

    setSocket(socketIo);

    // Nettoyage à la fermeture
    return () => {
      socketIo.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
