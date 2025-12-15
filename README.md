# 🌸 Enna - Personal Budgeting App

> **Beta Release v1.0.0** - Non-AI Implementation

A comprehensive local-first budgeting application to help you take control of your finances. Built with modern web technologies and packaged as a standalone desktop app - no internet connection required!

<img width="342" height="320" alt="Logo" src="https://github.com/user-attachments/assets/8f05359e-8040-432b-ae13-ab4ab3d14a99" /> <img width="299" height="400" alt="EnnaNeutral" src="https://github.com/user-attachments/assets/0c998507-8d49-4e9d-bf86-5e2aa9ee4b2c" />



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

1. **Download** `EnnaSetup-v1.0.0.exe` from the [Releases](../../releases) page
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

<img width="960" height="500" alt="DCapture" src="https://github.com/user-attachments/assets/f23cd74d-dff4-44d7-bce7-edd8400c888c" />


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

**Please report issues** in the [Issues](../../issues) tab! Your feedback helps make Enna better.

---

## 🗺️ Roadmap

**Coming in Future Versions:**
- [ ] Mac and Linux versions
- [ ] AI-powered insights (future major release)

---

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

   MIT License - see [LICENSE](LICENSE) file for details

---

## 👨‍💻 Developer

Created by **Newton** with 💚

---

## 🙏 Acknowledgments

- Financial advice sources cited in-app

---

## 📞 Support

Having issues? Check out:
- [Issues](../../issues) - Report bugs or request features
- [Discussions](../../discussions) - Ask questions and share ideas

---

## ⭐ Enjoying Enna?

If Enna helps you manage your finances better, consider:
- ⭐ Starring this repository
- 🐦 Sharing with friends
- 💬 Leaving feedback

---

**Download Now:** [EnnaSetup-v1.0.0.exe](../../releases/latest)

*Take control of your finances with Enna! 🌸💰*
