import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { brandName, country } = body;

    if (!brandName || !country) {
      return NextResponse.json({ error: 'Brand name and country are required' }, { status: 400 });
    }

    // --- ส่วนแก้ไขเพื่อรองรับระบบหลายคีย์ของพี่ ---
    
    // 1. อ่านค่าจากตัวแปรชื่อ GEMINI_API_KEYS (ตามที่พี่ตั้งใน .env)
    const allKeysString = process.env.GEMINI_API_KEYS;

    if (!allKeysString) {
      return NextResponse.json({ error: 'ไม่พบตัวแปร GEMINI_API_KEYS ในไฟล์ .env.local' }, { status: 500 });
    }

    // 2. แยกคีย์ด้วยเครื่องหมายลูกน้ำ (,) และตัดช่องว่างออก
    const keys = allKeysString.split(',').map(key => key.trim()).filter(key => key.length > 0);

    if (keys.length === 0) {
      return NextResponse.json({ error: 'ไม่พบคีย์ในตัวแปร GEMINI_API_KEYS' }, { status: 500 });
    }

    // 3. สุ่มหยิบมา 1 คีย์ (เพื่อกระจายการใช้งาน ไม่ให้ติด Limit)
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    console.log(`Using Key: ...${randomKey.slice(-4)}`); // (Optional) แอบดูใน Terminal ว่าใช้คีย์ไหน

    // ----------------------------------------

    const genAI = new GoogleGenerativeAI(randomKey);
    
    // ใช้โมเดล gemini-2.5-flash ตามสั่ง
    // (หมายเหตุ: ถ้า Google ยังไม่เปิด 2.5 จริงๆ โค้ดจะ Error 404 พี่อาจต้องเปลี่ยนกลับเป็น 'gemini-1.5-flash')
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Analyze the brand name "${brandName}" for the target market "${country}".
      Focus on: cultural sensitivity, linguistic meaning, pronunciation issues, and slang.
      
      Return a JSON object with this exact structure:
      {
        "score": (number 0-100, where 100 is perfect/safe),
        "status": (string: "safe", "warning", or "risk"),
        "meaning": (string: brief explanation of meaning in local language),
        "pronunciation": (string: brief comment on ease of pronunciation),
        "suggestion": (string: specific advice or alternative idea)
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonResult = JSON.parse(text);

    return NextResponse.json(jsonResult);

  } catch (error: any) {
    console.error('Server Error:', error);
    
    if (error.message?.includes('not found') || error.message?.includes('404')) {
        return NextResponse.json({ error: `หาโมเดล "gemini-2.5-flash" ไม่เจอ (ลองเปลี่ยนเป็น gemini-1.5-flash แทน)` }, { status: 404 });
    }

    return NextResponse.json({ error: error.message || 'Unknown Error' }, { status: 500 });
  }
}