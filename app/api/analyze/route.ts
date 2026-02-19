// app/api/analyze/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { imageBase64, industry, persona, country } = await req.json();

    // 1. เช็ค API Key
    const allKeysString = process.env.GEMINI_API_KEYS;
    if (!allKeysString) {
      return NextResponse.json({ error: "API Keys not found in .env" }, { status: 500 });
    }

    // 2. สุ่ม Key (เพื่อกระจาย Load)
    const keysArray = allKeysString.split(',').map(key => key.trim());
    const randomKey = keysArray[Math.floor(Math.random() * keysArray.length)];

    const genAI = new GoogleGenerativeAI(randomKey);

    // 🔥 แก้ตรงนี้: ใช้ 1.5 flash (2.5 ยังไม่มีครับ ถ้าใส่ไปจะ Error 404)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
      generationConfig: { responseMimeType: "application/json" }
    });

    // 3. แปลงข้อมูลรูปภาพ (Support ทั้งแบบมี Header และไม่มี)
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    
    // เช็คว่ามีรูปจริงไหม
    if (!base64Data) {
        return NextResponse.json({ error: "No image data found" }, { status: 400 });
    }

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/png", // ส่งเป็น png ไปเลยง่ายดี (Gemini รับได้หมด)
      },
    };

    // --- 4. 🧠 PROMPT ENGINEERING ---
    const prompt = `
      You are a strict Senior UX/UI Auditor specialized in Cross-Cultural Design.
      Your task is to audit the attached image for the "${industry}" industry, targeting "${persona}" in "${country}".

      🔴 CRITICAL VALIDATION STEP:
      1. Analyze the image visually.
      2. If the image is NOT a digital User Interface (e.g., it is a photo of a cat, landscape, blank screen), RETURN SCORE: 0.
      3. If it is a UI, proceed to grading strictly.

      ⚖️ GRADING RUBRIC (Be Harsh):
      - Score 0-40: Poor UX, broken layout, wrong culture.
      - Score 41-70: Average, usable but generic.
      - Score 71-85: Good professional standard.
      - Score 86-100: World-class, perfect localization.

      OUTPUT FORMAT (JSON ONLY):
      {
        "score": (number 0-100),
        "quote": (string - short, critical summary),
        "metrics": {
          "legibility": "High/Medium/Low",
          "issues": (number count),
          "safety": "Pass/Fail",
          "context": "${industry}"
        },
        "details": [
          { "id": 1, "type": "error", "title": "Critical Issue", "desc": "Explain clearly..." },
          { "id": 2, "type": "suggestion", "title": "Improvement", "desc": "..." }
        ],
        "visualIssues": [
          { "id": "v1", "title": "Contrast", "x": 10, "y": 20, "w": 30, "h": 10 }
        ],
        "heatmapData": "radial-gradient(circle at 50% 50%, rgba(255,0,0,0.5) 0%, transparent 70%)",
        
        "benchmark": {
          "competitors": ["Global Standard", "Local Leader"],
          "marketAvgScore": 75,
          "radarData": [ 50, 60, 70, 80, 90 ], 
          "sentiment": "Neutral",
          "competitorName": "Top Local Leader",
          "competitorScore": 88,
          "comparison": [
             { "aspect": "Visual Hierarchy", "us": "Cluttered", "them": "Clean", "notes": "They use whitespace better" },
             { "aspect": "Color Usage", "us": "Dull", "them": "Vibrant", "notes": "Fits local taste" },
             { "aspect": "Navigation", "us": "Confusing", "them": "Standard", "notes": "Follows patterns" }
          ]
        },
        "localizerKit": {
            "adaptivePalette": [
               { "hex": "#FF0000", "name": "Lucky Red", "originalRef": "#000000", "reason": "Better for CN market" }
            ],
            "fonts": { "heading": "Noto Sans", "body": "Roboto" },
            "cssVariable": ":root { --primary: #FF0000; }"
        }
      }
    `;

    // ส่งไปประมวลผล
    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text();
    
    // Clean string ก่อน Parse (กันเหนียว)
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json(JSON.parse(cleanedText));

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ 
      error: "Analysis Failed", 
      details: error.message || String(error) 
    }, { status: 500 });
  }
}