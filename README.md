# ✏️ AirScribe
**AirScribe** is a high-density, multi-page AI productivity suite designed for professional content processing. It features a specialized **Hybrid Summarizer** and an interactive **Plagiarism Checker & Remover** within a space-efficient, full-screen dashboard.



## 🏗️ Technical Architecture
AirScribe utilizes a dual-layered processing pipeline to achieve high-quality, abstractive results:

* **Frontend**: Built with **Next.js 15**, **React 19**, and **Tailwind CSS**, optimized for a high-density user experience with zero wasted space.
* **Intermediate Layer (Local)**: A **BART-base** model fine-tuned using **PEFT/LoRA** for initial technical domain extraction and drafting. The weights are stored locally in the `/model_files` directory.
* **Refinement Layer (Cloud)**: A high-performance cloud intelligence layer that performs final paraphrasing and plagiarism removal to ensure the output captures the core essence uniquely.

## ✨ Key Features

### 1. Hybrid AI Summarizer
* **Domain Focus**: Optimized specifically for **General News** and **Research Papers**.
* **1-Line Essence**: Generates a bold, single-sentence summary at the top that describes the entire context.
* **Smart Keywords**: Extracts 5 high-value vocabulary badges for rapid scanning of core topics.
* **Granular Control**: Users can adjust Tone (Professional, Creative, Concise), Quality, and Length.

### 2. Plagiarism Checker & Remover
* **Independent Workspace**: A dedicated page for checking originality, separated from summarization settings to avoid confusion.
* **Interactive Highlighting**: Flags plagiarized or repetitive segments with distinct red wavy underlines.
* **Smart Replacement**: Features a one-click "Suggested Replacement" tooltip to swap flagged text with AI-generated paraphrases instantly.

### 3. Professional PDF Reports
* Generates structured documents including the **AirScribe** brand header, 1-line essence, keywords, and the full summary with perfect alignment.

---

## 🛠️ Setup & Deployment

### 1. Repository Structure
This repository is a consolidated full-stack project:
* `/` : Project root containing `app.py` (FastAPI Backend) and Next.js configuration.
* `/model_files` : Contains the fine-tuned LoRA adapter weights for the BART model.
* `/src` : Source code for the Next.js frontend application.

### 2. Backend Integration
The `app.py` file in the root directory serves as the FastAPI server.

**Requirements:**
* `PEFT 0.16.0`
* `transformers`
* `google-genai`

### 3. Frontend Setup
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 📊 Technical Specifications
* **Core Model**: `facebook/bart-base`
* **Adapter**: `LoRA` (Low-Rank Adaptation) located in `/model_files`.
* **Inference Pipeline**: Dual-stage Hybrid Intelligence.
* **Max Input**: 50,000 Characters.
.
