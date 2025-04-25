class Camera {
  public x: number = 0;
  public y: number = 0;
  private width: number;
  private height: number;
  private goalX: number = 0;
  private goalY: number = 0;
  
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
  
  public update(playerX: number, playerY: number): void {
    // Calculate target position (camera follows player)
    const targetX = playerX - this.width / 2;
    const targetY = playerY - this.height / 2;
    
    // Smoothly interpolate camera position
    const smoothing = 0.1;
    this.x += (targetX - this.x) * smoothing;
    this.y += (targetY - this.y) * smoothing;
  }
  
  public setDimensions(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }
  
  public setGoalPosition(x: number, y: number): void {
    this.goalX = x;
    this.goalY = y;
  }
  
  public getGoalPosition(): { x: number, y: number } {
    return { x: this.goalX, y: this.goalY };
  }
}

export default Camera;