// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import GameStateContextProvider from "./contexts/gameContext";
import "./main.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
	// <React.StrictMode>
	// 	<App />
	// </React.StrictMode>,
	<GameStateContextProvider>
		<App />
	</GameStateContextProvider>
);
