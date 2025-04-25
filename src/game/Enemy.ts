import { Collider } from './utils/collision';

class Enemy {
  private x: number;
  private y: number;
  private width: number;
  private height: number = 30;
  private velocity: number = 50;
  private patrolStart: number;
  private patrolEnd: number;
  private direction: number = 1;
  private defeated: boolean = false;
  private animationFrame: number = 0;
  private frameCount: number = 4;
  private animationTimer: number = 0;
  private animationSpeed: number = 0.2;
  
  constructor(x: number, y: number, width: number, patrolStart: number, patrolEnd: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.patrolStart = patrolStart;
    this.patrolEnd = patrolEnd;
  }
  
  public update(deltaTime: number): void {
    if (this.defeated) return;
    
    // Move enemy
    this.x += this.velocity * this.direction * deltaTime;
    
    // Check patrol boundaries
    if (this.x <= this.patrolStart) {
      this.x = this.patrolStart;
      this.direction = 1;
    } else if (this.x >= this.patrolEnd) {
      this.x = this.patrolEnd;
      this.direction = -1;
    }
    
    // Update animation
    this.animationTimer += deltaTime;
    if (this.animationTimer >= this.animationSpeed) {
      this.animationTimer = 0;
      this.animationFrame = (this.animationFrame + 1) % this.frameCount;
    }
  }
  
  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.defeated) {
      // Draw defeated enemy
      ctx.fillStyle = '#6c757d';
      ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height / 2);
    } else {
      // Draw enemy
      ctx.fillStyle = '#f94144';
      ctx.fillRect(this.x - this.width / 2, this.y - this.height, this.width, this.height);
      
      // Draw enemy eyes
      ctx.fillStyle = 'white';
      const eyeSize = 5;
      const eyeOffsetX = this.direction > 0 ? 5 : -5;
      const eyeOffsetY = -this.height / 2 - 5;
      
      ctx.fillRect(this.x - eyeSize / 2 + eyeOffsetX, this.y + eyeOffsetY, eyeSize, eyeSize);
    }
  }
  
  public getCollider(): Collider {
    if (this.defeated) {
      return {
        x: this.x - this.width / 2,
        y: this.y - this.height / 2,
        width: this.width,
        height: this.height / 2
      };
    }
    
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height,
      width: this.width,
      height: this.height
    };
  }
  
  public defeat(): void {
    this.defeated = true;
    this.velocity = 0;
  }
  
  public isDefeated(): boolean {
    return this.defeated;
  }
}

export default Enemy;