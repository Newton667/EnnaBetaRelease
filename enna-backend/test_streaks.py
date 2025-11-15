#!/usr/bin/env python3
"""
Test script to demonstrate streak functionality
"""
from database import EnnaDatabase
from datetime import datetime, timedelta

# Create a fresh test database
db = EnnaDatabase('test_streaks.db')

print("=" * 60)
print("TESTING STREAK FUNCTIONALITY")
print("=" * 60)

# Test 1: No transactions = 0 streak
print("\n📊 Test 1: Empty database")
streak_data = db.get_streak_data()
print(f"   Current Streak: {streak_data['current_streak']} days")
print(f"   Longest Streak: {streak_data['longest_streak']} days")
assert streak_data['current_streak'] == 0, "Empty database should have 0 streak"
print("   ✅ PASS")

# Test 2: Add transaction for today
print("\n📊 Test 2: Transaction today")
today = datetime.now().strftime('%Y-%m-%d')
db.add_transaction('expense', 10.00, 'Test transaction today', category_id=1, date=today)
streak_data = db.get_streak_data()
print(f"   Current Streak: {streak_data['current_streak']} days")
print(f"   Longest Streak: {streak_data['longest_streak']} days")
assert streak_data['current_streak'] == 1, "Should have 1 day streak"
print("   ✅ PASS")

# Test 3: Add transaction for yesterday - should be 2 days
print("\n📊 Test 3: Transaction yesterday")
yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
db.add_transaction('expense', 15.00, 'Test transaction yesterday', category_id=1, date=yesterday)
streak_data = db.get_streak_data()
print(f"   Current Streak: {streak_data['current_streak']} days")
print(f"   Longest Streak: {streak_data['longest_streak']} days")
assert streak_data['current_streak'] == 2, "Should have 2 day streak"
assert streak_data['longest_streak'] == 2, "Longest should also be 2"
print("   ✅ PASS")

# Test 4: Add consecutive days - build a 5 day streak
print("\n📊 Test 4: Build 5-day streak")
for i in range(2, 5):
    past_date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
    db.add_transaction('expense', 20.00, f'Test transaction {i} days ago', category_id=1, date=past_date)

streak_data = db.get_streak_data()
print(f"   Current Streak: {streak_data['current_streak']} days")
print(f"   Longest Streak: {streak_data['longest_streak']} days")
assert streak_data['current_streak'] == 5, "Should have 5 day streak"
assert streak_data['longest_streak'] == 5, "Longest should be 5"
print("   ✅ PASS")

# Test 5: Add transaction from 3 days ago (creating a gap)
# This tests that the streak breaks properly
print("\n📊 Test 5: Transaction 7 days ago (breaks streak)")
week_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d')
db.add_transaction('expense', 25.00, 'Test transaction week ago', category_id=1, date=week_ago)
streak_data = db.get_streak_data()
print(f"   Current Streak: {streak_data['current_streak']} days")
print(f"   Longest Streak: {streak_data['longest_streak']} days")
assert streak_data['current_streak'] == 5, "Current streak should still be 5 (recent consecutive days)"
assert streak_data['longest_streak'] == 5, "Longest should remain 5"
print("   ✅ PASS")

# Test 6: Simulate missing a day (no transaction yesterday or today)
print("\n📊 Test 6: Streak breaks (no recent transactions)")
db_new = EnnaDatabase('test_streaks_broken.db')
# Add transactions but not for yesterday or today
two_days_ago = (datetime.now() - timedelta(days=2)).strftime('%Y-%m-%d')
three_days_ago = (datetime.now() - timedelta(days=3)).strftime('%Y-%m-%d')
db_new.add_transaction('expense', 30.00, 'Test 2 days ago', category_id=1, date=two_days_ago)
db_new.add_transaction('expense', 35.00, 'Test 3 days ago', category_id=1, date=three_days_ago)
streak_data = db_new.get_streak_data()
print(f"   Current Streak: {streak_data['current_streak']} days")
print(f"   Longest Streak: {streak_data['longest_streak']} days")
assert streak_data['current_streak'] == 0, "Streak should be broken (0 days)"
print("   ✅ PASS")

# Cleanup
db.close()
db_new.close()
import os
os.remove('test_streaks.db')
os.remove('test_streaks_broken.db')

print("\n" + "=" * 60)
print("✅ ALL TESTS PASSED!")
print("=" * 60)
print("\n🎯 Streak Features:")
print("   • Streaks are stored in database (user_stats table)")
print("   • Current streak counts consecutive days with transactions")
print("   • Streak breaks if you miss a day (no transaction yesterday or today)")
print("   • Longest streak is automatically tracked and updated")
print("   • Streaks persist across sessions (stored in database)")
print("   • New database = fresh start (streaks reset to 0)")
print("\n📡 API Endpoint: GET /api/streaks")
print("   Returns: { current_streak: X, longest_streak: Y }")
