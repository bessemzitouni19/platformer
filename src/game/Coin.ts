import { Collider } from './utils/collision';

class Coin {
  private x: number;
  private y: number;
  private radius: number = 10;
  private animationFrame: number = 0;
  private frameCount: number = 6;
  private animationSpeed: number = 0.2;
  private animationTimer: number = 0;
  
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  
  public update(deltaTime: number): void {
    // Update animation
    this.animationTimer += deltaTime;
    if (this.animationTimer >= this.animationSpeed) {
      this.animationTimer = 0;
      this.animationFrame = (this.animationFrame + 1) % this.frameCount;
    }
  }
  
  public draw(ctx: CanvasRenderingContext2D): void {
    // Draw animated coin
    ctx.fillStyle = '#f9c74f';
    
    // Calculate scaling based on animation frame
    const scale = 0.8 + 0.4 * Math.sin(this.animationFrame / this.frameCount * Math.PI * 2);
    const scaledRadius = this.radius * scale;
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, scaledRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw coin inner detail
    ctx.fillStyle = '#f8961e';
    ctx.beginPath();
    ctx.arc(this.x, this.y, scaledRadius * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }
  
  public getCollider(): Collider {
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2
    };
  }
}

export default Coin;