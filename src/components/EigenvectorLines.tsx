import { useMemo } from 'react';
import * as THREE from 'three';
import { computeEigenInfo } from '../utils/eigenUtils';

interface EigenvectorLinesProps {
  matrix: number[][];
}

export function EigenvectorLines({ matrix }: EigenvectorLinesProps) {
  const eigenData = useMemo(() => computeEigenInfo(matrix), [matrix]);

  return (
    <>
      {eigenData.filter(data => !data.isComplex).map((data, i) => {
        const { eigenvector, color } = data;
        const scale = 2;
        const mag = Math.sqrt(eigenvector.reduce((sum, v) => sum + v * v, 0));
        const scaledVec = eigenvector.map(v => (v / mag) * scale);

        const direction = new THREE.Vector3(scaledVec[0], scaledVec[1], scaledVec[2]);
        const length = direction.length();
        const position = new THREE.Vector3(0, 0, 0);
        
        const axis = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(axis, direction.clone().normalize());

        return (
          <mesh key={i} position={position} quaternion={quaternion}>
            <cylinderGeometry args={[0.02, 0.02, length * 2, 8]} />
            <meshBasicMaterial color={color} />
          </mesh>
        );
      })}
    </>
  );
}
