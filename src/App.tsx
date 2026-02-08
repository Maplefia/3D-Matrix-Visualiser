import { Canvas } from "@react-three/fiber"
import { useEffect, useState, useRef, useCallback } from 'react'
import { Scene } from './components/Scene'
import { MatrixInputs } from './components/MatrixInputs'
import { Controls } from './components/Controls'
import { InfoPanel } from './components/InfoPanel'
import { matrixVectorMultiply, generateCirclePoints, generateGridPoints, generateSpherePoints, generateCubePoints, PRESETS } from './utils/mathUtils'

interface PointLogEntry {
  iteration: number;
  position: number[];
}

function App() {
  const [matrix, setMatrix] = useState<number[][]>([
    [2, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ]);

  const [initialPoints, setInitialPoints] = useState<number[][]>([]);
  const [currentPoints, setCurrentPoints] = useState<number[][]>([]);
  const [taggedPointIndex, setTaggedPointIndex] = useState<number | null>(null);
  const [pointLog, setPointLog] = useState<PointLogEntry[]>([]);
  const [iteration, setIteration] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [showPlane, setShowPlane] = useState(true);
  const [showEigenvectors, setShowEigenvectors] = useState(true);
  const [animationDirection, setAnimationDirection] = useState<'forward' | 'backward'>('forward');
  const animationRef = useRef<number | null>(null);
  const allIterationPoints = useRef<number[][][]>([]);

  useEffect(() => {
    const points = generateCirclePoints();
    setInitialPoints(points);
    setCurrentPoints(points.map(p => [...p]));
  }, []);

  const reset = useCallback(() => {
    setCurrentPoints(initialPoints.map(p => [...p]));
    setIteration(0);
    setAnimating(false);
    setPointLog([]);
    setAnimationDirection('forward');
    allIterationPoints.current = [];
    
    if (taggedPointIndex !== null && taggedPointIndex < initialPoints.length) {
      const p = initialPoints[taggedPointIndex];
      setPointLog([{ iteration: 0, position: [...p] }]);
    }
    
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  }, [initialPoints, taggedPointIndex]);

  const step = useCallback(() => {
    setCurrentPoints(prev => {
      const newPoints = prev.map(p => matrixVectorMultiply(matrix, p));
      setIteration(i => i + 1);
      
      if (taggedPointIndex !== null && taggedPointIndex < newPoints.length) {
        const p = newPoints[taggedPointIndex];
        setPointLog(log => [...log, { iteration: iteration + 1, position: [...p] }]);
      }
      return newPoints;
    });
  }, [matrix, taggedPointIndex, iteration]);

  const animate = useCallback(() => {
    setAnimating(prev => !prev);
  }, []);

  useEffect(() => {
    if (animating) {
      if (allIterationPoints.current.length === 0) {
        const iterations: number[][][] = [initialPoints.map(p => [...p])];
        let points = initialPoints.map(p => [...p]);
        for (let i = 0; i < 10; i++) {
          points = points.map(p => matrixVectorMultiply(matrix, p));
          iterations.push(points.map(p => [...p]));
        }
        allIterationPoints.current = iterations;
      }

      const animateStep = () => {
        setIteration(prev => {
          let next = prev;
          if (animationDirection === 'forward') {
            next = prev + 1;
            if (next >= 10) {
              setAnimationDirection('backward');
              next = 10;
            }
          } else {
            next = prev - 1;
            if (next < 0) {
              setAnimationDirection('forward');
              next = 0;
            }
          }
          setCurrentPoints(allIterationPoints.current[next].map(p => [...p]));
          
          if (taggedPointIndex !== null && taggedPointIndex < allIterationPoints.current[next].length) {
            const p = allIterationPoints.current[next][taggedPointIndex];
            setPointLog(log => {
              const existing = log.find(entry => entry.iteration === next);
              if (!existing) {
                return [...log, { iteration: next, position: [...p] }].sort((a, b) => a.iteration - b.iteration);
              }
              return log;
            });
          }
          
          return next;
        });
        
        animationRef.current = setTimeout(() => {
          requestAnimationFrame(animateStep);
        }, 500);
      };
      animateStep();
    } else {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
    }
    
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [animating, animationDirection, matrix, initialPoints, taggedPointIndex]);

  const setConfig = useCallback((type: 'circle' | 'grid' | 'sphere' | 'cube') => {
    setAnimating(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    allIterationPoints.current = [];
    
    let points: number[][];
    switch (type) {
      case 'circle':
        points = generateCirclePoints();
        break;
      case 'grid':
        points = generateGridPoints();
        break;
      case 'sphere':
        points = generateSpherePoints();
        break;
      case 'cube':
        points = generateCubePoints();
        break;
    }
    setInitialPoints(points);
    setCurrentPoints(points.map(p => [...p]));
    setIteration(0);
    setTaggedPointIndex(null);
    setPointLog([]);
  }, []);

  const loadPreset = useCallback((preset: keyof typeof PRESETS) => {
    setAnimating(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    allIterationPoints.current = [];
    
    setMatrix(PRESETS[preset].map(row => [...row]));
    reset();
  }, [reset]);

  const handlePointClick = useCallback((index: number) => {
    setTaggedPointIndex(index);
    const p = currentPoints[index];
    setPointLog([{ iteration, position: [...p] }]);
  }, [currentPoints, iteration]);

  const togglePlane = useCallback(() => {
    setShowPlane(prev => !prev);
  }, []);

  const toggleEigenvectors = useCallback(() => {
    setShowEigenvectors(prev => !prev);
  }, []);

  const handleMatrixChange = useCallback((newMatrix: number[][]) => {
    setMatrix(newMatrix);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas>
        <color attach="background" args={[0x1a1a1a]} />
        <Scene 
          points={currentPoints} 
          taggedPointIndex={taggedPointIndex}
          onPointClick={handlePointClick}
          matrix={matrix}
          showPlane={showPlane}
          showEigenvectors={showEigenvectors}
          initialPoints={initialPoints}
        />
      </Canvas>
      
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <MatrixInputs matrix={matrix} onMatrixChange={handleMatrixChange} onReset={reset}/>
      </div>

      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <Controls
          onStep={step}
          onAnimate={animate}
          onReset={reset}
          onSetConfig={setConfig}
          onLoadPreset={loadPreset}
          onTogglePlane={togglePlane}
          onToggleEigenvectors={toggleEigenvectors}
          iteration={iteration}
          animating={animating}
          showEigenvectors={showEigenvectors}
        />
      </div>

      <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
        <InfoPanel
          taggedPointIndex={taggedPointIndex}
          pointLog={pointLog}
          matrix={matrix}
        />
      </div>
    </div>
  )
}

export default App
