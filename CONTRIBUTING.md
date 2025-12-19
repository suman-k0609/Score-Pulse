# 🤝 Contributing to ScorePulse

Thank you for your interest in contributing to ScorePulse! This guide will help you get started.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

---

## 📜 Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md).

### Our Standards
- Be respectful and inclusive
- Welcome diverse perspectives
- Focus on constructive criticism
- Report unacceptable behavior

---

## 🚀 Getting Started

### 1. Fork the Repository
```bash
# Visit GitHub and click "Fork"
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ScorePulse.git
cd ScorePulse
```

### 2. Create Feature Branch
```bash
# Create branch from main
git checkout -b feature/your-feature-name

# Use descriptive branch names:
# feature/add-cricket-api
# fix/search-pagination-bug
# docs/update-readme
```

### 3. Setup Development Environment
```bash
# Follow INSTALLATION_GUIDE.md
npm install
node seedRealGames.js
npm start  # in both backend and frontend
```

---

## 💻 Development Setup

### Backend Development

```bash
cd backend

# Install with dev dependencies
npm install

# Start with auto-reload (if available)
npm run dev

# Or standard start
npm start
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start with hot reload
npm start
```

### Database

```bash
# For local development
mongod

# Or use MongoDB Atlas (cloud)
```

---

## ✏️ Making Changes

### Areas You Can Contribute

#### 🏀 Features
- Add new sports (cricket, tennis, etc.)
- Implement new pages
- Add API endpoints
- Create new components

#### 🐛 Bug Fixes
- Fix broken features
- Improve error handling
- Resolve UI issues
- Optimize performance

#### 📚 Documentation
- Improve README
- Add code comments
- Create tutorials
- Fix typos

#### 🧪 Tests
- Add unit tests
- Create integration tests
- Improve test coverage

#### 🎨 UI/UX
- Improve design
- Better mobile experience
- Accessibility improvements
- Dark mode enhancements

### Adding New Features

#### Example: Add Cricket Support

**Step 1: Create Cricket Model**
```javascript
// models/cricket.js
const cricketSchema = new mongoose.Schema({
  eventName: String,
  sport: { type: String, default: 'cricket' },
  team1: { name: String, score: Number, wickets: Number },
  team2: { name: String, score: Number, wickets: Number },
  // ... other fields
});
```

**Step 2: Add Cricket Routes**
```javascript
// routes/cricket_routes.js
const express = require('express');
const router = express.Router();
const Cricket = require('../models/cricket');

router.get('/', async (req, res) => {
  const matches = await Cricket.find();
  res.json(matches);
});

module.exports = router;
```

**Step 3: Integrate in Server**
```javascript
// server.js
const cricketRoutes = require('./routes/cricket_routes');
app.use('/api/cricket', cricketRoutes);
```

**Step 4: Update Frontend**
```javascript
// frontend/src/pages/Dashboard.js
// Add cricket to sport filter
const sports = ['basketball', 'football', 'cricket'];
```

**Step 5: Test and Commit**
```bash
git add .
git commit -m "feat: add cricket sport support"
```

---

## 📝 Coding Standards

### JavaScript/Node.js

```javascript
// ✅ Good
const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: error.message });
  }
};

// ❌ Bad
async function get_user_by_id(id) {
  const user = User.findById(id);
  return user;
}
```

### React Components

```javascript
// ✅ Good
const EventCard = ({ event, onFollow }) => {
  return (
    <div className="event-card">
      <h3>{event.name}</h3>
      <p>{event.venue}</p>
      <button onClick={() => onFollow(event.id)}>Follow</button>
    </div>
  );
};

// ❌ Bad
export default function EC(e) {
  return <div><h3>{e.n}</h3></div>;
}
```

### Naming Conventions

- **Variables**: camelCase
  - `const userName = 'John';`
  
- **Constants**: UPPER_SNAKE_CASE
  - `const API_URL = 'http://localhost:5000';`
  
- **Classes**: PascalCase
  - `class UserController {}`
  
- **Functions**: camelCase
  - `const getUserData = () => {};`
  
- **Files**: lowercase with hyphens (components), lowercase (others)
  - `EventCard.js`, `user_routes.js`

### Code Comments

```javascript
// ✅ Good - Explains WHY
// Fetch user data from API and cache for 5 minutes
const cacheData = (key, value, ttl) => {
  cache.set(key, value);
  setTimeout(() => cache.delete(key), ttl * 60000);
};

// ❌ Bad - Obvious comments
// Get user ID
const userId = getUserId();
```

### Error Handling

```javascript
// ✅ Good
try {
  const data = await fetchData();
  return data;
} catch (error) {
  console.error('Failed to fetch data:', error.message);
  return { error: 'Failed to fetch data' };
}

// ❌ Bad
const data = fetchData(); // No error handling!
```

---

## 🧪 Testing

### Before Submitting PR

```bash
# 1. Verify your code works
npm start  # in both directories

# 2. Test in browser at http://localhost:3000

# 3. Check console for errors
# Look for: red errors, warnings, console.logs

# 4. Test your specific feature
# If adding search: test search thoroughly
# If fixing bug: verify bug is fixed

# 5. Test on mobile (responsive design)
# Open DevTools (F12), toggle device toolbar
```

### Manual Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Database updates correctly
- [ ] Real-time updates work
- [ ] Error messages are clear
- [ ] UI looks good

---

## 📤 Submitting Changes

### Step 1: Commit Changes

```bash
# Stage your changes
git add .

# Commit with clear message
git commit -m "feat: add new feature description"

# Commit types:
# feat: New feature
# fix: Bug fix
# docs: Documentation
# style: Code style (no logic change)
# refactor: Code refactoring
# test: Adding tests
# perf: Performance improvement
```

### Step 2: Push to Fork

```bash
# Push to your forked repository
git push origin feature/your-feature-name
```

### Step 3: Create Pull Request

1. Visit [GitHub Sports-Adda](https://github.com/yourusername/Sports-Adda)
2. Click "Compare & pull request"
3. Fill in PR template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Performance improvement

## Related Issues
Fixes #123

## Testing
How to test these changes

## Screenshots (if UI changes)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
```

---

## 🔄 Pull Request Process

### Review Checklist

We review PRs for:

1. **Code Quality**
   - Follows coding standards
   - No unused variables
   - Proper error handling
   - Good performance

2. **Testing**
   - Works as described
   - No breaking changes
   - Edge cases handled

3. **Documentation**
   - README updated if needed
   - Code commented
   - Commit messages clear

4. **Performance**
   - No unnecessary API calls
   - Optimized queries
   - Efficient algorithms

### During Review

- Be open to feedback
- Respond to comments
- Make requested changes
- Push new commits to same branch

### After Approval

- PR will be merged by maintainers
- Your changes go live!
- You're credited as contributor

---

## 🎯 Good First Issues

Perfect for beginners:

- [ ] Add weather API integration
- [ ] Create admin dashboard skeleton
- [ ] Add loading spinners
- [ ] Improve error messages
- [ ] Add README badges
- [ ] Create API documentation
- [ ] Add form validation
- [ ] Create unit tests

---

## 📚 Resources

- [Git Guide](https://git-scm.com/doc)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Markdown Syntax](https://github.github.com/gfm/)
- [REST API Best Practices](https://restfulapi.net/)
- [React Documentation](https://react.dev)
- [Node.js Documentation](https://nodejs.org/docs/)

---

## 🚀 Getting Help

- **Questions**: Open GitHub Discussion
- **Bugs**: Open GitHub Issue
- **Ideas**: Share in Discussions
- **Email**: support@sportsadda.com

---

## 🎉 Thank You!

Your contributions help make Sports Adda better for everyone!

```
 ❤️ Contributors wanted!
🚀 Let's build something amazing together
```

---

<div align="center">

### Happy Contributing! 🙌

[Back to README](./README.md) • [View Features](./FEATURES.md) • [Setup Guide](./INSTALLATION_GUIDE.md)

Made with ❤️ by Aryan & Contributors

</div>
