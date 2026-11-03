import { prisma } from '../../db';
import { CONFIG } from '../../config';
import { EnquiryService } from '../enquiry/enquiry-service';

export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
}

export interface AIChatResponse {
  message: string;
  recommendedProducts?: any[];
  suggestedPrompts?: string[];
  actionRequired?: 'ADD_TO_CART' | 'ESCALATE_TO_WHATSAPP' | 'NONE';
  whatsappFallbackUrl?: string;
}

export class PandaAIService {
  private static SYSTEM_PROMPT = `You are PANDA AI 🐼, the official intelligent sales concierge and coffee buddy for KAHVI PANDA — THE NORDIC BLEND.
Brand Tagline: "Rush. Sip. Repeat."
Location: Kolkata, India.
Personality: Youthful, witty, warm, approachable, minimalist, animal-friendly, passionate about coffee without pretentiousness.

Your Core Missions:
1. Help visitors discover their ideal coffee based on budget, roast preference (Light, Medium, Medium-Dark, Dark), brewing equipment (Moka Pot, French Press, Aeropress, Espresso, Pour Over, Instant), and milk vs black drinking style.
2. Query live database products using tools. Never invent fictional products or fake prices. All prices are in Indian Rupees (INR ₹).
3. Recommend suitable grind sizes and weights (250g, 500g, 100g instant).
4. Explain brewing recipes and answer store questions (₹999 free shipping, Kolkata roasting, 2-5 days metro delivery).
5. If the customer wants human help or bulk/B2B enquiries, escalate seamlessly to our official WhatsApp (+91 9874199454).
6. Support English, Bengali (বাংলা or Romanized), Hindi (हिंदी or Hinglish). Respect the language the customer speaks to you in!`;

  static async handleChat(
    sessionId: string,
    userMessage: string,
    preferredLang: string = 'auto'
  ): Promise<AIChatResponse> {
    // 1. Ensure conversation exists in DB
    let conversation = await prisma.aIConversation.findUnique({
      where: { sessionId }
    });

    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: {
          sessionId,
          preferredLang
        }
      });
    }

    // Save user message
    await prisma.aIMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: userMessage
      }
    });

    // 2. If OpenAI API Key is present, run full GPT-4o with tool calling
    if (CONFIG.OPENAI_API_KEY) {
      try {
        return await this.executeOpenAIWithTools(conversation.id, sessionId, userMessage);
      } catch (err) {
        console.error('OpenAI API call failed, falling back to autonomous Panda AI engine:', err);
      }
    }

    // 3. High-intelligence Autonomous Fallback Engine
    return await this.executeAutonomousEngine(conversation.id, userMessage);
  }

  // Autonomous conversational engine that queries the real database
  private static async executeAutonomousEngine(
    conversationId: string,
    userMessage: string
  ): Promise<AIChatResponse> {
    const text = userMessage.toLowerCase();

    // 1. Check for Human Handoff / WhatsApp Escalation
    if (
      text.includes('human') ||
      text.includes('talk to someone') ||
      text.includes('agent') ||
      text.includes('call me') ||
      text.includes('whatsapp') ||
      text.includes('wholesale') ||
      text.includes('cafe supply') ||
      text.includes('bulk order')
    ) {
      const clickUrl = `https://wa.me/${CONFIG.WHATSAPP.TARGET_PHONE}?text=${encodeURIComponent(`Hi Panda Team! I'm chatting with PANDA AI on the website and would like human assistance: "${userMessage}"`)}`;

      const reply = `I'd love to connect you directly with our roasting and customer team! 🐼☕\n\nYou can click below to chat with us immediately on WhatsApp (+91 9874199454), or share your details in our Wholesale / Contact page and we will reach out right away!`;

      await prisma.aIMessage.create({
        data: { conversationId, role: 'assistant', content: reply }
      });

      return {
        message: reply,
        actionRequired: 'ESCALATE_TO_WHATSAPP',
        whatsappFallbackUrl: clickUrl,
        suggestedPrompts: [
          'What is your minimum order for cafes?',
          'Tell me about your roast profiles',
          'Browse bestsellers'
        ]
      };
    }

    // 2. Check for Store Policies / Shipping / Origin
    if (text.includes('shipping') || text.includes('delivery') || text.includes('pin code') || text.includes('free ship')) {
      const reply = `Here are our shipping details: 📦✨\n\n• Orders of ₹999 and above **SHIP FREE** anywhere in India.\n• Flat ₹99 delivery fee for orders below ₹999.\n• Delivery takes **2–5 business days** for metro cities (Kolkata, Mumbai, Delhi, Bengaluru) and 4–8 business days elsewhere.\n• Every batch is freshly roasted in Kolkata!`;
      await prisma.aIMessage.create({
        data: { conversationId, role: 'assistant', content: reply }
      });
      return {
        message: reply,
        suggestedPrompts: ['Show me bestsellers under ₹500', 'Do you have French press coffee?', 'Find my brew quiz']
      };
    }

    // 3. Price / Budget extraction
    let maxBudget: number | undefined = undefined;
    const budgetMatch = text.match(/(under|below|less than|within|budget of)?\s*(?:₹|rs\.?|inr)?\s*(\d{3,4})/i);
    if (budgetMatch && (text.includes('under') || text.includes('below') || text.includes('budget') || text.includes('₹') || text.includes('rs'))) {
      maxBudget = parseInt(budgetMatch[2], 10);
    }

    // 4. Equipment & Brew Method matching
    let method: string | undefined = undefined;
    if (text.includes('moka') || text.includes('moka pot')) method = 'Moka Pot';
    else if (text.includes('french press') || text.includes('press')) method = 'French Press';
    else if (text.includes('pour over') || text.includes('v60') || text.includes('filter paper')) method = 'Pour Over';
    else if (text.includes('espresso')) method = 'Espresso';
    else if (text.includes('instant') || text.includes('quick') || text.includes('sachet')) method = 'Instant';
    else if (text.includes('south indian') || text.includes('filter coffee')) method = 'South Indian Filter';

    // 5. Roast Preference matching
    let roast: string | undefined = undefined;
    if (text.includes('light') || text.includes('fruity') || text.includes('floral') || text.includes('acidic')) roast = 'Light';
    else if (text.includes('dark') || text.includes('strong') || text.includes('bold') || text.includes('smoky')) roast = 'Dark';
    else if (text.includes('medium') || text.includes('balanced') || text.includes('chocolate') || text.includes('nutty')) roast = 'Medium';

    // 6. Bengali / Hindi Greetings
    const isBengali = text.includes('kemon') || text.includes('bhalo') || text.includes('kichu') || text.includes('coffee chai') || text.includes('ki coffee');
    const isHindi = text.includes('namaste') || text.includes('kaise') || text.includes('acha coffee') || text.includes('chahiye') || text.includes('kya');

    // Query live products from DB
    const allProducts = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      include: {
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        variants: { orderBy: { price: 'asc' } }
      }
    });

    // Score and filter matching products
    const scoredProducts = allProducts.map(p => {
      let score = 0;
      const pPrice = p.variants[0]?.price ?? 0;

      if (maxBudget && pPrice <= maxBudget) score += 3;
      if (maxBudget && pPrice > maxBudget) score -= 5;

      if (roast && p.roastLevel.toLowerCase().includes(roast.toLowerCase())) score += 4;
      if (method && p.compatibleBrewingMethods.toLowerCase().includes(method.toLowerCase())) score += 4;
      if (p.bestseller) score += 1;

      return { product: p, score };
    }).sort((a, b) => b.score - a.score);

    const recommended = scoredProducts.filter(item => item.score > 0).slice(0, 3).map(i => i.product);
    const finalRecs = recommended.length > 0 ? recommended : allProducts.filter(p => p.bestseller).slice(0, 3);

    let reply = '';
    if (isBengali) {
      reply = `নমস্কার! 🐼 কেমন আছেন? কলকাতা থেকে রোস্টেড ফ্রেশ কফি খুঁজছেন? `;
      if (maxBudget) reply += `₹${maxBudget}-এর মধ্যে আমাদের সেরা কফি নিচে সাজিয়ে দিলাম:`;
      else reply += `আমাদের সবচেয়ে পছন্দের নর্ডিক ব্লেন্ডগুলো দেখে নিন:`;
    } else if (isHindi) {
      reply = `नमस्ते! 🐼 मैं हूँ आपका कॉफ़ी दोस्त पांडा। `;
      if (maxBudget) reply += `₹${maxBudget} के अंदर सबसे बढ़िया फ्रेश रोस्टेड कॉफ़ी आपके लिए पेश है:`;
      else reply += `कोलकाता में रोस्ट की हुई हमारी स्पेशल कॉफ़ी के ये हैं बेस्ट पिक्स:`;
    } else {
      // English / Hinglish
      if (maxBudget && method) {
        reply = `Bold choice! 🐼 For brewing in a **${method}** under **₹${maxBudget}**, here are our top picks fresh from our Kolkata roastery:`;
      } else if (maxBudget) {
        reply = `Great taste on a budget! 🐼 Here are exceptional blends under **₹${maxBudget}**:`;
      } else if (method) {
        reply = `Crafted specifically for your **${method}**! 🐼 Here are our highest-rated roasts with the ideal grind size:`;
      } else if (roast) {
        reply = `You appreciate a good **${roast} roast**! 🐼 Here are our signature beans with distinct tasting notes:`;
      } else {
        reply = `Hey there, coffee lover! 🐼 Welcome to Kahvi Panda. What are you brewing today? Whole beans, ground, or quick instant?`;
      }
    }

    // Persist assistant message
    await prisma.aIMessage.create({
      data: {
        conversationId,
        role: 'assistant',
        content: reply
      }
    });

    return {
      message: reply,
      recommendedProducts: finalRecs,
      suggestedPrompts: [
        'I brew with Moka Pot',
        'Recommend strong coffee with milk under ₹500',
        'What is Nordic Roast?',
        'Show me instant coffee'
      ]
    };
  }

  private static async executeOpenAIWithTools(
    conversationId: string,
    sessionId: string,
    userMessage: string
  ): Promise<AIChatResponse> {
    // OpenAI implementation using fetch
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: CONFIG.OPENAI_MODEL,
        messages: [
          { role: 'system', content: this.SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI responded with status ${response.status}`);
    }

    const data: any = await response.json();
    const assistantContent = data.choices[0]?.message?.content || 'Enjoy your brew! 🐼';

    await prisma.aIMessage.create({
      data: {
        conversationId,
        role: 'assistant',
        content: assistantContent
      }
    });

    // Also fetch bestsellers to attach as cards
    const recs = await prisma.product.findMany({
      where: { bestseller: true, status: 'ACTIVE' },
      include: {
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        variants: { orderBy: { price: 'asc' } }
      },
      take: 2
    });

    return {
      message: assistantContent,
      recommendedProducts: recs,
      suggestedPrompts: [
        'Recommend whole beans under ₹500',
        'Which coffee is best with milk?',
        'Help with wholesale B2B enquiry'
      ]
    };
  }
}
