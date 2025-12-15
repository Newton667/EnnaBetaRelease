# 🌸 Enna - Personal Budgeting App

> **Beta Release v1.0.0** - Non-AI Implementation

A comprehensive local-first budgeting application to help you take control of your finances. Built with modern web technologies and packaged as a standalone desktop app - no internet connection required!

![Enna Logo](https://via.placeholder.com/150x150?text=Enna+Logo)
<!-- Replace with actual logo screenshot -->

---

## 🎯 What is Enna?

Enna is your personal financial companion, featuring an anime-style mascot to make budgeting more engaging and less intimidating. This beta version includes all core budgeting features without AI integration, giving you full control over your financial data - all stored locally on your computer.

---

## ✨ Features

### 💰 Budget Planning
- Set percentage-based budget allocations across multiple categories
- Visual sliders for intuitive budget adjustment
- Real-time overspending detection with color-coded alerts
- Customizable spending categories with icons and colors

### 📊 Transaction Tracker
- Add income and expense transactions manually
- Automatic categorization
- Edit and delete transactions with inline editing
- Clean, organized transaction history

### 📁 CSV Import System
- Import transactions from major banks:
  - Chase
  - Wells Fargo
  - Bank of America
- Intelligent column mapping
- Automatic category detection
- Bulk transaction processing

### 📈 Reports & Analytics
- Interactive charts and visualizations
- Category spending breakdowns with pie charts
- Spending trends over time with line charts
- Monthly comparisons with bar charts
- Financial health scoring system

### 🗄️ Archive System
- Create monthly financial archives
- Track your progress over time
- Historical data preservation
- Monthly spending comparisons
- Custom archive naming

### 🎓 Financial Advice Hub
- Evidence-based financial guidance
- Credible sources and citations
- Topics include:
  - Budgeting basics
  - Saving strategies
  - Emergency funds
  - Debt management
  - Investment fundamentals
  - And more...

### 💾 100% Local Storage
- All data stored in `enna.db` (SQLite database)
- Complete privacy - no cloud sync, no data collection
- Your data never leaves your computer
- Portable - copy your database to backup or transfer

---

## 📥 Installation

### Windows

1. **Download** `EnnaSetup-v1.0.0.exe` from the [Releases](https://github.com/Newton667/EnnaBetaRelease/releases) page
2. **Run the installer** - double-click the downloaded file
3. **Follow the setup wizard:**
   - Choose installation location (default: `C:\Program Files\Enna`)
   - Optionally create a desktop shortcut
   - Click Install
4. **Launch Enna** - find it in your Start Menu or desktop shortcut

That's it! No Python, Node.js, or other dependencies needed.

---

## 🚀 Getting Started

1. **First Launch** - The app will open automatically in your default web browser
2. **Set Your Name** - Personalize your experience in Settings
3. **Add Categories** - Create spending categories that match your lifestyle
4. **Set Your Budget** - Allocate percentages to each category
5. **Track Transactions** - Add your income and expenses
6. **Import Bank Data** - Use CSV import for existing transactions
7. **Monitor Progress** - Check reports and your financial health score

---

## 📸 Screenshots

<!-- Add screenshots here -->
```
[ Dashboard Screenshot ]
[ Budget Planning Screenshot ]
[ Reports Screenshot ]
[ Transaction Tracker Screenshot ]
```

---

## 🔧 Technical Details

**Built With:**
- **Frontend:** React + Vite
- **Backend:** Python Flask
- **Database:** SQLite
- **Packaging:** PyInstaller + Inno Setup

**System Requirements:**
- Windows 10 or later
- 100MB free disk space
- No internet connection required (runs locally)

**Port:** The app runs on `localhost:5000` - a console window will stay open while the app is running. This is normal! Just minimize it and use the browser window.

---

## 📊 What's Stored?

Your `enna.db` database contains:
- Transaction records
- Budget allocations
- Category definitions
- Monthly archives
- User preferences
- Financial health scores

**Location:** `C:\Program Files\Enna\database\enna.db` (or your chosen install directory)

**Backup Tip:** Regularly copy the `database` folder to keep backups of your financial data!

---

## ⚠️ Beta Notice

This is a **beta release**. While fully functional, you may encounter:
- Minor UI quirks
- Edge cases in CSV importing
- Potential bugs in complex workflows

**Please report issues** in the [Issues](https://github.com/Newton667/EnnaBetaRelease/issues) tab! Your feedback helps make Enna better.

---

## 🗺️ Roadmap

**Coming in Future Versions:**
- [ ] Multi-currency support
- [ ] Recurring transactions
- [ ] Bill reminders
- [ ] Goal tracking (savings goals, debt payoff)
- [ ] Data export (PDF reports, CSV exports)
- [ ] Dark mode
- [ ] Mac and Linux versions
- [ ] AI-powered insights (future major release)

---

## 🐛 Known Issues

- CSV import may require manual category mapping for some bank formats
- Very large databases (10,000+ transactions) may experience slight slowdown
- The console window must stay open while using the app

---

## 💡 Tips & Tricks

**Keyboard Shortcuts:**
- `Ctrl + S` - Save when editing transactions
- `Esc` - Cancel editing

**Best Practices:**
- Create archives monthly to track your progress
- Import bank data at the start of each month
- Review your financial health score weekly
- Backup your database regularly

---

## 🤝 Contributing

This is a beta release and contributions are welcome! Areas of interest:
- Bug fixes
- UI/UX improvements
- Additional CSV bank format support
- Documentation improvements

---

## 📄 License

[Your chosen license - e.g., MIT, GPL, etc.]

---

## 👨‍💻 Developer

Created by **Newton** with 💚

---

## 🙏 Acknowledgments

- Built with guidance from Claude (Anthropic)
- Icon design: [Credit if applicable]
- Financial advice sources cited in-app

---

## 📞 Support

Having issues? Check out:
- [Issues](https://github.com/Newton667/EnnaBetaRelease/issues) - Report bugs or request features
- [Discussions](https://github.com/Newton667/EnnaBetaRelease/discussions) - Ask questions and share ideas

---

## ⭐ Enjoying Enna?

If Enna helps you manage your finances better, consider:
- ⭐ Starring this repository
- 🐦 Sharing with friends
- 💬 Leaving feedback

---

**Download Now:** [EnnaSetup-v1.0.0.exe](https://github.com/Newton667/EnnaBetaRelease/releases/latest)

*Take control of your finances with Enna! 🌸💰*
