import { onCall } from "firebase-functions/v2/https";
import { onObjectFinalized } from "firebase-functions/v2/storage";
import * as admin from "firebase-admin";
import { VertexAI, HarmCategory, HarmBlockThreshold } from "@google-cloud/vertexai";
import * as logger from "firebase-functions/logger";
import pdf from "pdf-parse";
import { ImageAnnotatorClient } from "@google-cloud/vision";

// --- Initializations (No changes) ---
admin.initializeApp();
const db = admin.firestore();
const visionClient = new ImageAnnotatorClient();
const vertexAi = new VertexAI({ project: "lexiguide-standard-472716", location: "us-central1" });

// Using a reliable and fast model
const generativeModel = vertexAi.getGenerativeModel({
  // UPDATED: Switched to the Flash model for better formatting compliance
  model: "gemini-2.5-pro",
  // NEW: Add a system instruction for consistent formatting
  systemInstruction: {
    role:"model",
    parts: [{
      text: `You are 'Lexi', an AI legal assistant. Your goal is to demystify complex legal documents.
      You MUST generate a response in Markdown format with the exact headings provided in the user's prompt.
      You MUST start your entire response with the exact disclaimer sentence provided in the user's prompt.`
    }],
  },
  // NEW: Safety settings to prevent the model from refusing to analyze legal text
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  ],
});


// --- Reusable Prompt Function (No changes to this function) ---
const createAnalysisPrompt = (role: string, legalText: string): string => {
  return `
    Analyze the following document from the perspective of the user's role: **${role}**.

    **Instructions:**
    Generate a response with the following four sections, using the exact headings and formatting described below.

    **Disclaimer:** Start your entire analysis with this exact sentence:
    "Disclaimer: This is an AI-generated analysis for informational purposes only and does not constitute legal advice. Please consult with a qualified legal professional."

    ### 1. At-a-Glance Summary
    Create a concise, bullet-pointed overview.

    ### 2. Clause-by-Clause Explanation
    For each key clause, provide:
    - **Original Clause:** Quote the original text snippet.
    - **Plain English:** Explain the clause simply.

    ### 3. Your Obligations
    Create a bulleted list of user obligations.

    ### 4. Risk Radar
    Create a bulleted list of flags:
    - "RED FLAG 🚩:" for high-risk terms.
    - "AMBER FLAG 🔶:" for terms needing clarification.
    - "GREEN FLAG ✅:" for standard or favorable terms.

    **Document Text:**
    ---
    ${legalText}
    ---
  `;
};


// --- processDocument and analyzeText functions (No changes to their logic) ---
// They will automatically use the updated generativeModel instance and prompt.
export const processDocument = onObjectFinalized(async (event) => {
  const fileBucket = event.data.bucket;
  const filePath = event.data.name;
  const contentType = event.data.contentType || "";

  if (!filePath.startsWith("uploads/")) { return logger.log("Ignoring file."); }

  const userId = filePath.split("/")[1];
  const role = event.data.metadata?.role || "a neutral party";
  const bucket = admin.storage().bucket(fileBucket);
  const file = bucket.file(filePath);
  let legalText = "";

  try {
    const fileBuffer = (await file.download())[0];
    if (contentType === "application/pdf") {
      const data = await pdf(fileBuffer);
      legalText = data.text;
    }
    if (contentType.startsWith("image/") || (contentType === "application/pdf" && legalText.trim().length === 0)) {
      const [result] = await visionClient.documentTextDetection(fileBuffer);
      legalText = result.fullTextAnnotation?.text || "";
    }
  } catch (error) {
    logger.error("File processing error:", error);
    return;
  }

  if (!legalText) {
    logger.warn("No text extracted.");
    return;
  }

  const geminiPrompt = createAnalysisPrompt(role, legalText);
  
  const resp = await generativeModel.generateContent({ contents: [{ role: "user", parts: [{ text: geminiPrompt }] }] });
  const analysis = resp.response?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!analysis) {
    logger.error("No analysis from Gemini.");
    return;
  }
  
  const docId = filePath.split("/").pop()?.split(".")[0];
  if (docId) {
    await db.collection("users").doc(userId).collection("analyses").doc(docId).set({
      documentPath: filePath,
      analysisText: analysis,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return logger.log(`Analysis complete for user: ${userId}`);
  }
});

export const analyzeText = onCall(async (request) => {
  const { text: legalText, role = "a neutral party" } = request.data;
  if (!request.auth || !legalText) { throw new Error("Invalid request."); }

  const geminiPrompt = createAnalysisPrompt(role, legalText);
  const resp = await generativeModel.generateContent({ contents: [{ role: "user", parts: [{ text: geminiPrompt }] }] });
  const analysis = resp.response?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!analysis) { throw new Error("Could not get an analysis from the AI."); }
  return { analysis };
});

