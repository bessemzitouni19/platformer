export interface Collider {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function checkCollision(a: Collider, b: Collider): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}