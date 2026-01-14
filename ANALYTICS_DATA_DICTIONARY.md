# Analytics Data Dictionary

This document describes all analytics data collected for academic analysis.

## Event

**Purpose:** Track key usage events for engagement and funnel analysis.

**Table:** `Event`

**Fields:**
- `id` (string) — unique event ID
- `studentId` (string, nullable) — linked student ID if authenticated
- `sessionId` (string, nullable) — anonymous session identifier
- `name` (string) — event name
- `properties` (json, nullable) — event metadata
- `createdAt` (datetime) — timestamp

**Event Names (current):**
- `signup`
- `quiz_complete`
- `recommendations_viewed`
- `results_saved`

**Properties (examples):**
- `quiz_complete`:
  - `talentsCount` (number)
  - `interestsCount` (number)
  - `hybridMode` (string | null)
- `recommendations_viewed`:
  - `total` (number)
  - `page` (number)
  - `limit` (number)
  - `cached` (boolean)

---

## SurveyResponse

**Purpose:** Pre/post survey responses to measure change in clarity/confidence.

**Table:** `SurveyResponse`

**Fields:**
- `id` (string) — unique response ID
- `studentId` (string, nullable) — linked student ID if authenticated
- `type` (string) — `PRE` or `POST`
- `responses` (json) — survey answers
- `createdAt` (datetime) — timestamp

**Pre‑Survey Questions:**
- `awareness` (1–5)
- `confidence` (1–5)
- `clarity` (1–5)
- `notes` (text)

**Post‑Survey Questions:**
- `usefulness` (1–5)
- `confidence` (1–5)
- `clarity` (1–5)
- `notes` (text)

---

## PromptResponse

**Purpose:** Quick, lightweight in‑app prompts for immediate feedback.

**Table:** `PromptResponse`

**Fields:**
- `id` (string) — unique response ID
- `studentId` (string, nullable) — linked student ID if authenticated
- `promptKey` (string) — prompt identifier
- `rating` (number, nullable) — 1–5 rating
- `responseText` (string, nullable) — free‑text feedback
- `createdAt` (datetime) — timestamp

**Prompt Keys (current):**
- `recommendations_usefulness`
- `save_results_feedback`

---

## KPI Summary (calculated)

**Endpoint:** `GET /api/v1/analytics/kpis`

**Returned Metrics:**
- Total students
- Event counts by type
- Survey counts (pre/post)
- Prompt count

---

## CSV Export

**Endpoint:** `GET /api/v1/analytics/export?type={events|surveys|prompts}`

CSV includes all fields listed above for each dataset.

---

## Privacy Notes

- `studentId` is nullable to allow anonymous usage tracking.
- `sessionId` allows anonymized analysis without identity.
- All free‑text fields are optional.

---

## Recommended Academic KPIs

- Quiz completion rate = `quiz_complete` / `signup`
- Recommendation engagement = `recommendations_viewed` / `quiz_complete`
- Save rate = `results_saved` / `recommendations_viewed`
- Pre vs Post shifts in `confidence` and `clarity`

