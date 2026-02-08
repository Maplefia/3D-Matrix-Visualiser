export function matrixVectorMultiply(A: number[][], v: number[]): number[] {
  // Multiply 3×3 A by vector v [x, y, z]
  return [
    A[0][0] * v[0] + A[0][1] * v[1] + A[0][2] * v[2],
    A[1][0] * v[0] + A[1][1] * v[1] + A[1][2] * v[2],
    A[2][0] * v[0] + A[2][1] * v[1] + A[2][2] * v[2]
  ];
}

export function generateCirclePoints(numPoints: number = 100): number[][] {
  const points: number[][] = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    points.push([
      Math.cos(angle),
      0,
      Math.sin(angle)
    ]);
  }
  return points;
}

export function generateGridPoints(): number[][] {
  const points: number[][] = [];
  for (let x = -2; x <= 2; x += 0.5) {
    for (let y = -2; y <= 2; y += 0.5) {
      points.push([x, 0, y]);
    }
  }
  return points;
}

export function generateSpherePoints(numPoints: number = 200): number[][] {
  const points: number[][] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  
  // Use Fibonacci sphere algorithm for even distribution
  for (let i = 0; i < numPoints; i++) {
    const y = 1 - (i / (numPoints - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = goldenRatio * i * 2 * Math.PI;
    
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    
    points.push([x, y, z]);
  }
  return points;
}

export function generateCubePoints(): number[][] {
  const points: number[][] = [];
  const step = 0.25;
  
  // Generate points on all 6 faces of the cube
  for (let i = -1; i <= 1; i += step) {
    for (let j = -1; j <= 1; j += step) {
      points.push([i, j, 1]);
      points.push([i, j, -1]);
      points.push([1, i, j]);
      points.push([-1, i, j]);
      points.push([i, 1, j]);
      points.push([i, -1, j]);
    }
  }
  return points;
}

export const PRESETS = {
  identity: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
  scale: [[2, 0, 0], [0, 1, 0], [0, 0, 1]],
  rotation: (() => {
    const theta = Math.PI / 6;
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return [[c, -s, 0], [s, c, 0], [0, 0, 1]];
  })(),
  shear: [[1, 0.5, 0], [0, 1, 0], [0, 0, 1]],
  mixed: [[1.5, 0.3, 0], [0.3, 0.8, 0], [0, 0, 1.2]]
};
