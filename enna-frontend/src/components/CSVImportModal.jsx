import { useState } from 'react';
import './CSVImportModal.css';

function CSVImportModal({ isOpen, onClose, onImport, categories }) {
  const [step, setStep] = useState(1); // 1: Upload, 2: Map columns, 3: Preview & Edit
  const [csvData, setCSVData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [columnMapping, setColumnMapping] = useState({
    date: '',
    description: '',
    amount: '',
    type: '' // optional
  });
  const [transactions, setTransactions] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);

  // Category keywords for auto-detection
  const categoryKeywords = {
    'Food & Dining': ['restaurant', 'food', 'grocery', 'cafe', 'coffee', 'dining', 'lunch', 'dinner', 'breakfast', 'mcdonalds', 'burger', 'pizza', 'starbucks', 'supermarket', 'market'],
    'Transportation': ['gas', 'fuel', 'uber', 'lyft', 'taxi', 'parking', 'transit', 'bus', 'train', 'metro', 'subway', 'car', 'vehicle'],
    'Shopping': ['amazon', 'target', 'walmart', 'shop', 'store', 'retail', 'purchase', 'clothing', 'shoes', 'electronics'],
    'Entertainment': ['movie', 'theater', 'cinema', 'netflix', 'spotify', 'game', 'concert', 'ticket', 'entertainment', 'hulu', 'disney'],
    'Bills & Utilities': ['electric', 'water', 'gas bill', 'internet', 'phone', 'utility', 'bill', 'insurance', 'rent', 'mortgage'],
    'Healthcare': ['doctor', 'hospital', 'pharmacy', 'medical', 'health', 'clinic', 'dental', 'cvs', 'walgreens', 'medicine'],
    'Income': ['salary', 'paycheck', 'wage', 'income', 'deposit', 'payment received', 'refund'],
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      alert('CSV file must have at least a header row and one data row');
      return;
    }

    // Find the header row (skip summary lines)
    let headerIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('date') && (line.includes('description') || line.includes('amount'))) {
        headerIndex = i;
        break;
      }
    }

    // Parse CSV properly handling quoted fields
    const parseCSVLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseCSVLine(lines[headerIndex]).map(h => h.replace(/['"]/g, '').trim());
    const data = lines.slice(headerIndex + 1).map(line => {
      const values = parseCSVLine(line);
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] ? values[index].replace(/['"]/g, '').trim() : '';
      });
      return row;
    }).filter(row => {
      // Filter out summary rows and empty rows
      const dateValue = Object.values(row)[0] || '';
      return dateValue && !dateValue.toLowerCase().includes('balance') && !dateValue.toLowerCase().includes('total');
    });

    if (data.length === 0) {
      alert('No valid transaction rows found in CSV');
      return;
    }

    setHeaders(headers);
    setCSVData(data);
    setStep(2);

    // Try to auto-detect columns
    autoDetectColumns(headers);
  };

  const autoDetectColumns = (headers) => {
    const mapping = {
      date: '',
      description: '',
      amount: '',
      type: ''
    };

    // Score each header for each field type
    const scores = headers.map(header => {
      const lower = header.toLowerCase().trim();
      return {
        header,
        dateScore: 0,
        descriptionScore: 0,
        amountScore: 0,
        typeScore: 0
      };
    });

    // Calculate scores for each field type
    scores.forEach(score => {
      const lower = score.header.toLowerCase().trim();
      
      // Date scoring (higher = better match)
      if (lower === 'date') score.dateScore = 100;
      else if (lower === 'trans date' || lower === 'transaction date') score.dateScore = 95;
      else if (lower === 'post date' || lower === 'posting date' || lower === 'posted date') score.dateScore = 90;
      else if (lower.includes('date')) score.dateScore = 70;
      else if (lower === 'time' || lower === 'timestamp') score.dateScore = 50;
      
      // Description scoring
      if (lower === 'description') score.descriptionScore = 100;
      else if (lower === 'memo' || lower === 'details') score.descriptionScore = 95;
      else if (lower === 'merchant' || lower === 'payee') score.descriptionScore = 90;
      else if (lower === 'name' || lower === 'transaction') score.descriptionScore = 85;
      else if (lower.includes('description') || lower.includes('merchant')) score.descriptionScore = 80;
      else if (lower.includes('memo') || lower.includes('detail')) score.descriptionScore = 75;
      else if (lower.includes('name') && !lower.includes('file') && !lower.includes('user')) score.descriptionScore = 70;
      
      // Amount scoring
      if (lower === 'amount') score.amountScore = 100;
      else if (lower === 'total' || lower === 'sum') score.amountScore = 95;
      else if (lower === 'value' || lower === 'price') score.amountScore = 90;
      else if (lower === 'debit' || lower === 'withdrawal') score.amountScore = 85;
      else if (lower === 'credit' || lower === 'deposit') score.amountScore = 85;
      else if (lower.includes('amount')) score.amountScore = 80;
      else if (lower.includes('total')) score.amountScore = 75;
      else if (lower.includes('balance') && !lower.includes('running')) score.amountScore = 60;
      
      // Type scoring
      if (lower === 'type') score.typeScore = 100;
      else if (lower === 'transaction type' || lower === 'trans type') score.typeScore = 95;
      else if (lower === 'category' && score.descriptionScore < 50) score.typeScore = 70;
      else if (lower.includes('type')) score.typeScore = 80;
    });

    // Select best match for each field
    const findBestMatch = (scoreField) => {
      const sorted = [...scores].sort((a, b) => b[scoreField] - a[scoreField]);
      return sorted[0][scoreField] > 40 ? sorted[0].header : '';
    };

    mapping.date = findBestMatch('dateScore');
    mapping.description = findBestMatch('descriptionScore');
    mapping.amount = findBestMatch('amountScore');
    mapping.type = findBestMatch('typeScore');

    setColumnMapping(mapping);
  };

  const detectTransactionType = (row, amountValue) => {
    // Check if there's a type column
    if (columnMapping.type && row[columnMapping.type]) {
      const typeStr = row[columnMapping.type].toLowerCase();
      if (typeStr.includes('credit') || typeStr.includes('deposit') || typeStr.includes('income')) {
        return 'income';
      }
      if (typeStr.includes('debit') || typeStr.includes('withdrawal') || typeStr.includes('payment')) {
        return 'expense';
      }
    }

    // Check amount sign
    if (amountValue > 0) return 'income';
    if (amountValue < 0) return 'expense';

    // Default based on description keywords
    const description = row[columnMapping.description]?.toLowerCase() || '';
    if (categoryKeywords['Income'].some(keyword => description.includes(keyword))) {
      return 'income';
    }

    return 'expense'; // Default to expense
  };

  const detectCategory = (description) => {
    const lower = description.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lower.includes(keyword))) {
        // Find matching category from actual categories
        const matchingCategory = categories.find(cat => 
          cat.name === category || cat.name.toLowerCase().includes(category.toLowerCase())
        );
        return matchingCategory?.id || null;
      }
    }

    // If no match, try to find "Other" or "Miscellaneous"
    const otherCategory = categories.find(cat => 
      cat.name.toLowerCase().includes('other') || cat.name.toLowerCase().includes('misc')
    );
    return otherCategory?.id || categories[0]?.id || null;
  };

  const handleMapColumns = () => {
    if (!columnMapping.date || !columnMapping.description || !columnMapping.amount) {
      alert('Please map at least Date, Description, and Amount columns');
      return;
    }

    const parsedTransactions = csvData.map((row, index) => {
      const amountStr = row[columnMapping.amount].replace(/[$,]/g, '');
      const amountValue = parseFloat(amountStr);
      const absoluteAmount = Math.abs(amountValue);
      
      const type = detectTransactionType(row, amountValue);
      const description = row[columnMapping.description];

      return {
        id: `temp-${index}`,
        date: row[columnMapping.date],
        description: description,
        amount: absoluteAmount,
        type: type,
        category_id: detectCategory(description),
        selected: true,
        edited: false
      };
    });

    setTransactions(parsedTransactions);
    setStep(3);
  };

  const handleTransactionEdit = (id, field, value) => {
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, [field]: value, edited: true } : t
    ));
  };

  const handleToggleSelect = (id) => {
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, selected: !t.selected } : t
    ));
  };

  const handleSelectAll = () => {
    const allSelected = transactions.every(t => t.selected);
    setTransactions(prev => prev.map(t => ({ ...t, selected: !allSelected })));
  };

  const handleImport = () => {
    const selectedTransactions = transactions
      .filter(t => t.selected)
      .map(({ id, selected, edited, ...rest }) => rest);

    onImport(selectedTransactions);
    handleReset();
  };

  const handleReset = () => {
    setStep(1);
    setCSVData([]);
    setHeaders([]);
    setColumnMapping({ date: '', description: '', amount: '', type: '' });
    setTransactions([]);
    setShowInstructions(false);
    onClose();
  };

  if (!isOpen) return null;

  const selectedCount = transactions.filter(t => t.selected).length;

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && handleReset()}>
      <div className="csv-modal-content">
        {/* Header */}
        <div className="csv-modal-header">
          <h2>📊 Import Transactions from CSV</h2>
          <button className="modal-close" onClick={handleReset}>×</button>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Upload</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Map Columns</div>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Review & Import</div>
          </div>
        </div>

        <div className="csv-modal-body">
          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="upload-section">
              <div className="upload-area">
                <div className="upload-icon">📁</div>
                <h3>Upload Your Bank Statement CSV</h3>
                <p>Select a CSV file exported from your bank or financial institution</p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  id="csv-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="csv-upload" className="upload-btn">
                  Choose CSV File
                </label>
              </div>

              <div className="instructions-toggle">
                <button 
                  className="toggle-instructions-btn"
                  onClick={() => setShowInstructions(!showInstructions)}
                >
                  {showInstructions ? '▼' : '▶'} How to Download Your CSV
                </button>
              </div>

              {showInstructions && (
                <div className="instructions-content">
                  <h4>📋 How to Get Your Transaction CSV</h4>
                  
                  <div className="instruction-section">
                    <h5>Option 1: Download from Your Bank</h5>
                    <ol>
                      <li>Log in to your bank's website or mobile app</li>
                      <li>Navigate to your account transactions/history</li>
                      <li>Look for "Export" or "Download" button</li>
                      <li>Select CSV or Excel format</li>
                      <li>Choose your date range</li>
                      <li>Download the file</li>
                    </ol>
                  </div>

                  <div className="instruction-section">
                    <h5>Option 2: Create Your Own in Excel</h5>
                    <ol>
                      <li>Open Microsoft Excel or Google Sheets</li>
                      <li>Create columns: Date, Description, Amount</li>
                      <li>Fill in your transactions (one per row)</li>
                      <li>Save/Export as CSV file</li>
                    </ol>
                    <div className="example-table">
                      <strong>Example:</strong>
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>2024-12-01</td>
                            <td>Grocery Store</td>
                            <td>-45.67</td>
                          </tr>
                          <tr>
                            <td>2024-12-02</td>
                            <td>Salary Deposit</td>
                            <td>3000.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="tips-section">
                    <h5>💡 Tips</h5>
                    <ul>
                      <li>CSV files should have headers in the first row</li>
                      <li>Negative amounts = expenses, Positive = income</li>
                      <li>Date formats: YYYY-MM-DD, MM/DD/YYYY, or DD/MM/YYYY</li>
                      <li>Enna will automatically detect categories for you! 🎯</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Map Columns */}
          {step === 2 && (
            <div className="mapping-section">
              <h3>Map Your CSV Columns</h3>
              <p className="mapping-subtitle">
                Match your CSV columns to the required fields. We've tried to auto-detect them!
              </p>

              <div className="mapping-grid">
                <div className="mapping-row">
                  <label>
                    <span className="required">*</span> Date Column:
                  </label>
                  <select 
                    value={columnMapping.date}
                    onChange={(e) => setColumnMapping({...columnMapping, date: e.target.value})}
                  >
                    <option value="">-- Select Column --</option>
                    {headers.map(header => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>

                <div className="mapping-row">
                  <label>
                    <span className="required">*</span> Description Column:
                  </label>
                  <select 
                    value={columnMapping.description}
                    onChange={(e) => setColumnMapping({...columnMapping, description: e.target.value})}
                  >
                    <option value="">-- Select Column --</option>
                    {headers.map(header => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>

                <div className="mapping-row">
                  <label>
                    <span className="required">*</span> Amount Column:
                  </label>
                  <select 
                    value={columnMapping.amount}
                    onChange={(e) => setColumnMapping({...columnMapping, amount: e.target.value})}
                  >
                    <option value="">-- Select Column --</option>
                    {headers.map(header => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>

                <div className="mapping-row">
                  <label>Type Column (Optional):</label>
                  <select 
                    value={columnMapping.type}
                    onChange={(e) => setColumnMapping({...columnMapping, type: e.target.value})}
                  >
                    <option value="">-- None (Auto-detect) --</option>
                    {headers.map(header => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="preview-box">
                <h4>Preview First Row:</h4>
                {csvData[0] && (
                  <div className="preview-data">
                    {columnMapping.date && (
                      <div><strong>Date:</strong> {csvData[0][columnMapping.date]}</div>
                    )}
                    {columnMapping.description && (
                      <div><strong>Description:</strong> {csvData[0][columnMapping.description]}</div>
                    )}
                    {columnMapping.amount && (
                      <div><strong>Amount:</strong> {csvData[0][columnMapping.amount]}</div>
                    )}
                  </div>
                )}
              </div>

              <div className="mapping-actions">
                <button className="btn-back" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button className="btn-next" onClick={handleMapColumns}>
                  Next: Preview Transactions →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Preview & Edit */}
          {step === 3 && (
            <div className="preview-section">
              <div className="preview-header">
                <h3>Review & Edit Transactions</h3>
                <div className="preview-actions">
                  <button className="select-all-btn" onClick={handleSelectAll}>
                    {transactions.every(t => t.selected) ? '☑ Deselect All' : '☐ Select All'}
                  </button>
                  <span className="selected-count">
                    {selectedCount} of {transactions.length} selected
                  </span>
                </div>
              </div>

              <div className="preview-list">
                {transactions.map(transaction => (
                  <div key={transaction.id} className={`preview-transaction ${transaction.type}`}>
                    <input
                      type="checkbox"
                      checked={transaction.selected}
                      onChange={() => handleToggleSelect(transaction.id)}
                      className="transaction-checkbox"
                    />
                    
                    <div className="preview-transaction-details">
                      <div className="preview-row">
                        <input
                          type="date"
                          value={transaction.date}
                          onChange={(e) => handleTransactionEdit(transaction.id, 'date', e.target.value)}
                          className="edit-date"
                        />
                        
                        <input
                          type="text"
                          value={transaction.description}
                          onChange={(e) => handleTransactionEdit(transaction.id, 'description', e.target.value)}
                          className="edit-description"
                        />
                      </div>

                      <div className="preview-row">
                        <select
                          value={transaction.type}
                          onChange={(e) => handleTransactionEdit(transaction.id, 'type', e.target.value)}
                          className="edit-type"
                        >
                          <option value="income">💰 Income</option>
                          <option value="expense">💸 Expense</option>
                        </select>

                        <select
                          value={transaction.category_id || ''}
                          onChange={(e) => handleTransactionEdit(transaction.id, 'category_id', e.target.value ? parseInt(e.target.value) : null)}
                          className="edit-category"
                        >
                          <option value="">-- No Category --</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>

                        <input
                          type="number"
                          step="0.01"
                          value={transaction.amount}
                          onChange={(e) => handleTransactionEdit(transaction.id, 'amount', parseFloat(e.target.value))}
                          className="edit-amount"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="preview-actions-bottom">
                <button className="btn-back" onClick={() => setStep(2)}>
                  ← Back to Mapping
                </button>
                <button 
                  className="btn-import" 
                  onClick={handleImport}
                  disabled={selectedCount === 0}
                >
                  Import {selectedCount} Transaction{selectedCount !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CSVImportModal;
