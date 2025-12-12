import os
import torch
import re
from math import ceil
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from transformers import BartForConditionalGeneration, AutoTokenizer
from peft import PeftModel
import google.generativeai as genai

# --- CONFIGURATION ---
MODEL_CHECKPOINT = "facebook/bart-base"
ADAPTER_PATH = "./model_files" 
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configuration for Gemini 2.5 Flash
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-2.5-flash') 

app = FastAPI(title="AirScribe PRO")

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")

# --- MODEL LOADING ---
tokenizer = None
model = None

@app.on_event("startup")
def load_models():
    global tokenizer, model
    try:
        tokenizer = AutoTokenizer.from_pretrained(ADAPTER_PATH)
        base_model = BartForConditionalGeneration.from_pretrained(
            MODEL_CHECKPOINT,
            torch_dtype=torch.float16
        )
        model = PeftModel.from_pretrained(base_model, ADAPTER_PATH)
        model.eval()
        model.to(torch.device("cuda" if torch.cuda.is_available() else "cpu"))
        print("BART-LoRA and Gemini 2.5 Loaded.")
    except Exception as e:
        print(f"ERROR: {e}")

class APIRequest(BaseModel):
    domain: str # Limited to "GENERAL_NEWS" or "RESEARCH_PAPER"
    text: str
    quality: str 
    length: str
    tone: str

def generate_local_draft(domain, text, quality, length):
    percent_map = {"SHORT": 0.10, "MEDIUM": 0.15, "LONG": 0.25}
    target_tokens = ceil((len(text) // 4) * percent_map.get(length.upper(), 0.15))
    inputs = tokenizer(f"[{domain}] {text}", max_length=1024, truncation=True, return_tensors="pt").to(model.device)
    num_beams = 5 if quality.upper() == "HIGH" else 3 
    with torch.no_grad():
        ids = model.generate(**inputs, max_length=min(max(target_tokens, 60), 512), 
                             num_beams=num_beams, repetition_penalty=2.5)
    return tokenizer.decode(ids.squeeze(), skip_special_tokens=True)

async def refine_and_remove_plagiarism(draft, original, tone, length):
    """
    Acts as both a Refiner and Plagiarism Remover.
    Ensures no phrases from the original text are used verbatim.
    """
    # Strict prompt to enforce 'Summarizer Only' and Plagiarism Removal
    prompt = f"""
    TASK: Paraphrase and summarize the following draft into a {tone} version of {length} length.
    
    ORIGINAL SOURCE: "{original}"
    LOCAL DRAFT: "{draft}"
    
    STRICT INSTRUCTIONS:
    1. PLAGIARISM REMOVAL: Do not use sequences of more than 3 words from the original source. 
    2. SUMMARIZER ONLY: Provide ONLY the final summarized text.
    3. NO CONVERSATION: Do not include notes, intros, or "Here is your summary".
    4. QUALITY: Use original phrasing to capture the core essence.
    """
    response = gemini_model.generate_content(prompt)
    return response.text

@app.post("/api/process-ai")
async def process_content(data: APIRequest):
    # Validation: Removed JOB_DESC
    if data.domain.upper() not in ["GENERAL_NEWS", "RESEARCH_PAPER"]:
        raise HTTPException(status_code=400, detail="Domain must be GENERAL_NEWS or RESEARCH_PAPER.")

    try:
        # Step 1: BART+LoRA Draft (Intermediate Layer)
        local_draft = generate_local_draft(data.domain, data.text, data.quality, data.length)
        
        # Step 2: Gemini Plagiarism Removal & Refinement (Final Layer)
        final_output = await refine_and_remove_plagiarism(local_draft, data.text, data.tone, data.length)
        
        return {"success": True, "output": final_output}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)