enum GameState {
  START,
  PLAYING,
  GAMEOVER,
  WIN
}

interface GameData {
  score: number;
  gameState: GameState;
  highScore: string;
}

class GameUI {
  private width: number;
  private height: number;
  
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
  
  public draw(ctx: CanvasRenderingContext2D, gameData: GameData): void {
    // Set text properties
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    
    // Draw score
    ctx.fillText(`Score: ${gameData.score}`, 20, 30);
    
    // Draw high score
    ctx.textAlign = 'right';
    ctx.fillText(`High Score: ${gameData.highScore}`, this.width - 20, 30);
    
    // Draw state-specific UI
    switch (gameData.gameState) {
      case GameState.START:
        this.drawStartScreen(ctx);
        break;
      case GameState.GAMEOVER:
        this.drawGameOverScreen(ctx, gameData.score);
        break;
      case GameState.WIN:
        this.drawWinScreen(ctx, gameData.score);
        break;
      default:
        break;
    }
  }
  
  private drawStartScreen(ctx: CanvasRenderingContext2D): void {
    // Semi-transparent background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Title
    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Mini Platformer Adventure', this.width / 2, this.height / 3);
    
    // Instructions
    ctx.font = '24px Arial';
    ctx.fillText('Press any key to start', this.width / 2, this.height / 2);
    
    // Controls
    ctx.font = '18px Arial';
    ctx.fillText('Arrow keys to move, Space to jump', this.width / 2, this.height / 2 + 40);
    ctx.fillText('Collect coins and reach the flag!', this.width / 2, this.height / 2 + 70);
  }
  
  private drawGameOverScreen(ctx: CanvasRenderingContext2D, score: number): void {
    // Semi-transparent background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Game over text
    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', this.width / 2, this.height / 3);
    
    // Final score
    ctx.font = '24px Arial';
    ctx.fillText(`Your Score: ${score}`, this.width / 2, this.height / 2);
    
    // Restart instructions
    ctx.font = '18px Arial';
    ctx.fillText('Press any key to restart', this.width / 2, this.height / 2 + 40);
  }
  
  private drawWinScreen(ctx: CanvasRenderingContext2D, score: number): void {
    // Semi-transparent background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Win text
    ctx.fillStyle = 'white';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Level Complete!', this.width / 2, this.height / 3);
    
    // Final score
    ctx.font = '24px Arial';
    ctx.fillText(`Your Score: ${score}`, this.width / 2, this.height / 2);
    
    // Restart instructions
    ctx.font = '18px Arial';
    ctx.fillText('Press any key to restart', this.width / 2, this.height / 2 + 40);
  }
  
  public setDimensions(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
}

export default GameUI;