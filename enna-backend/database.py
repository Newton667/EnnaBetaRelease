import sqlite3
from datetime import datetime
import hashlib
import os

class EnnaDatabase:
    def __init__(self, db_path='enna.db', password=None):
        self.db_path = db_path
        self.password = password
        self.connection = None
        self.init_database()
    
    def get_connection(self):
        """Get database connection"""
        if self.connection is None:
            self.connection = sqlite3.connect(self.db_path, check_same_thread=False)
            self.connection.row_factory = sqlite3.Row  # Return rows as dictionaries
        return self.connection
    
    def init_database(self):
        """Initialize database with tables"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Users table (for future multi-user support)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Budget categories table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                color TEXT DEFAULT '#34d399',
                icon TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Transactions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category_id INTEGER,
                type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
                amount REAL NOT NULL,
                description TEXT,
                date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories (id)
            )
        ''')
        
        # Budget goals table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS budget_goals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category_id INTEGER,
                monthly_limit REAL NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE,
                FOREIGN KEY (category_id) REFERENCES categories (id)
            )
        ''')
        
        # Budget allocations table (for percentage-based budgeting)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS budget_allocations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category_id INTEGER UNIQUE,
                percentage REAL NOT NULL DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories (id)
            )
        ''')
        
        # Insert default categories if none exist
        cursor.execute('SELECT COUNT(*) FROM categories')
        if cursor.fetchone()[0] == 0:
            default_categories = [
                ('Food & Dining', '#34d399', '🍔'),
                ('Transportation', '#3b82f6', '🚗'),
                ('Entertainment', '#ec4899', '🎮'),
                ('Bills & Utilities', '#f59e0b', '💡'),
                ('Shopping', '#8b5cf6', '🛍️'),
                ('Healthcare', '#ef4444', '🏥'),
                ('Income', '#10b981', '💰'),
                ('Other', '#6b7280', '📦')
            ]
            cursor.executemany(
                'INSERT INTO categories (name, color, icon) VALUES (?, ?, ?)',
                default_categories
            )
        
        conn.commit()
        print("✅ Database initialized successfully!")
    
    # ============= TRANSACTION METHODS =============
    
    def add_transaction(self, type, amount, description, category_id=None, date=None):
        """Add a new transaction"""
        if date is None:
            date = datetime.now().strftime('%Y-%m-%d')
        
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO transactions (type, amount, description, category_id, date)
            VALUES (?, ?, ?, ?, ?)
        ''', (type, amount, description, category_id, date))
        
        conn.commit()
        return cursor.lastrowid
    
    def get_transactions(self, limit=100, type=None):
        """Get transactions with optional filtering"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        query = '''
            SELECT t.*, c.name as category_name, c.color, c.icon
            FROM transactions t
            LEFT JOIN categories c ON t.category_id = c.id
        '''
        
        if type:
            query += ' WHERE t.type = ?'
            cursor.execute(query + ' ORDER BY t.date DESC LIMIT ?', (type, limit))
        else:
            cursor.execute(query + ' ORDER BY t.date DESC LIMIT ?', (limit,))
        
        return [dict(row) for row in cursor.fetchall()]
    
    def delete_transaction(self, transaction_id):
        """Delete a transaction"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM transactions WHERE id = ?', (transaction_id,))
        conn.commit()
        return cursor.rowcount > 0
    
    # ============= CATEGORY METHODS =============
    
    def get_categories(self):
        """Get all categories"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM categories ORDER BY name')
        return [dict(row) for row in cursor.fetchall()]
    
    def add_category(self, name, color='#34d399', icon='📦'):
        """Add a new category"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO categories (name, color, icon) VALUES (?, ?, ?)',
            (name, color, icon)
        )
        conn.commit()
        return cursor.lastrowid
    
    # ============= BUDGET METHODS =============
    
    def save_budget_allocation(self, category_id, percentage):
        """Save or update budget allocation for a category"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Check if allocation exists
        cursor.execute('SELECT id FROM budget_allocations WHERE category_id = ?', (category_id,))
        exists = cursor.fetchone()
        
        if exists:
            # Update existing
            cursor.execute('''
                UPDATE budget_allocations 
                SET percentage = ?, updated_at = CURRENT_TIMESTAMP
                WHERE category_id = ?
            ''', (percentage, category_id))
        else:
            # Insert new
            cursor.execute('''
                INSERT INTO budget_allocations (category_id, percentage)
                VALUES (?, ?)
            ''', (category_id, percentage))
        
        conn.commit()
        return cursor.lastrowid
    
    def get_budget_allocations(self):
        """Get all budget allocations"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT ba.*, c.name, c.color, c.icon
            FROM budget_allocations ba
            JOIN categories c ON ba.category_id = c.id
            ORDER BY c.name
        ''')
        return [dict(row) for row in cursor.fetchall()]
    
    def get_category_spending(self, category_id, days=30):
        """Get daily spending for a category over the last N days"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT date, SUM(amount) as daily_total
            FROM transactions
            WHERE category_id = ? AND type = 'expense'
            AND date >= date('now', '-' || ? || ' days')
            GROUP BY date
            ORDER BY date ASC
        ''', (category_id, days))
        
        return [dict(row) for row in cursor.fetchall()]
    
    # ============= SUMMARY METHODS =============
    
    def get_summary(self, start_date=None, end_date=None):
        """Get financial summary"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        date_filter = ''
        params = []
        
        if start_date and end_date:
            date_filter = ' WHERE date BETWEEN ? AND ?'
            params = [start_date, end_date]
        elif start_date:
            date_filter = ' WHERE date >= ?'
            params = [start_date]
        
        # Total income
        cursor.execute(
            f"SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'income'{date_filter}",
            params
        )
        total_income = cursor.fetchone()[0]
        
        # Total expenses
        cursor.execute(
            f"SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'expense'{date_filter}",
            params
        )
        total_expenses = cursor.fetchone()[0]
        
        # Expenses by category
        cursor.execute(f'''
            SELECT c.name, c.color, c.icon, COALESCE(SUM(t.amount), 0) as total
            FROM categories c
            LEFT JOIN transactions t ON c.id = t.category_id AND t.type = 'expense'{date_filter}
            GROUP BY c.id, c.name, c.color, c.icon
            HAVING total > 0
            ORDER BY total DESC
        ''', params)
        
        expenses_by_category = [dict(row) for row in cursor.fetchall()]
        
        return {
            'total_income': total_income,
            'total_expenses': total_expenses,
            'net': total_income - total_expenses,
            'expenses_by_category': expenses_by_category
        }
    
    def close(self):
        """Close database connection"""
        if self.connection:
            self.connection.close()
            self.connection = None

# Helper function to hash passwords
def hash_password(password):
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()
