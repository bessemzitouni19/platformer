import Player from './Player';
import Platform from './Platform';
import Coin from './Coin';
import Enemy from './Enemy';
import Camera from './Camera';
import Level from './Level';
import { checkCollision } from './utils/collision';
import GameUI from './GameUI';

// Game states
enum GameState {
  START,
  PLAYING,
  GAMEOVER,
  WIN
}

class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number = 0;
  private lastTimestamp: number = 0;
  private player: Player;
  private platforms: Platform[] = [];
  private coins: Coin[] = [];
  private enemies: Enemy[] = [];
  private camera: Camera;
  private level: Level;
  private ui: GameUI;
  private score: number = 0;
  private gameState: GameState = GameState.START;
  private keyStates: { [key: string]: boolean } = {};

  constructor(container: HTMLDivElement) {
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    container.appendChild(this.canvas);

    // Get context
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get 2d context');
    }
    this.ctx = context;

    // Initialize game components
    this.level = new Level();
    this.camera = new Camera(this.canvas.width, this.canvas.height);
    this.player = new Player(100, 100);
    this.ui = new GameUI(this.canvas.width, this.canvas.height);

    // Set up event listeners
    this.setupEventListeners();

    // Load level
    this.loadLevel();

    // Start the game loop
    this.startGameLoop();

    // Handle window resize
    window.addEventListener('resize', this.handleResize);
  }

  private setupEventListeners(): void {
    // Keyboard events
    window.addEventListener('keydown', (e) => {
      this.keyStates[e.code] = true;
      
      // Start game on any key press if at start screen
      if (this.gameState === GameState.START || this.gameState === GameState.GAMEOVER) {
        this.resetGame();
        this.gameState = GameState.PLAYING;
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keyStates[e.code] = false;
    });

    // Touch controls
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      // Implement touch controls here
      
      // Start game on any touch if at start screen
      if (this.gameState === GameState.START || this.gameState === GameState.GAMEOVER) {
        this.resetGame();
        this.gameState = GameState.PLAYING;
      }
    });
  }

  private loadLevel(): void {
    const levelData = this.level.getCurrentLevel();
    
    // Clear existing objects
    this.platforms = [];
    this.coins = [];
    this.enemies = [];
    
    // Create platforms
    for (const platform of levelData.platforms) {
      this.platforms.push(new Platform(platform.x, platform.y, platform.width, platform.height));
    }
    
    // Create coins
    for (const coin of levelData.coins) {
      this.coins.push(new Coin(coin.x, coin.y));
    }
    
    // Create enemies
    for (const enemy of levelData.enemies) {
      this.enemies.push(new Enemy(enemy.x, enemy.y, enemy.width, enemy.patrolStart, enemy.patrolEnd));
    }
    
    // Set player start position
    this.player.setPosition(levelData.playerStart.x, levelData.playerStart.y);
    
    // Set flag position in camera for end goal
    this.camera.setGoalPosition(levelData.flag.x, levelData.flag.y);
  }

  private startGameLoop(): void {
    const gameLoop = (timestamp: number) => {
      // Calculate delta time in seconds
      const deltaTime = (timestamp - this.lastTimestamp) / 1000;
      this.lastTimestamp = timestamp;
      
      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Update and render based on game state
      if (this.gameState === GameState.PLAYING) {
        this.update(deltaTime);
      }
      
      this.render();
      
      // Continue the loop
      this.animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    // Start the game loop
    this.animationFrameId = requestAnimationFrame(gameLoop);
  }

  private update(deltaTime: number): void {
    // Update player
    this.handleInput();
    this.player.update(deltaTime);
    
    // Check platform collisions
    this.handlePlatformCollisions();
    
    // Check coin collisions
    this.handleCoinCollisions();
    
    // Check enemy collisions
    this.handleEnemyCollisions();
    
    // Check if player reached the flag
    this.checkWinCondition();
    
    // Check if player fell off the level
    if (this.player.y > this.level.getLevelHeight()) {
      this.gameState = GameState.GAMEOVER;
    }
    
    // Update enemies
    for (const enemy of this.enemies) {
      enemy.update(deltaTime);
    }
    
    // Update camera position to follow player
    this.camera.update(this.player.x, this.player.y);
  }

  private handleInput(): void {
    // Reset movement
    this.player.setMovement(0);
    
    // Handle movement
    if (this.keyStates['ArrowLeft']) {
      this.player.setMovement(-1);
    }
    if (this.keyStates['ArrowRight']) {
      this.player.setMovement(1);
    }
    
    // Handle jump
    if (this.keyStates['Space'] || this.keyStates['ArrowUp']) {
      this.player.jump();
    }
  }

  private handlePlatformCollisions(): void {
    for (const platform of this.platforms) {
      if (checkCollision(this.player.getCollider(), platform.getCollider())) {
        this.player.handlePlatformCollision(platform);
      }
    }
  }

  private handleCoinCollisions(): void {
    for (let i = this.coins.length - 1; i >= 0; i--) {
      if (checkCollision(this.player.getCollider(), this.coins[i].getCollider())) {
        // Increment score
        this.score += 10;
        
        // Remove coin
        this.coins.splice(i, 1);
      }
    }
  }

  private handleEnemyCollisions(): void {
    for (const enemy of this.enemies) {
      if (checkCollision(this.player.getCollider(), enemy.getCollider())) {
        // Check if player is jumping on enemy
        if (this.player.getVelocityY() > 0 && this.player.getBottom() < enemy.getCollider().y + enemy.getCollider().height / 2) {
          // Player defeats enemy
          enemy.defeat();
          this.player.bounce();
          this.score += 20;
        } else if (!enemy.isDefeated()) {
          // Player gets hit
          this.gameState = GameState.GAMEOVER;
        }
      }
    }
  }

  private checkWinCondition(): void {
    const flagPosition = this.level.getFlagPosition();
    if (
      this.player.x > flagPosition.x - 10 &&
      this.player.x < flagPosition.x + 10 &&
      this.player.y > flagPosition.y - 50 &&
      this.player.y < flagPosition.y
    ) {
      this.gameState = GameState.WIN;
      
      // Save high score
      this.saveHighScore();
    }
  }

  private saveHighScore(): void {
    const highScore = localStorage.getItem('platformer-high-score');
    if (!highScore || parseInt(highScore) < this.score) {
      localStorage.setItem('platformer-high-score', this.score.toString());
    }
  }

  private render(): void {
    // Save current transformation
    this.ctx.save();
    
    // Apply camera transformation
    this.ctx.translate(-this.camera.x, -this.camera.y);
    
    // Draw background
    this.level.drawBackground(this.ctx, this.camera);
    
    // Draw platforms
    for (const platform of this.platforms) {
      platform.draw(this.ctx);
    }
    
    // Draw flag
    this.level.drawFlag(this.ctx);
    
    // Draw coins
    for (const coin of this.coins) {
      coin.draw(this.ctx);
    }
    
    // Draw enemies
    for (const enemy of this.enemies) {
      enemy.draw(this.ctx);
    }
    
    // Draw player
    this.player.draw(this.ctx);
    
    // Restore transformation
    this.ctx.restore();
    
    // Draw UI
    this.ui.draw(this.ctx, {
      score: this.score,
      gameState: this.gameState,
      highScore: localStorage.getItem('platformer-high-score') || '0'
    });
  }

  private resetGame(): void {
    this.score = 0;
    this.loadLevel();
  }

  private handleResize = (): void => {
    if (this.canvas.parentElement) {
      this.canvas.width = this.canvas.parentElement.clientWidth;
      this.canvas.height = this.canvas.parentElement.clientHeight;
      this.camera.setDimensions(this.canvas.width, this.canvas.height);
      this.ui.setDimensions(this.canvas.width, this.canvas.height);
    }
  };

  public destroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleInput);
    window.removeEventListener('keyup', this.handleInput);
  }
}

export default Game;