
import { Point } from '../types';

/**
 * A simple Queue implementation for BFS.
 */
export class Queue<T> {
  private items: T[] = [];
  
  enqueue(item: T): void {
    this.items.push(item);
  }
  
  dequeue(): T | undefined {
    return this.items.shift();
  }
  
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

/**
 * Breadth-First Search to find the shortest path from start to target in the maze.
 */
export function findPathBFS(start: Point, target: Point, maze: number[][]): Point[] | null {
  const rows = maze.length;
  const cols = maze[0].length;
  const queue = new Queue<{ pos: Point; path: Point[] }>();
  const visited = new Set<string>();

  queue.enqueue({ pos: start, path: [start] });
  visited.add(`${start.x},${start.y}`);

  const directions = [
    { x: 0, y: -1 }, // UP
    { x: 0, y: 1 },  // DOWN
    { x: -1, y: 0 }, // LEFT
    { x: 1, y: 0 },  // RIGHT
  ];

  while (!queue.isEmpty()) {
    const { pos, path } = queue.dequeue()!;

    if (pos.x === target.x && pos.y === target.y) {
      return path;
    }

    for (const dir of directions) {
      const nextX = pos.x + dir.x;
      const nextY = pos.y + dir.y;

      // Basic bounds check and wall check
      if (
        nextX >= 0 && nextX < cols &&
        nextY >= 0 && nextY < rows &&
        maze[nextY][nextX] !== 1 &&
        !visited.has(`${nextX},${nextY}`)
      ) {
        visited.add(`${nextX},${nextY}`);
        queue.enqueue({
          pos: { x: nextX, y: nextY },
          path: [...path, { x: nextX, y: nextY }]
        });
      }
    }
  }

  return null;
}
