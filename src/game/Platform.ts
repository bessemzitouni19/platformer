import { Collider } from './utils/collision';

class Platform {
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  
  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#6a994e';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Draw platform top edge
    ctx.fillStyle = '#a7c957';
    ctx.fillRect(this.x, this.y, this.width, 5);
  }
  
  public getCollider(): Collider {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}

export default Platform;