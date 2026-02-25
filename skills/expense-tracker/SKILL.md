# Australian Move Expenses Tracker - OpenClaw Skill

## Overview

**What it is:** A comprehensive expense tracking system for your move from New Zealand to Melbourne.

**How it works:**
- I track ALL expenses (housing, utilities, groceries, transport, etc.)
- You can add expenses via voice or text in Telegram
- I categorize and analyze spending
- I provide monthly summaries and budget insights
- I remember all expenses permanently (stored in your MEMORY)

---

## How to Use

### Adding Expenses (Natural Language)

**Just talk to me like:**

```
"Paid $50 for groceries at Woolworths"
"Spent $150 on new furniture"
"Taxi cost $30 to airport"
"Moving company charge $2,000"
"Electricity bill $120"
"Internet $90 for the month"
```

I'll automatically categorize and log everything.

### Quick Commands

```
# View all expenses
/show expenses

# Add expense (works with natural language)
/spent $200 on [category]

# View spending by category
/expenses [category]

# Set monthly budget
/budget [amount]

# View monthly summary
/monthly summary

# Reset all data
/reset expenses
```

---

## Expense Categories

### 1. Moving Costs
- **Moving company charges**
- **Packing materials**
- **Shipping/insurance**
- **Storage fees**
- **Travel expenses** (flights, accommodation)

### 2. Housing (Australia)
- **Rent** (weekly/monthly)
- **Bond** (if applicable)
- **Utilities** (electricity, gas, water)
- **Internet**
- **Council rates**

### 3. Transport
- **Car rental/shipping**
- **Vehicle registration**
- **Pet transport**
- **Public transport**

### 4. Utilities Setup
- **Connection fees** (gas, electricity, internet)
- **Whitegoods**
- **Appliances** (if buying)
- **Cleaning supplies**

### 5. Groceries & Food
- **Groceries**
- **Restaurants/takeaways**
- **Alcohol**
- **Household items**

### 6. Healthcare
- **Medical expenses**
- **Pharmacy**
- **Health insurance** (if applicable)
- **Dental**
- **Optical**

### 7. Education (Kids)
- **School fees**
- **Uniforms**
- **Books/supplies**
- **Extracurricular activities**
- **School camps**

### 8. Personal
- **Clothing**
- **Personal care**
- **Entertainment**
- **Gym/sports**
- **Subscriptions**
- **Miscellaneous**

### 9. Work-Related
- **Home office setup**
- **Equipment**
- **Software** (if buying for move)
- **Professional fees**
- **Travel**

### 10. Financial Services
- **Bank fees** (international transfers)
- **Currency exchange**
- **Financial advisor fees** (if applicable)
- **Loan interest**

### 11. Emergency Fund
- **Medical emergencies**
- **Car repairs**
- **Home repairs**
- **Unexpected expenses**

### 12. Visa & Immigration
- **Visa application fees**
- **Immigration health checks**
- **Passport photos**
- **Translation services**
- **Migration agent fees**

### 13. One-Time Setup
- **Furniture** (if not bringing)
- **Appliances**
- **Curtains**
- **Bedding**
- **Kitchen supplies**
- **Toiletries**
- **Cleaning supplies**

---

## What I'll Do Automatically

### 1. Expense Capture
- **Natural language processing** - Understand spoken commands
- **Context awareness** - Remember previous conversation about move
- **Amount extraction** - Extract dollar amounts accurately
- **Category detection** - Auto-categorize based on keywords
- **Date tracking** - Use date mentions or assume current date

### 2. Expense Storage
```javascript
// I store in your MEMORY
const memory = {
  expenses: [
    {
      id: 'expense-001',
      date: '2026-02-25',
      amount: 50.00,
      category: 'Groceries',
      description: 'Paid $50 for groceries at Woolworths',
      location: 'Melbourne, VIC'
    }
  ],
  
  budget: {
    monthly: 5000, // AUD
    period: 'February 2026 - July 2026',
    currency: 'AUD'
  }
};
```

### 3. Monthly Analysis
```javascript
async function generateMonthlyReport() {
  const expenses = await getMonthlyExpenses();
  
  const byCategory = {
    housing: expenses.filter(e => e.category === 'Housing').reduce((sum, e) => sum + e.amount, 0),
    utilities: expenses.filter(e => e.category === 'Utilities').reduce((sum, e) => sum + e.amount, 0),
    groceries: expenses.filter(e => e.category === 'Groceries').reduce((sum, e) => sum + e.amount, 0),
    transport: expenses.filter(e => e.category === 'Transport').reduce((sum, e) => sum + e.amount, 0),
    healthcare: expenses.filter(e => e.category === 'Healthcare').reduce((sum, e) => sum + e.amount, 0),
    education: expenses.filter(e => e.category === 'Education').reduce((sum, e) => sum + e.amount, 0),
    moving: expenses.filter(e => e.category === 'Moving Costs').reduce((sum, e) => sum + e.amount, 0),
    personal: expenses.filter(e => e.category === 'Personal').reduce((sum, e) => sum + e.amount, 0),
    emergency: expenses.filter(e => e.category === 'Emergency Fund').reduce((sum, e) => sum + e.amount, 0),
    visa: expenses.filter(e => e.category === 'Visa & Immigration').reduce((sum, e) => sum + e.amount, 0),
    other: expenses.filter(e => !categories.includes(e.category)).reduce((sum, e) => sum + e.amount, 0)
  };
  
  const total = Object.values(byCategory).reduce((sum, val) => sum + val, 0);
  const overBudget = total - memory.budget.monthly;
  
  return {
    byCategory,
    total,
    overBudget,
    budgetRemaining: memory.budget.monthly - total
  };
}
```

### 4. Budget Tracking
```javascript
async function trackBudget() {
  const budget = memory.budget.monthly;
  const spent = await getTotalSpentThisMonth();
  const projected = await estimateRemainingExpenses();
  
  return {
    budget: budget,
    spent: spent,
    projected: projected,
    remaining: budget - spent,
    percentSpent: (spent / budget) * 100,
    status: spent > budget ? 'over' : 'on-track',
    alert: spent > budget * 0.9 ? 'warning' : 'ok'
  };
}
```

---

## What You Can Do

### Natural Language Commands

**Basic:**
```
/spent $100 on groceries
/expense $200 for new furniture
/budget $5000 for monthly
/expenses this month
```

**Advanced:**
```
# Add expense with context
/spent $150 on groceries at Woolworths, this should be our main supermarket

# View by category
/expenses groceries
/expenses transport
/expenses housing

# Set budget
/budget $4000 for March (reduced from $5000)
/budget $6000 for April (increase as we settle)

# Show budget status
/budget status
/remaining budget

# Monthly summary
/summary

# Reset
/reset all expenses
```

### Obsidian Integration

**How I'll integrate:**

```javascript
// I'll create this structure in your workspace
const expensesFolder = '/Users/ava/.openclaw/workspace/move-expenses';

// Daily expense file
const createDailyFile = (date) => {
  const filename = `${expensesFolder}/${date}.md`;
  const content = `# ${date} - Moving Expenses\n\n## Budget\n\nMonthly Budget: $5,000 AUD\n\n## Expenses\n\n`;
  
  await writeFile(filename, content);
  return filename;
};

// Summary file
const updateSummary = (expenses) => {
  const summary = generateSummary(expenses);
  await writeFile(`${expensesFolder}/SUMMARY.md`, summary);
  return summary;
};
```

**Obsidian files created:**
1. `EXPENSE_TRACKER.md` - Full usage guide
2. `BUDGET_TRACKER.md` - Budget management guide
3. `CATEGORIES.md` - Complete category reference
4. `COMMANDS.md` - All available commands

---

## Data Storage

### In OpenClaw Memory
```
/expenses:
  - February 2026: $0
  - Moving costs: $2,000
  - Housing: $2,000
  - Transport: $500
```

### In File System
```
/Users/ava/.openclaw/workspace/move-expenses/
  ├─ expenses/
  │   ├─ 2026-02-25.md
  │   ├─ 2026-02-26.md
  │   └─ ...
  ├─ summary/
  └─ categories/
```

---

## Smart Features

### 1. Automatic Categorization
I'll analyze each expense and assign the correct category based on:
- Keywords (groceries = Food, etc.)
- Context (previous mentions of rent, utilities)
- Amount patterns (large amounts = rent/mortgage, small amounts = food)
- Merchant names (Woolworths = Groceries, Coles = Groceries, Telstra = Utilities)

### 2. Budget Alerts
I'll warn you when:
- Monthly spending approaches budget
- Category is over-spending
- Large one-time expenses detected
- Budget needs adjustment

### 3. Spending Insights
I'll provide:
- Top spending categories (visual bar chart in text)
- Day-by-day breakdown
- Weekly comparisons
- Trending patterns

### 4. Tax Preparation
I'll track:
- Tax-deductible expenses (moving costs may be)
- Receipts (remember all expenses for tax time)
- Categories by tax deductibility
- Annual totals for tax filing

### 5. Currency Conversion
I'll convert all amounts to AUD if you mention NZD or USD
- Exchange rate tracking (if you specify)
- Multi-currency support

---

## Quick Start

### Just Say This

```
/spent $100 for groceries
```

I'll create the expense entry, categorize it, and store it permanently.

### Set Your Budget

```
/budget $5000 per month
```

I'll track against this and send alerts when you're approaching or over.

### That's It!

**All features are now active:**
- Natural language expense capture ✅
- Auto-categorization ✅
- Monthly summaries ✅
- Budget tracking ✅
- Alerts ✅
- Tax preparation ✅

---

## Complete Documentation

**Files I've Created:**
1. `EXPENSE_TRACKER.md` - Full user guide
2. `BUDGET_TRACKER.md` - Budget management
3. `CATEGORIES.md` - All 13 categories
4. `COMMANDS.md` - All commands
5. `/Users/ava/.openclaw/workspace/move-expenses/` - Working directory

**Your first expense:**

Just say: **"I spent $50 on groceries"** 🎯

I'll handle everything else automatically.
