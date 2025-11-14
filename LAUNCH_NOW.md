# LAUNCH THE UCID APP - Quick Start

## Database is Ready
- Migration applied: Hybrid fields added
- Database seeded: Hybrid SkillTrees created
- Test student created: `cmhz8e8c5001em117pzwwbkbd`

---

## Launch Steps

### Terminal 1: Start Backend

```bash
cd "/Users/johnviolette/UC | ID App Design/ucid-app/backend"
npm run dev
```

**Expected output:**
```
Server running on http://localhost:3001
```

### Terminal 2: Start Frontend

```bash
cd "/Users/johnviolette/UC | ID App Design/ucid-app/frontend"
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Open Browser

Go to: **http://localhost:3000**

---

## Test the Quiz

### 1. You'll See the Quiz Interface
- Two mode options: "I have specific ideas" vs "Help me discover"
- Select **"Help me discover"**

### 2. Add Interests
Click "Show Examples" and select:
- **Sci-Fi** → Should show: "This connects to ID: Speculative Design, Futuristic Products, Systems Thinking..."
- **3D Printing** → Should show: "This connects to ID: Additive Manufacturing, Digital Fabrication..."
- **Coding** → Should show: "This connects to ID: Parametric Design, Automation Scripts..."

### 3. Add Talents
Click "Show Examples" and select:
- **Problem-Solving** (from Problem-Solving category)
- **Spatial Awareness** (from Spatial category)

### 4. Select Design Style
Choose: **"Code the system that designs it"** (SYSTEM_ARCHITECT)
- Icon: Code symbol
- This enables hybrid path matching

### 5. Submit Quiz
Click: **"See My Recommendations"**

---

## What You Should See

### Career Path Cards Should Show:

1. **Hybrid Paths** (with lighter background):
   - Black "SYSTEM DESIGN" badge
   - Hybrid type badge (e.g., "GENERATIVE")
   - System blurb in italics: "You don't draw the shoe. You code the rules that generate it."

2. **Industry Required Skills**:
   - Section: "Industry requires:"
   - Badges showing: Sketching, 3D Modeling, Ergonomics, Footwear Design, Biomechanics

3. **Matched Skills**:
   - Highlight box: "You already have X of these!"
   - Black badges for matched skills

4. **Reasoning**:
   - "High fit | 4 industry-required skills matched | Hybrid system design affinity (+40)"

5. **High Match Scores**:
   - Hybrid paths should show 85-100% matches
   - Traditional paths should show 70-90% matches

---

## Expected Results

### For Sci-Fi + Coding + SYSTEM_ARCHITECT:

**Top Match Should Be:**
- **Generative Footwear System Architect**
- Score: 90-100%
- Shows: "You already have 4 of these!" (Systems Thinking, Generative Systems, etc.)
- Reasoning mentions hybrid affinity

### For Traditional Designer:

**Top Match Should Be:**
- **Footwear Concept Designer** (if you selected drawing/sketching)
- Score: 80-95%
- Shows matched skills: Sketching, Drawing, etc.

---

## Troubleshooting

### Quiz Not Loading?
- Check backend is running: `curl http://localhost:3001/health`
- Check browser console for errors
- Verify student ID in `frontend/src/App.tsx`

### No Career Paths?
- Make sure you submitted the quiz
- Check backend logs for errors
- Verify seed data: `cd backend && npm run prisma:seed`

### Hybrid Paths Missing?
- Verify you selected "Code the system that designs it"
- Check backend logs for hybrid mode
- Verify migration was applied: `cd backend && npx prisma migrate status`

---

## Quick Test Commands

```bash
# Check backend health
curl http://localhost:3001/health

# Check quiz status
curl http://localhost:3001/api/v1/students/cmhz8e8c5001em117pzwwbkbd/quiz-status

# Get recommendations (after submitting quiz)
curl http://localhost:3001/api/v1/recommendations/students/cmhz8e8c5001em117pzwwbkbd/paths
```

---

## Reset & Start Fresh

If you want to reset everything:

```bash
cd "/Users/johnviolette/UC | ID App Design/ucid-app/backend"
rm prisma/dev.db
npx prisma migrate dev
npm run prisma:seed
# Copy new student ID to frontend/src/App.tsx
```

Then restart both servers.

---

## Success Criteria

- Quiz shows expanded interests (70+ options)
- Quiz shows expanded talents (8 categories)
- Hybrid mode selection works
- ID connections show for everyday interests
- Recommendations show hybrid paths with badges
- Industry required skills displayed
- Matched skills highlighted
- Reasoning explains matches
- High scores for aligned paths

**If all these work, the bidirectional mapping + hybrid ID system is live!**

