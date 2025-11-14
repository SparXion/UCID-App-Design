# Testing Guide - UCID App with Bidirectional Mapping + Hybrid ID

## Quick Start to Test the Quiz

### Step 1: Apply Database Migration

```bash
cd ucid-app/backend
npx prisma migrate dev
```

This applies the hybrid fields migration.

### Step 2: Seed Database with Hybrid Examples

```bash
npm run prisma:seed
```

**Important**: Copy the test student ID from the output (e.g., `cmhz1zjxz000ovnfy1daea6ba`)

### Step 3: Update Frontend Student ID

Edit `frontend/src/App.tsx` and update the `studentId`:

```typescript
const studentId = "PASTE_STUDENT_ID_HERE";
```

### Step 4: Start Backend Server

```bash
cd ucid-app/backend
npm run dev
```

Backend runs on `http://localhost:3001`

### Step 5: Start Frontend Server

In a **new terminal**:

```bash
cd ucid-app/frontend
npm run dev
```

Frontend runs on `http://localhost:3000`

### Step 6: Test the Quiz

1. Open `http://localhost:3000` in your browser
2. You should see the quiz interface
3. Select **"Help me discover"** mode
4. Add interests like:
   - **Sci-Fi** (should map to: Speculative Design, Systems Thinking, AI Integration)
   - **3D Printing** (should map to: Additive Manufacturing, Digital Fabrication)
   - **Coding** (should map to: Parametric Design, Automation Scripts, Generative Systems)
5. Add talents like:
   - **Problem-Solving** (should map to: Design Thinking, Systems Thinking)
   - **Spatial Awareness** (should map to: 3D Thinking, Form Understanding)
6. Select **"Code the system that designs it"** (SYSTEM_ARCHITECT) in Design Style
7. Click **"See My Recommendations"**

### Step 7: Verify Results

You should see:
- **Hybrid paths** with black "SYSTEM DESIGN" badges
- **Industry required skills** displayed
- **Matched skills** highlighted (e.g., "✓ You already have 4 of these!")
- **High match scores** (80-100%) for hybrid paths
- **Reasoning** showing skill alignment and hybrid affinity

---

## Test Scenarios

### Scenario 1: Sci-Fi + Coding → Hybrid Path
**Input:**
- Interests: Sci-Fi, Coding, 3D Printing
- Talents: Problem-Solving, Spatial Awareness
- Hybrid Mode: SYSTEM_ARCHITECT

**Expected:**
- "Generative Footwear System Architect" should appear
- High match score (90-100%)
- Shows matched skills: Systems Thinking, Generative Systems, etc.
- Reasoning mentions hybrid affinity

### Scenario 2: Traditional Designer
**Input:**
- Interests: Drawing, Art, Footwear
- Talents: Drawing, Sketching, Color Theory
- Hybrid Mode: DIRECT_CREATOR

**Expected:**
- "Footwear Concept Designer" should appear
- High match score
- Shows matched skills: Sketching, Drawing, Color Theory
- Reasoning mentions direct creation alignment

### Scenario 3: Everyday Interests → ID Careers
**Input:**
- Interests: Movies, Travel, Helping Others
- Talents: Storytelling, User Research

**Expected:**
- Should see connections to ID concepts
- Paths related to narrative design, portable products, assistive technology
- Visual feedback showing ID connections

---

## Troubleshooting

### Quiz Not Showing
- Check browser console for errors
- Verify backend is running on port 3001
- Check that student ID exists in database

### No Career Paths Showing
- Make sure you've submitted the quiz
- Check backend logs for errors
- Verify seed data includes SkillTrees

### Hybrid Paths Not Appearing
- Verify migration was applied (`npx prisma migrate status`)
- Check seed data includes hybrid SkillTrees
- Ensure hybridMode was selected in quiz

### Skills Not Matching
- Check browser console for API responses
- Verify bidirectional mapping file exists
- Check backend logs for mapping errors

---

## API Testing (Optional)

Test endpoints directly:

```bash
# Check quiz status
curl http://localhost:3001/api/v1/students/YOUR_STUDENT_ID/quiz-status

# Submit quiz
curl -X POST http://localhost:3001/api/v1/students/YOUR_STUDENT_ID/quiz \
  -H "Content-Type: application/json" \
  -d '{
    "talents": [
      {"type": "Explicit", "name": "Drawing", "measuredScore": 80, "confidence": "High"}
    ],
    "interests": [
      {"topic": "Sci-Fi", "strength": 5, "confidence": "High"}
    ],
    "hybridMode": "SYSTEM_ARCHITECT"
  }'

# Get recommendations
curl http://localhost:3001/api/v1/recommendations/students/YOUR_STUDENT_ID/paths
```

---

## What to Look For

✅ **Quiz Interface:**
- Mode selection (Direct vs Explore)
- Expanded interest categories (70+ options)
- Expanded talent categories (8 categories)
- Hybrid mode selection with icons
- Visual ID connection feedback

✅ **Recommendations:**
- Hybrid paths with black badges
- Industry required skills displayed
- Matched skills highlighted
- Reasoning explains matches
- High scores for aligned paths

✅ **Bidirectional Matching:**
- Forward mapping: Interests → Skills visible
- Backward mapping: Industry needs shown
- Intersection: Matched skills highlighted
- Score boosts from alignment

---

## Next Steps After Testing

1. **Add More Seed Data**: Create more SkillTrees for testing
2. **Refine Mappings**: Adjust skill mappings based on results
3. **Improve UI**: Enhance visual feedback for matches
4. **Add Analytics**: Track which paths students select
5. **Expand Industries**: Add more industries/subfields

---

## Quick Reset

To start fresh:

```bash
cd ucid-app/backend
rm prisma/dev.db
npx prisma migrate dev
npm run prisma:seed
# Copy new student ID to frontend/src/App.tsx
```

Then restart both servers.

