import { useMemo } from 'react';
import { computeEigenInfo, getColorName } from '../utils/eigenUtils';
import styles from "../styles/infopanel.module.css"

interface PointLogEntry {
  iteration: number;
  position: number[];
}

interface InfoPanelProps {
  taggedPointIndex: number | null;
  pointLog: PointLogEntry[];
  matrix: number[][];
}

export function InfoPanel({ taggedPointIndex, pointLog, matrix }: InfoPanelProps) {
  // Calculate determinant (simple 3x3)
  const det = 
    matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
    matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
    matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);

  // Compute eigenvalues and eigenvectors
  const eigenData = useMemo(() => computeEigenInfo(matrix), [matrix]);

  return (
    <div className={styles.infoPanel}>
      <div className={styles.infoSection}>
        <h3>Matrix Info</h3>
        <p><strong>det(A) = {det.toFixed(3)}</strong></p>
        
        {eigenData.length > 0 && (
          <div className={styles.eigenDataContainer}>
            <strong>Eigenvalues & Eigenvectors:</strong>
            {eigenData.map((eigen, i) => (
              <div key={i} className={styles.eigenData}>
                <div>
                  <strong>
                    λ{i+1} = {eigen.eigenvalue.toFixed(3)}
                    {eigen.isComplex && eigen.imaginaryPart && ` ± ${eigen.imaginaryPart.toFixed(3)}i`}
                  </strong>
                </div>
                <div style={{ color: `#${eigen.color.toString(16).padStart(6, '0')}`, fontSize: '11px' }}>
                  {getColorName(eigen.color)}
                </div>
                {!eigen.isComplex && (
                  <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                    v{i+1} = ({eigen.eigenvector[0].toFixed(3)}, {eigen.eigenvector[1].toFixed(3)}, {eigen.eigenvector[2].toFixed(3)})
                  </div>
                )}
                {eigen.isComplex && (
                  <div style={{ fontSize: '10px', opacity: 0.7, fontStyle: 'italic' }}>
                    Not visualized (complex)
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {eigenData.length === 0 && (
          <p style={{ fontSize: '11px', marginTop: '8px', opacity: 0.7 }}>
            <em>No real eigenvalues (may have complex eigenvalues)</em>
          </p>
        )}
      </div>

      <div className={styles.infoSection}>
        <h3>Point Tracking</h3>
        {taggedPointIndex === null ? (
          <p><em>Click a point to track it</em></p>
        ) : (
          <div>
            <p><strong>Point #{taggedPointIndex}</strong></p>
            <div className={styles.pointLog}>
              {pointLog.map((entry, i) => (
                <div key={i} className={styles.logEntry}>
                  <strong>n={entry.iteration}:</strong>{' '}
                  ({entry.position[0].toFixed(3)}, {entry.position[1].toFixed(3)}, {entry.position[2].toFixed(3)})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
