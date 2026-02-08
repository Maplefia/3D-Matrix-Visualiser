import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { PointsRenderer } from './PointsRenderer';
import { EigenvectorLines } from './EigenvectorLines';

interface SceneProps {
  points: number[][];
  taggedPointIndex: number | null;
  onPointClick: (index: number) => void;
  matrix: number[][];
  showPlane: boolean;
  showEigenvectors: boolean;
  initialPoints: number[][];
}

export function Scene({ points, taggedPointIndex, onPointClick, matrix, showPlane, showEigenvectors, initialPoints}: SceneProps) {
  const { gl, camera } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const pointsMeshRef = useRef<THREE.Points>(null);
  const raycasterRef = useRef(new THREE.Raycaster());

  useEffect(() => {
    const onCanvasClick = (event: MouseEvent) => {
      if (points.length === 0 || !pointsMeshRef.current) return;

      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.params.Points!.threshold = 0.3;
      raycasterRef.current.setFromCamera(mouse, camera);

      const intersects = raycasterRef.current.intersectObject(pointsMeshRef.current);
      if (intersects.length > 0) {
        onPointClick(intersects[0].index!);
      }
    };
    
    gl.domElement.addEventListener('click', onCanvasClick);
    
    return () => {
      gl.domElement.removeEventListener('click', onCanvasClick);
    };
  }, [gl, camera, points, onPointClick]);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.lookAt(0, 0, 0);
    }
  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[8, 8, 8]} fov={75} near={0.1} far={1000}/>
      {showPlane && (
        <gridHelper args={[100, 100]} position={[0, 0, 0]} />
      )}

      <axesHelper args={[100]} position={[0, 0, 0]} />
      
      <group ref={pointsMeshRef}>
        <PointsRenderer points={points} taggedPointIndex={taggedPointIndex} initialPoints={initialPoints} />
      </group>
      {showEigenvectors && <EigenvectorLines matrix={matrix} />}
      <OrbitControls />
    </>
  );
}
