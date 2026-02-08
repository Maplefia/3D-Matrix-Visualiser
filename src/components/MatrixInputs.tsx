import { useState, useEffect } from 'react';
import styles from '../styles/matrix.module.css'

interface MatrixInputsProps {
  matrix: number[][];
  onMatrixChange: (newMatrix: number[][]) => void;
  onReset: () => void;
}

export function MatrixInputs({ matrix, onMatrixChange, onReset }: MatrixInputsProps) {
  const [inputValues, setInputValues] = useState<string[][]>(
    matrix.map(row => row.map(val => val.toString()))
  );

  useEffect(() => {
    setInputValues(matrix.map(row => row.map(val => val.toString())));
  }, [matrix]);

  const handleInputChange = (i: number, j: number, value: string) => {
    const newInputValues = inputValues.map(row => [...row]);
    newInputValues[i][j] = value;
    setInputValues(newInputValues);
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) || value === '' || value === '-') {
      const newMatrix = matrix.map(row => [...row]);
      newMatrix[i][j] = isNaN(numValue) ? 0 : numValue;
      onMatrixChange(newMatrix);
      onReset();
    }
  };

  const handleBlur = (i: number, j: number) => {
    const newInputValues = inputValues.map(row => [...row]);
    newInputValues[i][j] = matrix[i][j].toString();
    setInputValues(newInputValues);
  };

  return (
    <div className={styles.container}>
      <div className={styles.bracket}>[</div>
      <div className={styles.inputs}>
        {matrix.map((row, i) => (
          <div key={i} className={styles.row}>
            {row.map((val, j) => (
              <input
                key={j}
                type="number"
                step="0.1"
                className={styles.input}
                value={inputValues[i]?.[j] ?? val}
                id={`m${i}${j}`}
                onChange={(e) => handleInputChange(i, j, e.target.value)}
                onBlur={() => handleBlur(i, j)}
              />
            ))}
          </div>
        ))}
      </div>
      <div className={styles.bracket}>]</div>
    </div>
  );
}
