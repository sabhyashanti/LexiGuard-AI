# LexiGuard: Your Contextual AI Legal Assistant

![LexiGuard Logo](https://raw.githubusercontent.com/sabhyashanti/LexiGuard-AI/main/lexiguard-ui/public/logo192.png) ## 💡 Project Vision

Navigating legal documents is a daunting task for the average person, filled with complex jargon, hidden clauses, and potential risks. **LexiGuard** aims to democratize legal understanding by providing an AI-powered assistant that can analyze legal texts and offer clear, contextual insights tailored to the user's specific role (e.g., Tenant, Lender, Employee). Our mission is to empower individuals to make informed decisions and protect their interests when dealing with contracts, agreements, and other legal documents.

## ✨ Features

* **Contextual AI Analysis:** Get summaries, obligations, and risk assessments from the perspective of a specific role (e.g., "Tenant," "Landlord," "Borrower," "Employee"). This is the core differentiating feature.
* **Multiple Input Methods:**
    * **Text Input:** Paste any legal text directly for instant analysis.
    * **Document Upload:** Upload PDF, PNG, or JPG files.
* **OCR Integration:** Automatically extract text from scanned documents and images using Google Cloud Vision API.
* **Real-time Insights:** Get analysis results quickly and efficiently displayed in a user-friendly interface.
* **Secure & Scalable:** Built on Google Cloud and Firebase's serverless architecture, ensuring robust performance and data security.
* **User-friendly Interface:** Intuitive design with React and Material-UI.

## 🚀 Demo & Deployment

* **Live Demo:** [https://lexiguide-standard-472716.web.app](https://lexiguide-standard-472716.web.app)
* **Hackathon Video Submission:** [Link to your YouTube/Vimeo video here] (Once uploaded)

## 🏗️ Architecture

LexiGuard leverages a powerful, scalable serverless architecture on Google Cloud and Firebase:

![LexiGuard System Architecture Diagram](https://raw.githubusercontent.com/sabhyashanti/LexiGuard-AI/main/docs/architecture_diagram.png) * **Frontend:** React web application hosted on Firebase Hosting.
* **Authentication:** Firebase Authentication for secure user management.
* **Backend:** Cloud Functions for Firebase handle document processing, OCR, and AI interactions.
* **AI & ML:**
    * **Vertex AI (Gemini Model):** The core AI engine for contextual legal text analysis.
    * **Google Cloud Vision API:** Used for Optical Character Recognition (OCR) on uploaded images and scanned PDFs.
* **Database & Storage:**
    * **Cloud Firestore:** Stores AI analysis results.
    * **Cloud Storage for Firebase:** Stores user-uploaded documents temporarily.

## 🛠️ Technologies Used

* **Frontend:** React, TypeScript, Material-UI (MUI), Firebase Hosting
* **Backend:** Node.js, Cloud Functions for Firebase
* **Database & Storage:** Cloud Firestore, Cloud Storage for Firebase
* **Authentication:** Firebase Authentication (Google Sign-In)
* **AI/ML:** Google Vertex AI (Gemini Model), Google Cloud Vision API

## ⚙️ How to Run Locally

To get LexiGuard up and running on your local machine for development:

### **Prerequisites**

* Node.js (LTS version recommended)
* npm or Yarn
* Firebase CLI (`npm install -g firebase-tools`)
* A Google Cloud Project with Firebase enabled and billing activated (for Vertex AI and Cloud Vision).
* Firebase project configured with Firestore, Storage, and Functions enabled.

### **Setup Steps**

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/sabyashanti/LexiGuard-AI.git](https://github.com/sabyashanti/LexiGuard-AI.git)
    cd LexiGuard-AI
    ```

2.  **Initialize Firebase (if not already linked):**
    Ensure your local Firebase CLI is linked to your project.
    ```bash
    firebase use --add
    # Select your 'lexiguide-standard-472716' project.
    ```
    *If prompted to initialize other Firebase services, you can generally select "No" as they are already configured for this project.*

3.  **Install dependencies for Functions:**
    ```bash
    cd functions
    npm install
    # If using TypeScript, compile:
    npm run build
    cd ..
    ```

4.  **Install dependencies for Frontend:**
    ```bash
    cd lexiguard-ui
    npm install
    cd ..
    ```

5.  **Configure Firebase Project for Frontend:**
    You need to create a `.env` file in `lexiguard-ui/` with your Firebase project configuration.
    Create `lexiguard-ui/.env` and add:
    ```
    REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
    REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
    REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
    REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
    ```
    You can find these values in your Firebase project console: `Project settings` > `General` > `Your apps` > `Web app`.

6.  **Set up Google Cloud Environment Variables (for Functions):**
    For Cloud Functions to access Vertex AI and Cloud Vision, ensure your local environment or deployed functions have appropriate credentials. For local development, ensure your Firebase CLI is authenticated:
    ```bash
    gcloud auth application-default login
    ```
    And ensure your Firebase project has the necessary permissions (e.g., `Vertex AI User`, `Cloud Vision API User`, `Cloud Functions Invoker`, `Storage Admin` roles) for its service account.

7.  **Run Firebase Emulators Locally:**
    This will start the local servers for your functions, hosting, Firestore, etc.
    ```bash
    firebase emulators:start
    ```
    The frontend will be available at `http://localhost:5000` (or similar, as reported by the emulator).

8.  **Deploy to Firebase (Optional, for production):**
    ```bash
    firebase deploy
    ```

## ⚠️ Challenges Faced

* **Contextual Prompt Engineering:** Fine-tuning the prompts for the Gemini model to consistently deliver accurate, role-specific insights across various legal document types was an iterative process. Balancing specificity with generalization was key.
* **PDF/Image Text Extraction Robustness:** Handling diverse document formats (scanned PDFs, images, different layouts) required careful integration and configuration of the Cloud Vision API for reliable text extraction.
* **State Management & Real-time Updates:** Ensuring seamless user experience with file uploads, background processing by Cloud Functions, and real-time display of results required robust state management in the React frontend and efficient use of Firestore listeners.
* **Git Repository Configuration:** Resolving an intricate issue with embedded Git repositories (due to `create-react-app`'s default behavior) to enable a clean, unified push to GitHub. (This was a fun meta-challenge!)

## 🔮 Future Enhancements

* **Comparative Analysis:** Allow users to compare a single clause from different roles (e.g., "Show me tenant vs. landlord perspective on this clause").
* **Document Versioning:** Keep track of changes to documents and their analyses.
* **Interactive Clause Modification:** Suggest rephrasing or alternative clauses based on user's desired outcome.
* **Multilingual Support:** Extend analysis capabilities to other languages.
* **Mobile Application:** Develop native iOS/Android applications for on-the-go legal assistance.
* **Integration with E-signing Platforms:** Direct integration for streamlined workflows.
* **User Feedback Loop:** Allow users to rate analysis quality to further train/fine-tune the AI model.

---

**Developed with ❤️ for the Gen AI Exchange Hackathon**
