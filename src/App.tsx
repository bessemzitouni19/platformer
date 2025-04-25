import React, { useEffect, useRef } from 'react';
import Game from './game/Game';

function App() {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<Game | null>(null);

  useEffect(() => {
    if (gameContainerRef.current && !gameInstanceRef.current) {
      gameInstanceRef.current = new Game(gameContainerRef.current);
    }

    return () => {
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy();
        gameInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-indigo-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-white mb-4">Mini Platformer Adventure</h1>
      <div className="w-full max-w-4xl bg-indigo-800 rounded-lg shadow-lg overflow-hidden">
        <div 
          ref={gameContainerRef} 
          className="w-full aspect-video relative"
        />
      </div>
      <div className="mt-4 text-white text-center">
        <p className="mb-2">Controls: Arrow keys to move, Space to jump</p>
        <p>Collect coins and reach the flag to win!</p>
      </div>
    </div>
  );
}

export default App;