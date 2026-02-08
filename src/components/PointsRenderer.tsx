import { useMemo } from 'react';
import * as THREE from 'three';

interface PointsRendererProps {
  points: number[][];
  taggedPointIndex: number | null;
  initialPoints: number[][];
}

export function PointsRenderer({ points, taggedPointIndex, initialPoints }: PointsRendererProps) {
  const positionsAttribute = useMemo(() => {
    if (points.length === 0) return null;
    
    const positions = new Float32Array(points.length * 3);
    points.forEach((point, i) => {
      positions[i * 3] = point[0];
      positions[i * 3 + 1] = point[1];
      positions[i * 3 + 2] = point[2];
    });
    
    return new THREE.BufferAttribute(positions, 3);
  }, [points]);

  //stable points are blue, moving points are green
  const colorsAttribute = useMemo(() => {
    if (points.length === 0 || initialPoints.length === 0) return null;
    
    const colors = new Float32Array(points.length * 3);
    const epsilon = 0.01;
    
    points.forEach((point, i) => {
      if (i >= initialPoints.length) {
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 0;
        return;
      }
      
      const initial = initialPoints[i];
      const dx = Math.abs(point[0] - initial[0]);
      const dy = Math.abs(point[1] - initial[1]);
      const dz = Math.abs(point[2] - initial[2]);
      const isStable = dx < epsilon && dy < epsilon && dz < epsilon;
      
      if (isStable) {
        colors[i * 3] = 0.3;
        colors[i * 3 + 1] = 0.5;
        colors[i * 3 + 2] = 1;
      } else {
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 0;
      }
    });
    
    return new THREE.BufferAttribute(colors, 3);
  }, [points, initialPoints]);

  const taggedPoint = useMemo(() => {
    if (taggedPointIndex !== null && taggedPointIndex < points.length) {
      return points[taggedPointIndex];
    }
    return null;
  }, [taggedPointIndex, points]);

  if (!positionsAttribute || points.length === 0) return null;

  return (
    <>
      <points>
        <bufferGeometry>
          <primitive object={positionsAttribute} attach="attributes-position" />
          {colorsAttribute && <primitive object={colorsAttribute} attach="attributes-color" />}
        </bufferGeometry>
        <pointsMaterial size={0.1} sizeAttenuation={true} vertexColors={true}/>
      </points>

      {taggedPoint && (
        <mesh position={[taggedPoint[0], taggedPoint[1], taggedPoint[2]]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color={0xff0000} />
        </mesh>
      )}
    </>
  );
}
