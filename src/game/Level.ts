interface LevelData {
  width: number;
  height: number;
  playerStart: { x: number, y: number };
  platforms: { x: number, y: number, width: number, height: number }[];
  coins: { x: number, y: number }[];
  enemies: { x: number, y: number, width: number, patrolStart: number, patrolEnd: number }[];
  flag: { x: number, y: number };
}

class Level {
  private currentLevelIndex: number = 0;
  private levels: LevelData[] = [];
  private backgroundLayers: { color: string, parallax: number }[] = [
    { color: '#3b429f', parallax: 0.1 },
    { color: '#4c52ad', parallax: 0.3 },
    { color: '#5c5fb9', parallax: 0.5 }
  ];
  
  constructor() {
    this.initializeLevels();
  }
  
  private initializeLevels(): void {
    // First level
    this.levels.push({
      width: 2000,
      height: 800,
      playerStart: { x: 100, y: 200 },
      platforms: [
        // Ground
        { x: 0, y: 400, width: 500, height: 50 },
        { x: 600, y: 400, width: 300, height: 50 },
        { x: 1000, y: 400, width: 400, height: 50 },
        { x: 1500, y: 400, width: 500, height: 50 },
        
        // Floating platforms
        { x: 180, y: 280, width: 100, height: 20 },
        { x: 350, y: 320, width: 100, height: 20 },
        { x: 700, y: 320, width: 100, height: 20 },
        { x: 850, y: 280, width: 100, height: 20 },
        { x: 1200, y: 320, width: 100, height: 20 },
        { x: 1350, y: 280, width: 100, height: 20 }
      ],
      coins: [
        { x: 230, y: 230 },
        { x: 350, y: 280 },
        { x: 450, y: 350 },
        { x: 700, y: 280 },
        { x: 850, y: 230 },
        { x: 950, y: 350 },
        { x: 1200, y: 280 },
        { x: 1350, y: 230 },
        { x: 1450, y: 350 }
      ],
      enemies: [
        { x: 300, y: 400, width: 30, patrolStart: 200, patrolEnd: 400 },
        { x: 750, y: 400, width: 30, patrolStart: 650, patrolEnd: 850 },
        { x: 1200, y: 400, width: 30, patrolStart: 1100, patrolEnd: 1300 }
      ],
      flag: { x: 1900, y: 350 }
    });
  }
  
  public getCurrentLevel(): LevelData {
    return this.levels[this.currentLevelIndex];
  }
  
  public getLevelWidth(): number {
    return this.levels[this.currentLevelIndex].width;
  }
  
  public getLevelHeight(): number {
    return this.levels[this.currentLevelIndex].height;
  }
  
  public getFlagPosition(): { x: number, y: number } {
    return this.levels[this.currentLevelIndex].flag;
  }
  
  public drawBackground(ctx: CanvasRenderingContext2D, camera: { x: number, y: number }): void {
    const level = this.levels[this.currentLevelIndex];
    
    // Draw sky background
    ctx.fillStyle = '#2a2f92';
    ctx.fillRect(0, 0, level.width, level.height);
    
    // Draw parallax layers
    this.backgroundLayers.forEach(layer => {
      const parallaxX = camera.x * layer.parallax;
      
      ctx.fillStyle = layer.color;
      
      // Create cloudy looking pattern
      for (let i = 0; i < 20; i++) {
        const x = (i * 200) - (parallaxX % 200);
        const width = 120 + (i % 3) * 30;
        const y = 150 + (i % 5) * 20;
        const height = 50 + (i % 3) * 20;
        
        ctx.beginPath();
        ctx.ellipse(x, y, width, height, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    // Draw ground base
    ctx.fillStyle = '#6a994e';
    ctx.fillRect(0, 450, level.width, level.height - 450);
  }
  
  public drawFlag(ctx: CanvasRenderingContext2D): void {
    const flagPosition = this.levels[this.currentLevelIndex].flag;
    
    // Draw flag pole
    ctx.fillStyle = '#6c757d';
    ctx.fillRect(flagPosition.x, flagPosition.y - 80, 5, 80);
    
    // Draw flag
    ctx.fillStyle = '#f94144';
    ctx.beginPath();
    ctx.moveTo(flagPosition.x + 5, flagPosition.y - 80);
    ctx.lineTo(flagPosition.x + 30, flagPosition.y - 65);
    ctx.lineTo(flagPosition.x + 5, flagPosition.y - 50);
    ctx.fill();
  }
  
  public nextLevel(): boolean {
    if (this.currentLevelIndex < this.levels.length - 1) {
      this.currentLevelIndex++;
      return true;
    }
    return false;
  }
}

export default Level;