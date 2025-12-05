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
    
    def _get_current_date(self):
        """Get current date, respecting frontend override if present"""
        # This would need to be passed from frontend, or we check a shared config
        # For now, return system date - frontend will need to pass override date
        return datetime.now().strftime('%Y-%m-%d')
    
    def _get_current_datetime(self):
        """Get current datetime"""
        return datetime.now()
    
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
        
        # Streak tracking table with user name
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_name TEXT DEFAULT 'Friend',
                longest_streak INTEGER DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Login tracking table for streaks
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS login_days (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                login_date DATE NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Monthly archives table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS monthly_archives (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                month_year TEXT NOT NULL UNIQUE,
                total_income REAL DEFAULT 0,
                total_expenses REAL DEFAULT 0,
                net REAL DEFAULT 0,
                financial_health_score INTEGER DEFAULT 0,
                savings_score INTEGER DEFAULT 0,
                budget_score INTEGER DEFAULT 0,
                consistency_score INTEGER DEFAULT 0,
                balance_score INTEGER DEFAULT 0,
                transaction_count INTEGER DEFAULT 0,
                transactions_json TEXT,
                archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Initialize user_stats if empty
        cursor.execute('SELECT COUNT(*) FROM user_stats')
        if cursor.fetchone()[0] == 0:
            cursor.execute('INSERT INTO user_stats (user_name, longest_streak) VALUES (?, ?)', ('Friend', 0))
        
        # Add user_name column if it doesn't exist (for existing databases)
        cursor.execute("PRAGMA table_info(user_stats)")
        columns = [column[1] for column in cursor.fetchall()]
        if 'user_name' not in columns:
            cursor.execute('ALTER TABLE user_stats ADD COLUMN user_name TEXT DEFAULT "Friend"')
        
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
                ('Debt', '#ef4444', '💳'),
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
            SELECT c.id, c.name, c.color, c.icon, COALESCE(SUM(t.amount), 0) as total
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
    
    # ============= STREAK METHODS =============
    
    def record_login(self, login_date=None):
        """Record that user logged in today (for streak tracking)"""
        from datetime import datetime
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Use provided date or current date
        if login_date is None:
            login_date = datetime.now().strftime('%Y-%m-%d')
        
        # Insert today's login (ignore if already exists)
        cursor.execute('''
            INSERT OR IGNORE INTO login_days (login_date)
            VALUES (?)
        ''', (login_date,))
        
        conn.commit()
        return True
    
    def get_current_streak(self, current_date=None):
        """Calculate current streak of consecutive login days"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Get all unique login dates, ordered by date descending
        cursor.execute('''
            SELECT DISTINCT date(login_date) as login_date
            FROM login_days
            ORDER BY date(login_date) DESC
        ''')
        
        dates = [row[0] for row in cursor.fetchall()]
        
        if not dates:
            return 0
        
        # Get today's date (or override date)
        from datetime import datetime, timedelta
        if current_date:
            today = datetime.strptime(current_date, '%Y-%m-%d').date()
        else:
            today = datetime.now().date()
        
        # Convert string dates to date objects
        date_objects = [datetime.strptime(d, '%Y-%m-%d').date() for d in dates]
        
        # Check if streak is still active
        # Streak is active if user logged in today OR yesterday
        most_recent = date_objects[0]
        days_since_last = (today - most_recent).days
        
        if days_since_last > 1:
            # Streak is broken - no login yesterday or today
            return 0
        
        # Count consecutive days
        streak = 0
        expected_date = most_recent
        
        for login_date in date_objects:
            if login_date == expected_date:
                streak += 1
                expected_date = login_date - timedelta(days=1)
            elif login_date == expected_date + timedelta(days=1):
                # Skip if we're counting backwards and find today again
                continue
            else:
                # Gap found, streak ends
                break
        
        return streak
    
    def get_longest_streak(self):
        """Get the longest streak ever achieved"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT longest_streak FROM user_stats WHERE id = 1')
        result = cursor.fetchone()
        return result[0] if result else 0
    
    def update_longest_streak(self, streak):
        """Update longest streak if current streak is higher"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        current_longest = self.get_longest_streak()
        if streak > current_longest:
            cursor.execute('''
                UPDATE user_stats 
                SET longest_streak = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = 1
            ''', (streak,))
            conn.commit()
            return True
        return False
    
    def get_streak_data(self, login_date=None, current_date=None):
        """Get comprehensive streak data and record today's login"""
        # Record today's login automatically
        self.record_login(login_date)
        
        current_streak = self.get_current_streak(current_date)
        longest_streak = self.get_longest_streak()
        
        # Update longest streak if current is higher
        self.update_longest_streak(current_streak)
        longest_streak = max(longest_streak, current_streak)
        
        return {
            'current_streak': current_streak,
            'longest_streak': longest_streak
        }
    
    def get_login_days(self):
        """Get all login days for calendar display"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT login_date FROM login_days ORDER BY login_date DESC')
        return [row[0] for row in cursor.fetchall()]
    
    # ============= USER METHODS =============
    
    def get_user_name(self):
        """Get the user's name"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT user_name FROM user_stats WHERE id = 1')
        result = cursor.fetchone()
        return result[0] if result else 'Friend'
    
    def set_user_name(self, name):
        """Set the user's name"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE user_stats 
            SET user_name = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = 1
        ''', (name,))
        conn.commit()
        return True
    
    def reset_database(self):
        """Reset all data in the database (DANGER!)"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Delete all transactions
        cursor.execute('DELETE FROM transactions')
        
        # Delete all budget allocations
        cursor.execute('DELETE FROM budget_allocations')
        
        # Delete all login days (streak data)
        cursor.execute('DELETE FROM login_days')
        
        # Delete all monthly archives
        cursor.execute('DELETE FROM monthly_archives')
        
        # Reset user stats (keep structure, reset data)
        cursor.execute('''
            UPDATE user_stats 
            SET user_name = 'Friend', longest_streak = 0, updated_at = CURRENT_TIMESTAMP
            WHERE id = 1
        ''')
        
        conn.commit()
        return True
    
    # ============= MONTHLY ARCHIVE METHODS =============
    
    def create_monthly_archive(self, month_year, summary_data, scores, transactions_json=None):
        """Create a monthly archive snapshot
        
        Args:
            month_year: String in format 'YYYY-MM' (e.g. '2024-11')
            summary_data: Dict with {total_income, total_expenses, net, transaction_count}
            scores: Dict with {overall, savings, budget, consistency, balance}
            transactions_json: JSON string of transactions list (optional)
        """
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO monthly_archives 
            (month_year, total_income, total_expenses, net, financial_health_score,
             savings_score, budget_score, consistency_score, balance_score, transaction_count, transactions_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            month_year,
            summary_data.get('total_income', 0),
            summary_data.get('total_expenses', 0),
            summary_data.get('net', 0),
            scores.get('overall', 0),
            scores.get('savings', 0),
            scores.get('budget', 0),
            scores.get('consistency', 0),
            scores.get('balance', 0),
            summary_data.get('transaction_count', 0),
            transactions_json
        ))
        
        conn.commit()
        return cursor.lastrowid
    
    def get_monthly_archives(self, limit=12):
        """Get monthly archives sorted by date (most recent first)"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM monthly_archives 
            ORDER BY month_year DESC 
            LIMIT ?
        ''', (limit,))
        
        archives = []
        for row in cursor.fetchall():
            archives.append(dict(row))
        
        return archives
    
    def get_archive_by_month(self, month_year):
        """Get specific month archive"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM monthly_archives 
            WHERE month_year = ?
        ''', (month_year,))
        
        row = cursor.fetchone()
        return dict(row) if row else None
    
    def check_if_current_month_archived(self):
        """Check if current month has been archived"""
        current_month = datetime.now().strftime('%Y-%m')
        return self.get_archive_by_month(current_month) is not None
    
    def get_monthly_spending_chart_data(self, months=6):
        """Get monthly spending data for chart (last N months)"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT month_year, total_income, total_expenses, net
            FROM monthly_archives 
            ORDER BY month_year DESC 
            LIMIT ?
        ''', (months,))
        
        data = []
        for row in cursor.fetchall():
            data.append(dict(row))
        
        # Reverse to show oldest to newest
        return list(reversed(data))
    
    def clear_current_month_transactions(self):
        """Clear all transactions from the current month (used after archiving)"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Get current month start date
        now = datetime.now()
        month_start = f"{now.year}-{now.month:02d}-01"
        
        # Delete all transactions from current month
        cursor.execute('''
            DELETE FROM transactions 
            WHERE date >= ?
        ''', (month_start,))
        
        deleted_count = cursor.rowcount
        conn.commit()
        return deleted_count
    
    def close(self):
        """Close database connection"""
        if self.connection:
            self.connection.close()
            self.connection = None

# Helper function to hash passwords
def hash_password(password):
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()
