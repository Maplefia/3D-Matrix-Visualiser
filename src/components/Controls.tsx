import { PRESETS } from '../utils/mathUtils';
import styles from "../styles/controls.module.css"

interface ControlsProps {
  onStep: () => void;
  onAnimate: () => void;
  onReset: () => void;
  onSetConfig: (type: 'circle' | 'grid' | 'sphere' | 'cube') => void;
  onLoadPreset: (preset: keyof typeof PRESETS) => void;
  onTogglePlane: () => void;
  onToggleEigenvectors: () => void;
  iteration: number;
  animating: boolean;
  showEigenvectors: boolean;
}

export function Controls({onStep, onAnimate, onReset, onSetConfig, onLoadPreset, onTogglePlane, onToggleEigenvectors, iteration, animating, showEigenvectors}: ControlsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.group}>
        <h3>Iteration: {iteration}</h3>
        <button onClick={onStep}>Step</button>
        <button onClick={onAnimate}>
          {animating ? 'Stop' : 'Animate'}
        </button>
        <button onClick={onReset}>Reset</button>
      </div>

      <div className={styles.group}>
        <h3>Configuration</h3>
        <button onClick={() => onSetConfig('circle')}>Circle</button>
        <button onClick={() => onSetConfig('grid')}>Grid</button>
        <button onClick={() => onSetConfig('sphere')}>Sphere</button>
        <button onClick={() => onSetConfig('cube')}>Cube</button>
      </div>

      <div className={styles.group}>
        <h3>Presets</h3>
        <button onClick={() => onLoadPreset('scale')}>Scale</button>
        <button onClick={() => onLoadPreset('rotation')}>Rotation</button>
        <button onClick={() => onLoadPreset('shear')}>Shear</button>
        <button onClick={() => onLoadPreset('mixed')}>Mixed</button>
        <button onClick={() => onLoadPreset('identity')}>Identity</button>
      </div>

      <div className={styles.group}>
        <div className={styles.horizontal}>
        <button onClick={onTogglePlane}>Toggle 2D Plane</button>
        <button onClick={onToggleEigenvectors}>
          {showEigenvectors ? 'Hide' : 'Show'} Eigenvectors
        </button>
        </div>
      </div>
    </div>
  );
}
