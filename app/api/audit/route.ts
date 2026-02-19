// app/api/audit/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import puppeteer from 'puppeteer'; // พระเอกคนใหม่

export async function POST(req: Request) {
  let browser;
  try {
    const { url, targetCountry, keyword } = await req.json();

    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    // --- 1. REAL BROWSER SCRAPING (Puppeteer) ---
    // เปิด Browser จำลองขึ้นมา
    browser = await puppeteer.launch({
      headless: true, // ไม่ต้องโชว์หน้าต่าง Chrome
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // จำเป็นสำหรับบาง Server
    });
    
    const page = await browser.newPage();
    
    // ตั้งค่า User Agent ให้เนียนว่าเป็นคนใช้ Chrome จริงๆ
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36');

    // ไปที่ URL แล้วรอจนกว่า Network จะนิ่ง (โหลดเสร็จจริง)
    // timeout 30 วิ กันค้าง
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // ดึงข้อมูล
    const pageData = await page.evaluate(() => {
      // โค้ดตรงนี้รันในหน้าเว็บเป้าหมายเหมือน Console ใน Chrome
      const title = document.title;
      // ดึง meta description
      const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      // ดึง H1
      const h1 = document.querySelector('h1')?.innerText || '';
      // ดึง Body text (เอาเฉพาะที่คนมองเห็น ไม่เอา script)
      const bodyText = document.body.innerText.substring(0, 10000); 
      
      return { title, metaDesc, h1, bodyText };
    });

    // ปิด Browser (สำคัญมาก ไม่งั้น Server แรมหมด)
    await browser.close();

    // --- 2. AI ANALYZE (GEMINI) ---
    // สุ่ม Key เหมือนเดิม
    const allKeys = process.env.GEMINI_API_KEYS?.split(',') || [];
    const randomKey = allKeys[Math.floor(Math.random() * allKeys.length)]?.trim();
    
    if (!randomKey) throw new Error("No API Key found");

    const genAI = new GoogleGenerativeAI(randomKey);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Act as an expert "Cultural SEO Audit AI". 
      Analyze the following website content for the target audience in "${targetCountry}".
      Target Keyword: "${keyword || "General"}"
      
      Website Data (Scraped via Headless Browser):
      - Title: ${pageData.title}
      - Description: ${pageData.metaDesc}
      - H1: ${pageData.h1}
      - Content Snippet: ${pageData.bodyText}

      Analyze based on:
      1. Cultural Resonance: Does the tone/language fit ${targetCountry}?
      2. SEO Structure.
      3. Risk Detection (Offensive/Taboo topics in ${targetCountry}).
      
      Return JSON format ONLY:
      {
        "overallScore": number (0-100),
        "culturalFitScore": number (0-100),
        "sentiment": "Positive" | "Neutral" | "Negative",
        "summary": "Short executive summary",
        "goodPoints": ["point 1", "point 2"],
        "improvements": ["fix 1", "fix 2"],
        "culturalInsights": ["insight 1 (specific to ${targetCountry})"]
      }
    `;

    const result = await model.generateContent(prompt);
    const analysisJson = JSON.parse(result.response.text());

    return NextResponse.json({
        success: true,
        scrapedData: { 
            title: pageData.title, 
            h1: pageData.h1, 
            description: pageData.metaDesc 
        }, 
        analysis: analysisJson
    });

  } catch (error: any) {
    console.error('Audit Error:', error);
    if (browser) await browser.close(); // กันเหนียวปิดอีกรอบถ้า Error
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}