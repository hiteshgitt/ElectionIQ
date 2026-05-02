# ElectionIQ – Smart Election Learning Assistant 🇮🇳

ElectionIQ is a production-grade, AI-powered web application designed to help Indian citizens—especially first-time voters—navigate the complex election process. By combining strict rule-based logic with the power of Google's Vertex AI (Gemini), ElectionIQ provides a secure, personalized, and highly interactive election journey.

---

## 🔐 Demo Access (For Judges & Evaluators)

**Live URL**: https://electioniq-124846023341.europe-west1.run.app

You can sign in using **either** method:

| Method | Details |
|---|---|
| **Google Sign-in** | Click "Continue with Google" and use any Google account |
| **Email & Password** | Use any email (e.g. `judge@example.com`) and any password (e.g. `demo1234`) |

> The Email/Password login accepts **any** credentials for demonstration purposes — no registration needed.

---

## 🎯 Chosen Vertical

**Civic Education & Voter Awareness — Indian Elections**

ElectionIQ targets the gap in accessible, personalized election guidance for Indian citizens. Many first-time voters (youth aged 18+) and general citizens are unaware of:
- How to check voter registration status
- What documents are required
- The step-by-step process to cast a vote
- Key election timelines (registration cutoff, polling dates, results)

ElectionIQ solves this by acting as a personal, AI-powered election guide tailored to the user's age, state, and voter experience level.

---

## 🧠 Approach and Logic

The core design philosophy is **"Logic Before AI"** — a strict rule-based engine runs first before any AI call is made. This ensures:
1. **Cost Efficiency**: The expensive Gemini API is never called for ineligible users.
2. **Speed**: Ineligible users get instant feedback without any network latency from AI.
3. **Correctness**: Business rules (age ≥ 18 to vote in India) are enforced deterministically, not left to an LLM to decide.

### Decision Logic Flow:
```
User Input (Age, State, First-Time Voter)
         │
         ▼
  ┌─────────────────┐
  │ Eligibility      │
  │ Engine           │  Age < 18 → Educational Response (NO AI Call)
  │ (Rule-Based)     │
  └────────┬─────────┘
           │ Age ≥ 18
           ▼
  ┌─────────────────┐
  │ AI Layer         │  Gemini 2.5 Flash generates personalized:
  │ (Vertex AI /     │  → Steps, Timeline, Tips (structured JSON)
  │  Gemini)         │
  └─────────────────┘
```

---

## ⚙️ How the Solution Works

1. **User Authentication**: The user signs in via Google OAuth or Email/Password (powered by `next-auth`). The app is completely locked behind authentication.

2. **User Input**: The user enters their Age, State/UT, and whether they are a first-time voter.

3. **Eligibility Check** (`/src/utils/eligibility.ts`): The backend immediately validates the input using deterministic rules. If the user is under 18, an educational response is returned instantly.

4. **AI Journey Generation** (`/src/ai/vertex.ts`): For eligible users, a carefully engineered prompt is sent to Gemini 2.5 Flash. The prompt instructs the model to return a **strict, raw JSON payload** (no markdown, no preamble) containing:
   - `eligibility`: A personalized eligibility statement
   - `explanation`: Context about the user's specific journey
   - `steps`: An array of actionable steps with titles and descriptions
   - `timeline`: Key election milestones with dates and statuses
   - `tips`: Smart, personalized tips for the user

5. **Interactive Stepper UI**: The generated steps are displayed in an interactive wizard—the user clicks "Next Step" to progress through their personalized action plan one step at a time.

6. **Companion Chatbot**: A floating AI assistant (powered by `/api/chat`) allows logged-in users to ask follow-up questions in real time.

7. **Analytics**: Google Analytics 4 (GA4) is integrated to track user engagement across the platform.

---

## 📋 Assumptions Made

- **Indian Context Only**: The eligibility logic and AI prompts are designed specifically for the Indian election system. The minimum voting age is assumed to be 18 years as per the Representation of the People Act, 1950.
- **User-Provided Data is Correct**: The system trusts the age and state entered by the user. In a production system, this would be validated against an Aadhaar or Voter ID API.
- **AI Responses are Non-Critical**: The Gemini AI is used for guidance and explanation only, not for legally binding information. Users are encouraged to verify details on the official ECI website (eci.gov.in).
- **Demo Authentication**: The Email/Password login currently accepts any valid email and password combination for demonstration purposes. In a production deployment, this would connect to a user database.
- **Single Language (English)**: The current version supports English only. Multi-language support (Hindi, regional languages) is planned for future versions.

---

## 🚀 Features

* **Strict Eligibility Engine**: "Logic Before AI" — No AI call is made for ineligible users.
* **Interactive AI Stepper**: Step-by-step Action Plan generated by Gemini 2.5 Flash.
* **Companion Chatbot**: Floating AI assistant for follow-up questions (post-login only).
* **Visual Timeline**: Election journey visualization (Registration → Polling → Voting).
* **Secure Authentication**: Google OAuth + Email credentials via `next-auth`.
* **Enterprise Analytics**: Google Analytics 4 (GA4) via `@next/third-parties/google`.
* **Cloud Run Ready**: Optimized `Dockerfile` with Next.js `standalone` mode.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15+ (App Router) |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| AI | `@google/genai` (Gemini 2.5 Flash) |
| Auth | NextAuth.js |
| Fonts | Google Fonts (Inter) |
| Analytics | Google Analytics 4 |
| Deployment | Google Cloud Run + Docker |

---

## ⚙️ Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hiteshgitt/ElectionIQ.git
   cd ElectionIQ
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY="your_gemini_api_key"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your_random_secure_string"
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment (Google Cloud Run)

1. Connect this GitHub repo to Cloud Run with continuous deployment.
2. Under **Build Configuration**, select **Dockerfile**.
3. In the **Variables & Secrets** tab, add all the `.env.local` variables above (replace `localhost:3000` with your Cloud Run URL for `NEXTAUTH_URL`).
4. Deploy!

---

*Built for the democratic empowerment of Indian Citizens. 🇮🇳*
