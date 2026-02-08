// Utility to compute eigenvalues and eigenvectors
import * as math from 'mathjs';

export interface EigenInfo {
  eigenvalue: number;
  eigenvector: number[];
  color: number;
  isComplex: boolean;
  imaginaryPart?: number;
}

export function computeEigenInfo(matrix: number[][]): EigenInfo[] {
  const data: EigenInfo[] = [];
  
  try {
    const eigenResult = math.eigs(matrix);
    const eigenvectorsMatrix = eigenResult.eigenvectors;
    
    for (let i = 0; i < eigenvectorsMatrix.length; i++) {
      const eigenData = eigenvectorsMatrix[i];
      const eigenvalueComplex = eigenData.value;
      
      let imaginaryPart = 0;
      let isComplex = false;
      
      if (typeof eigenvalueComplex === 'object' && 'im' in eigenvalueComplex) {
        imaginaryPart = Math.abs((eigenvalueComplex as any).im);
        isComplex = imaginaryPart > 0.001;
      }
      
      // eigenvalue
      const eigenvalue = typeof eigenvalueComplex === 'number' 
        ? eigenvalueComplex 
        : (eigenvalueComplex as any).re;
      
      // eigenvector (extract real parts from the vector)
      const eigenvectorData = eigenData.vector;
      const eigenvector: number[] = [];
      
      for (let j = 0; j < 3; j++) {
        const component = eigenvectorData[j];
        const realPart = typeof component === 'number' 
          ? component 
          : (component as any).re || 0;
        eigenvector.push(realPart);
      }
      
      let color;
      if (isComplex) {
        color = 0xff00ff; // Magenta for complex eigenvalues
      } else if (Math.abs(eigenvalue - 1) < 0.1) {
        color = 0xffff00; // Yellow - stable (λ ≈ 1)
      } else if (Math.abs(eigenvalue) < 1) {
        color = 0xff0000; // Red - contracting (|λ| < 1)
      } else {
        color = 0x0000ff; // Blue - expanding (|λ| > 1)
      }
      
      data.push({
        eigenvalue,
        eigenvector,
        color,
        isComplex,
        imaginaryPart: isComplex ? imaginaryPart : undefined
      });
    }
  } catch (e) {
    console.warn('Could not compute eigenvalues:', e);
  }
  
  return data;
}

export function getColorName(color: number): string {
  switch (color) {
    case 0xffff00: return 'Yellow (≈1)';
    case 0xff00ff: return 'Magenta (Complex)';
    case 0xff0000: return 'Red (<1)';
    case 0x0000ff: return 'Blue (>1)';
    default: return '';
  }
}
