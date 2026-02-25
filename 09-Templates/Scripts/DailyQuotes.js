// 🧠 DAILY WISDOM - Quote of the Day
// ==========================================

const quotes = [
    { text: "Your mind is for having ideas, not holding them.", author: "David Allen" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Do not wait to strike until the iron is hot; but make it hot by striking.", author: "William Butler Yeats" },
    { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
    { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
    { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" },
    { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
    { text: "Everything you’ve ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Act as if what you do makes a difference. It does.", author: "William James" },
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
    { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Limit your 'always' and your 'nevers'.", author: "Amy Poehler" },
    { text: "If you're going through hell, keep going.", author: "Winston Churchill" },
    { text: "What we think, we become.", author: "Buddha" },
    { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
    { text: "Die with memories, not dreams.", author: "Unknown" },
    { text: "Aspire to inspire before we expire.", author: "Unknown" },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
    { text: "Whatever you do, do it well.", author: "Walt Disney" },
    { text: "What we do in life echoes in eternity.", author: "Maximus" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "If life were predictable it would cease to be life, and be without flavor.", author: "Eleanor Roosevelt" }
];

// Pick quote based on day of year
const now = new Date();
const start = new Date(now.getFullYear(), 0, 0);
const diff = now - start;
const oneDay = 1000 * 60 * 60 * 24;
const dayOfYear = Math.floor(diff / oneDay);
const index = dayOfYear % quotes.length;
const quote = quotes[index];

// Render
const container = dv.container; // Use Dataview container

const quoteEl = container.createEl("div", {
    attr: {
        style: "text-align: center; margin: 40px 0; padding: 20px; color: var(--text-muted); font-size: 0.9em; opacity: 0.8;"
    }
});

quoteEl.createEl("div", {
    text: `✨ "${quote.text}"`,
    attr: { style: "font-style: italic; margin-bottom: 8px;" }
});

quoteEl.createEl("div", {
    text: `— ${quote.author}`,
    attr: { style: "font-size: 0.85em; font-weight: 600;" }
});

// Optional separation line if needed
// container.createEl("hr", { attr: { style: "margin: 20px 0; border: none; border-top: 1px solid var(--background-modifier-border);" } });
