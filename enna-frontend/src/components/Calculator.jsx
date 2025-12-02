import { useState } from 'react';
import './Calculator.css';

function Calculator({ isOpen, onToggle }) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const handleNumberClick = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const handleDecimalClick = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperationClick = (op) => {
    const currentValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = performCalculation();
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForNewValue(true);
    setOperation(op);
  };

  const performCalculation = () => {
    const current = parseFloat(display);
    const previous = previousValue;

    switch (operation) {
      case '+':
        return previous + current;
      case '-':
        return previous - current;
      case '×':
        return previous * current;
      case '÷':
        return current !== 0 ? previous / current : 0;
      default:
        return current;
    }
  };

  const handleEqualsClick = () => {
    if (operation && previousValue !== null) {
      const result = performCalculation();
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClearClick = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const handleClearEntryClick = () => {
    setDisplay('0');
  };

  const handleBackspaceClick = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handlePercentClick = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const handleSquareClick = () => {
    const value = parseFloat(display);
    setDisplay(String(value * value));
  };

  const handleSquareRootClick = () => {
    const value = parseFloat(display);
    setDisplay(String(Math.sqrt(value)));
  };

  const handleReciprocalClick = () => {
    const value = parseFloat(display);
    if (value !== 0) {
      setDisplay(String(1 / value));
    }
  };

  const handlePlusMinusClick = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  return (
    <div className={`calculator-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="calculator-content">
        {/* Calculator Header */}
        <div className="calculator-header">
          <div className="calculator-title">
            <img src="/Calculator.png" alt="Calculator" className="calculator-icon" />
            <span className="calculator-label">Calculator</span>
          </div>
          <button 
            className="calculator-close-btn"
            onClick={onToggle}
            title="Close calculator"
          >
            ×
          </button>
        </div>

        {/* Calculator Display */}
        <div className="calculator-display">
          <div className="display-operation">
            {previousValue !== null && `${previousValue} ${operation || ''}`}
          </div>
          <div className="display-value">{display}</div>
        </div>

        {/* Calculator Buttons - Windows 10 Layout */}
        <div className="calculator-buttons">
          {/* Row 1 - Functions */}
          <button className="calc-btn function-btn" onClick={handlePercentClick}>%</button>
          <button className="calc-btn function-btn" onClick={handleClearEntryClick}>CE</button>
          <button className="calc-btn function-btn" onClick={handleClearClick}>C</button>
          <button className="calc-btn function-btn" onClick={handleBackspaceClick}>⌫</button>

          {/* Row 2 - Advanced */}
          <button className="calc-btn function-btn" onClick={handleReciprocalClick}>¹⁄ₓ</button>
          <button className="calc-btn function-btn" onClick={handleSquareClick}>x²</button>
          <button className="calc-btn function-btn" onClick={handleSquareRootClick}>√</button>
          <button className="calc-btn operator-btn" onClick={() => handleOperationClick('÷')}>÷</button>

          {/* Row 3 */}
          <button className="calc-btn number-btn" onClick={() => handleNumberClick(7)}>7</button>
          <button className="calc-btn number-btn" onClick={() => handleNumberClick(8)}>8</button>
          <button className="calc-btn number-btn" onClick={() => handleNumberClick(9)}>9</button>
          <button className="calc-btn operator-btn" onClick={() => handleOperationClick('×')}>×</button>

          {/* Row 4 */}
          <button className="calc-btn number-btn" onClick={() => handleNumberClick(4)}>4</button>
          <button className="calc-btn number-btn" onClick={() => handleNumberClick(5)}>5</button>
          <button className="calc-btn number-btn" onClick={() => handleNumberClick(6)}>6</button>
          <button className="calc-btn operator-btn" onClick={() => handleOperationClick('-')}>−</button>

          {/* Row 5 */}
          <button className="calc-btn number-btn" onClick={() => handleNumberClick(1)}>1</button>
          <button className="calc-btn number-btn" onClick={() => handleNumberClick(2)}>2</button>
          <button className="calc-btn number-btn" onClick={() => handleNumberClick(3)}>3</button>
          <button className="calc-btn operator-btn" onClick={() => handleOperationClick('+')}>+</button>

          {/* Row 6 - Bottom */}
          <button className="calc-btn number-btn" onClick={handlePlusMinusClick}>±</button>
          <button className="calc-btn number-btn" onClick={() => handleNumberClick(0)}>0</button>
          <button className="calc-btn number-btn" onClick={handleDecimalClick}>.</button>
          <button className="calc-btn equals-btn" onClick={handleEqualsClick}>=</button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
