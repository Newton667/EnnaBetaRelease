from flask import Flask, jsonify, request
from flask_cors import CORS
from database import EnnaDatabase
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Initialize database
db = EnnaDatabase('enna.db')

@app.route('/')
def home():
    return jsonify({
        'message': 'Enna API is running!',
        'status': 'success'
    })

@app.route('/api/hello')
def hello():
    return jsonify({
        'message': 'Hello World from Python Backend!',
        'status': 'success'
    })

# ============= TRANSACTION ENDPOINTS =============

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    """Get all transactions"""
    try:
        type_filter = request.args.get('type')  # 'income' or 'expense'
        limit = int(request.args.get('limit', 100))
        
        transactions = db.get_transactions(limit=limit, type=type_filter)
        return jsonify({
            'status': 'success',
            'transactions': transactions,
            'count': len(transactions)
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    """Add a new transaction"""
    try:
        data = request.json
        
        # Validate required fields
        if not all(k in data for k in ['type', 'amount']):
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields: type, amount'
            }), 400
        
        transaction_id = db.add_transaction(
            type=data['type'],
            amount=float(data['amount']),
            description=data.get('description', ''),
            category_id=data.get('category_id'),
            date=data.get('date')
        )
        
        return jsonify({
            'status': 'success',
            'message': 'Transaction added successfully',
            'transaction_id': transaction_id
        }), 201
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/transactions/<int:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    """Delete a transaction"""
    try:
        success = db.delete_transaction(transaction_id)
        if success:
            return jsonify({
                'status': 'success',
                'message': 'Transaction deleted successfully'
            })
        else:
            return jsonify({
                'status': 'error',
                'message': 'Transaction not found'
            }), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ============= CATEGORY ENDPOINTS =============

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all categories"""
    try:
        categories = db.get_categories()
        return jsonify({
            'status': 'success',
            'categories': categories
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/categories', methods=['POST'])
def add_category():
    """Add a new category"""
    try:
        data = request.json
        
        if 'name' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Missing required field: name'
            }), 400
        
        category_id = db.add_category(
            name=data['name'],
            color=data.get('color', '#34d399'),
            icon=data.get('icon', '📦')
        )
        
        return jsonify({
            'status': 'success',
            'message': 'Category added successfully',
            'category_id': category_id
        }), 201
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ============= BUDGET ENDPOINTS =============

@app.route('/api/budgets', methods=['GET'])
def get_budgets():
    """Get all budget allocations"""
    try:
        budgets = db.get_budget_allocations()
        return jsonify({
            'status': 'success',
            'budgets': budgets
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/budgets', methods=['POST'])
def save_budget():
    """Save budget allocation for a category"""
    try:
        data = request.json
        
        if 'category_id' not in data or 'percentage' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields: category_id, percentage'
            }), 400
        
        budget_id = db.save_budget_allocation(
            category_id=int(data['category_id']),
            percentage=float(data['percentage'])
        )
        
        return jsonify({
            'status': 'success',
            'message': 'Budget saved successfully',
            'budget_id': budget_id
        }), 201
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/budgets/bulk', methods=['POST'])
def save_budgets_bulk():
    """Save multiple budget allocations at once"""
    try:
        data = request.json
        
        if 'budgets' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Missing required field: budgets'
            }), 400
        
        for budget in data['budgets']:
            db.save_budget_allocation(
                category_id=int(budget['category_id']),
                percentage=float(budget['percentage'])
            )
        
        return jsonify({
            'status': 'success',
            'message': f'Saved {len(data["budgets"])} budget allocations'
        }), 201
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/categories/<int:category_id>/spending', methods=['GET'])
def get_category_spending(category_id):
    """Get spending history for a category"""
    try:
        days = int(request.args.get('days', 30))
        spending = db.get_category_spending(category_id, days)
        return jsonify({
            'status': 'success',
            'spending': spending
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ============= SUMMARY ENDPOINTS =============

@app.route('/api/summary', methods=['GET'])
def get_summary():
    """Get financial summary"""
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        summary = db.get_summary(start_date, end_date)
        return jsonify({
            'status': 'success',
            'summary': summary
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/budget', methods=['GET'])
def get_budget():
    """Get budget overview (legacy endpoint - now uses summary)"""
    try:
        summary = db.get_summary()
        return jsonify({
            'total_income': summary['total_income'],
            'total_expenses': summary['total_expenses'],
            'remaining': summary['net']
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ============= STREAK ENDPOINTS =============

@app.route('/api/streaks', methods=['GET'])
def get_streaks():
    """Get current and longest streak data"""
    try:
        # Get optional date parameters from frontend (for dev override)
        login_date = request.args.get('login_date')  # Date to record login
        current_date = request.args.get('current_date')  # Date to calculate from
        
        streak_data = db.get_streak_data(login_date, current_date)
        return jsonify({
            'status': 'success',
            'streaks': streak_data
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/login-days', methods=['GET'])
def get_login_days():
    """Get all login days for calendar display"""
    try:
        login_days = db.get_login_days()
        return jsonify({
            'status': 'success',
            'login_days': login_days
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ============= HEALTH CHECK =============

@app.route('/api/health', methods=['GET'])
def health_check():
    """Check if database is working"""
    try:
        categories = db.get_categories()
        return jsonify({
            'status': 'success',
            'database': 'connected',
            'categories_count': len(categories)
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'database': 'disconnected',
            'message': str(e)
        }), 500

# ============= USER ENDPOINTS =============

@app.route('/api/user/name', methods=['GET'])
def get_user_name():
    """Get the user's name"""
    try:
        name = db.get_user_name()
        return jsonify({
            'status': 'success',
            'name': name
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/user/name', methods=['POST'])
def set_user_name():
    """Set the user's name"""
    try:
        data = request.json
        
        if 'name' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Missing required field: name'
            }), 400
        
        db.set_user_name(data['name'])
        
        return jsonify({
            'status': 'success',
            'message': 'Name updated successfully',
            'name': data['name']
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ============= ARCHIVE ENDPOINTS =============

@app.route('/api/archives', methods=['GET'])
def get_archives():
    """Get all monthly archives"""
    try:
        limit = int(request.args.get('limit', 12))
        archives = db.get_monthly_archives(limit)
        return jsonify({
            'status': 'success',
            'archives': archives
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/archives/<month_year>', methods=['GET'])
def get_archive(month_year):
    """Get specific month archive"""
    try:
        archive = db.get_archive_by_month(month_year)
        if archive:
            return jsonify({
                'status': 'success',
                'archive': archive
            })
        else:
            return jsonify({
                'status': 'error',
                'message': 'Archive not found'
            }), 404
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/archives', methods=['POST'])
def create_archive():
    """Create monthly archive"""
    try:
        data = request.json
        
        if 'month_year' not in data or 'summary_data' not in data or 'scores' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Missing required fields: month_year, summary_data, scores'
            }), 400
        
        # Get transactions JSON if provided
        transactions_json = data.get('transactions_json')
        
        archive_id = db.create_monthly_archive(
            month_year=data['month_year'],
            summary_data=data['summary_data'],
            scores=data['scores'],
            transactions_json=transactions_json
        )
        
        # Clear current month's transactions after archiving
        cleared_count = db.clear_current_month_transactions()
        
        return jsonify({
            'status': 'success',
            'message': 'Archive created successfully',
            'archive_id': archive_id,
            'transactions_cleared': cleared_count
        }), 201
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/archives/check-current', methods=['GET'])
def check_current_month_archived():
    """Check if current month has been archived"""
    try:
        is_archived = db.check_if_current_month_archived()
        return jsonify({
            'status': 'success',
            'is_archived': is_archived
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/archives/monthly-spending', methods=['GET'])
def get_monthly_spending_chart():
    """Get monthly spending data for charts"""
    try:
        months = int(request.args.get('months', 6))
        data = db.get_monthly_spending_chart_data(months)
        return jsonify({
            'status': 'success',
            'data': data
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/database/reset', methods=['POST'])
def reset_database():
    """Reset all data in the database"""
    try:
        db.reset_database()
        return jsonify({
            'status': 'success',
            'message': 'Database reset successfully'
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting Enna Backend...")
    print("📊 Database initialized")
    print("🌐 API running on http://localhost:5000")
    app.run(debug=True, port=5000)
