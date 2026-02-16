
import { geminiService } from './geminiService';

interface DailyContent {
    date: string;
    verse: { text: string; source: string; reflection: string };
    challenge: { title: string; description: string; icon: string; points: number };
    tip: string;
    generatedAt: number;
}

const CACHE_KEY = 'daily_gemini_content';

function getTodayKey(): string {
    return new Date().toISOString().split('T')[0];
}

function getCachedContent(): DailyContent | null {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const cached: DailyContent = JSON.parse(raw);
        if (cached.date === getTodayKey()) return cached;
        return null;
    } catch {
        return null;
    }
}

function parseJSON(text: string): any {
    // Try to extract JSON from markdown code blocks or raw text
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } catch {
            return null;
        }
    }
    return null;
}

const DAILY_PROMPT = `أنت مساعد إسلامي متخصص في تربية اللسان. أنشئ محتوى يومي جديد بصيغة JSON فقط (بدون أي كلام إضافي):

{
  "verse": {
    "text": "آية قرآنية عن اللسان أو الكلام الطيب أو آفات الكلام (النص الكامل بالتشكيل)",
    "source": "اسم السورة ورقم الآية",
    "reflection": "تدبر بسيط بالعامية المصرية في 2-3 جمل يربط الآية بالحياة اليومية"
  },
  "challenge": {
    "title": "عنوان تحدي يومي إبداعي مختلف (4-6 كلمات)",
    "description": "وصف التحدي بالعامية المصرية البسيطة في جملتين",
    "icon": "إيموجي واحد مناسب",
    "points": رقم بين 10 و 50
  },
  "tip": "نصيحة عملية قصيرة بالعامية المصرية عن حفظ اللسان (جملة واحدة فقط)"
}

مهم: أرجع JSON صالح فقط بدون تنسيق markdown أو كلام إضافي. اختر آية مختلفة كل مرة.`;

export async function fetchDailyContent(): Promise<DailyContent | null> {
    // Check cache first
    const cached = getCachedContent();
    if (cached) return cached;

    try {
        const response = await geminiService.generateResponse(DAILY_PROMPT);
        if (!response) return null;

        const parsed = parseJSON(response);
        if (!parsed || !parsed.verse || !parsed.challenge || !parsed.tip) {
            console.warn('Daily content parse failed:', response);
            return null;
        }

        const content: DailyContent = {
            date: getTodayKey(),
            verse: parsed.verse,
            challenge: parsed.challenge,
            tip: parsed.tip,
            generatedAt: Date.now(),
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(content));
        return content;
    } catch (error) {
        console.error('Failed to fetch daily content:', error);
        return null;
    }
}

// Fallback static content when API is unavailable
export function getFallbackContent(): DailyContent {
    const fallbacks: Omit<DailyContent, 'date' | 'generatedAt'>[] = [
        {
            verse: { text: "وَقُولُوا لِلنَّاسِ حُسْنًا", source: "سورة البقرة - آية 83", reflection: "ربنا بيقولك كلم الناس كلام حلو، مش بس المسلمين.. كل الناس. الكلمة الحلوة مبتكلفكش حاجة بس بتعمل فرق كبير." },
            challenge: { title: "جبر خاطر مجهول", description: "اكتب رسالة تشجيع لحد متعرفوش في التعليقات أو أونلاين", icon: "💌", points: 25 },
            tip: "لو حسيت إنك هتقول كلمة وحشة، عد لـ 5 في سرك وخد نفس، هتلاقي الرغبة اختفت."
        },
        {
            verse: { text: "أَلَمْ تَرَ كَيْفَ ضَرَبَ اللَّهُ مَثَلًا كَلِمَةً طَيِّبَةً كَشَجَرَةٍ طَيِّبَةٍ أَصْلُهَا ثَابِتٌ وَفَرْعُهَا فِي السَّمَاءِ", source: "سورة إبراهيم - آية 24", reflection: "الكلمة الحلوة زي الشجرة، بتكبر وتثمر وبتفضل عايشة. قول كلمة طيبة النهاردة وشوف أثرها بكرة." },
            challenge: { title: "ساعة بلا شكوى", description: "حاول تعدي ساعة كاملة من غير ما تشتكي من أي حاجة", icon: "🤫", points: 15 },
            tip: "قبل ما تتكلم عن حد، اسأل نفسك: هل لو هو سامعني دلوقتي كنت هقول نفس الكلام؟"
        },
        {
            verse: { text: "يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَقُولُوا قَوْلًا سَدِيدًا", source: "سورة الأحزاب - آية 70", reflection: "القول السديد يعني الكلام الصح اللي يروح في مكانه الصح. لما كلامك يكون دغري، حياتك كلها بتستقيم." },
            challenge: { title: "مدح صادق لـ ٣ أشخاص", description: "امدح 3 أشخاص مختلفين النهاردة بصفة حقيقية فيهم", icon: "🌸", points: 20 },
            tip: "السكوت مش ضعف، السكوت ده قوة وتمرين يومي على الوقار."
        }
    ];

    // Pick based on day of year for variety
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const fallback = fallbacks[dayOfYear % fallbacks.length];

    return {
        ...fallback,
        date: getTodayKey(),
        generatedAt: Date.now(),
    };
}
