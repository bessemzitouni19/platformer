import { Collider } from './utils/collision';

class Player {
  // Position
  public x: number;
  public y: number;
  
  // Dimensions
  private width: number = 32;
  private height: number = 48;
  
  // Physics
  private velocityX: number = 0;
  private velocityY: number = 0;
  private gravity: number = 1000;
  private moveSpeed: number = 200;
  private jumpForce: number = -400;
  private horizontalMovement: number = 0;
  
  // States
  private isJumping: boolean = false;
  private isGrounded: boolean = false;
  
  // Animation state
  private currentFrame: number = 0;
  private frameCount: number = 8;
  private animationTimer: number = 0;
  private animationSpeed: number = 0.1;
  private facingRight: boolean = true;
  
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  
  public update(deltaTime: number): void {
    // Apply horizontal movement
    this.velocityX = this.horizontalMovement * this.moveSpeed;
    
    // Apply gravity
    this.velocityY += this.gravity * deltaTime;
    
    // Update position
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;
    
    // Update animation
    this.updateAnimation(deltaTime);
    
    // Reset grounded state for next frame
    this.isGrounded = false;
  }
  
  public draw(ctx: CanvasRenderingContext2D): void {
    // Debug draw
    ctx.fillStyle = this.isGrounded ? 'green' : 'red';
    
    // Draw player
    if (this.facingRight) {
      ctx.fillRect(this.x - this.width / 2, this.y - this.height, this.width, this.height);
    } else {
      ctx.fillRect(this.x - this.width / 2, this.y - this.height, this.width, this.height);
    }
    
    // Draw player face
    ctx.fillStyle = 'white';
    const eyeSize = 4;
    const eyeOffsetX = this.facingRight ? 6 : -6;
    const eyeOffsetY = -this.height / 2 - 5;
    
    ctx.fillRect(this.x - eyeSize / 2 + eyeOffsetX, this.y + eyeOffsetY, eyeSize, eyeSize);
  }
  
  public setMovement(direction: number): void {
    this.horizontalMovement = direction;
    
    // Update facing direction
    if (direction < 0) {
      this.facingRight = false;
    } else if (direction > 0) {
      this.facingRight = true;
    }
  }
  
  public jump(): void {
    if (this.isGrounded && !this.isJumping) {
      this.velocityY = this.jumpForce;
      this.isJumping = true;
      this.isGrounded = false;
    }
  }
  
  public bounce(): void {
    this.velocityY = this.jumpForce * 0.7; // Less force than a normal jump
  }
  
  public handlePlatformCollision(platform: { getCollider: () => Collider }): void {
    const playerCollider = this.getCollider();
    const platformCollider = platform.getCollider();
    
    // Calculate overlap
    const overlapX = Math.min(
      playerCollider.x + playerCollider.width - platformCollider.x,
      platformCollider.x + platformCollider.width - playerCollider.x
    );
    
    const overlapY = Math.min(
      playerCollider.y + playerCollider.height - platformCollider.y,
      platformCollider.y + platformCollider.height - playerCollider.y
    );
    
    // Determine the direction of collision
    if (overlapX < overlapY) {
      // Horizontal collision
      if (this.x < platformCollider.x) {
        // Collision from left
        this.x = platformCollider.x - playerCollider.width / 2;
      } else {
        // Collision from right
        this.x = platformCollider.x + platformCollider.width + playerCollider.width / 2;
      }
      this.velocityX = 0;
    } else {
      // Vertical collision
      if (this.y < platformCollider.y) {
        // Collision from above
        this.y = platformCollider.y;
        this.velocityY = 0;
        this.isGrounded = true;
        this.isJumping = false;
      } else {
        // Collision from below
        this.y = platformCollider.y + platformCollider.height + this.height;
        this.velocityY = 0;
      }
    }
  }
  
  public getCollider(): Collider {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height,
      width: this.width,
      height: this.height
    };
  }
  
  public getBottom(): number {
    return this.y;
  }
  
  public getVelocityY(): number {
    return this.velocityY;
  }
  
  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = 0;
  }
  
  private updateAnimation(deltaTime: number): void {
    // Update animation timer
    if (Math.abs(this.velocityX) > 0) {
      this.animationTimer += deltaTime;
      if (this.animationTimer >= this.animationSpeed) {
        this.animationTimer = 0;
        this.currentFrame = (this.currentFrame + 1) % this.frameCount;
      }
    } else {
      this.currentFrame = 0; // Reset to idle frame
    }
  }
}

export default Player;