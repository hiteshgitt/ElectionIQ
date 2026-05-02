# ElectionIQ – Smart Election Learning Assistant 🇮🇳

ElectionIQ is a production-grade, AI-powered web application designed to help Indian citizens—especially first-time voters—navigate the complex election process. By combining strict rule-based logic with the power of Google's entire Cloud ecosystem, ElectionIQ provides a secure, personalized, and highly interactive election journey.

---

## 🔐 Demo Access (For Judges & Evaluators)

**Live URL**: https://electioniq-124846023341.europe-west1.run.app

You can sign in using **either** method:

| Method | Details |
|---|---|
| **Google Sign-in** | Click "Continue with Google" and use any Google account |
| **Email & Password** | Use any email (e.g. `judge@example.com`) and any password (e.g. `demo1234`) |

> The Email/Password login accepts **any** credentials for demonstration purposes — registration is automatic upon first login.

---

## 🏗️ Enterprise Architecture (Powered by Google)

ElectionIQ is built as a showcase for the full Google Cloud and Firebase ecosystem, ensuring every part of the user experience is powered by industry-leading Google services.

| Layer | Google Service | Implementation |
|---|---|---|
| **AI Layer** | **Vertex AI (Gemini 2.5 Flash)** | Generates personalized action plans and powers the companion chatbot. |
| **Authentication** | **Google Identity & OAuth** | Secure login via Google Accounts and session management. |
| **Database** | **Firebase Firestore** | Real-time cloud database for storing user profiles and election journey results. |
| **Storage** | **Firebase Storage** | Secure cloud storage for uploaded voter identification documents. |
| **Messaging** | **Gmail SMTP API** | Automated welcome and confirmation emails sent on registration. |
| **Analytics** | **Google Analytics 4** | Advanced user behavior tracking and conversion funnels. |
| **Tagging** | **Google Tag Manager** | Centralized tag management for marketing and analytics. |
| **Deployment** | **Google Cloud Run** | Serverless containerized deployment with auto-scaling and high availability. |
| **CI/CD** | **Google Cloud Build** | Continuous Integration and Deployment pipeline directly from GitHub. |

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

1. **Seamless Public Access**: Users can check their eligibility and view their generated journey immediately on the homepage without any auth wall.

2. **Personalized Journey Generation** (`/src/ai/vertex.ts`): For eligible users, a carefully engineered prompt is sent to Gemini 2.5 Flash. The prompt instructs the model to return a **strict, raw JSON payload** containing a personalized eligibility statement, steps, timeline, and smart tips.

3. **Cloud Sync & Persistence**: Once a user signs in, their election journey is automatically synced to **Firebase Firestore**. This allows them to resume their journey on any device.

4. **Document Submission & Dashboard**: Logged-in users can access a secure dashboard to complete their voter profile and upload identification documents (Aadhaar/PAN/Passport) to **Firebase Storage**.

5. **Automated Communication**: Upon first login/registration, a professional welcome email is triggered via **Gmail SMTP**, providing the user with their next steps and a direct link to their dashboard.

6. **Interactive Companion**: A floating AI chatbot is available to authenticated users, providing contextual help and answering follow-up questions about the election process.

---

## 🚀 Key Features

*   **Logic Before AI Engine**: Zero AI overhead for ineligible users.
*   **Persistent Cloud Journeys**: Resumable action plans synced via Firebase.
*   **Secure Document Uploads**: ID verification module powered by Firebase Storage.
*   **Real-time News Feed**: Curated election updates from official ECI sources.
*   **Interactive UI Components**: Stepper-based action plans and a floating AI companion.
*   **Full Google Integration**: From AI and Auth to Storage and Deployment.

---

*Built for the democratic empowerment of Indian Citizens. 🇮🇳*
