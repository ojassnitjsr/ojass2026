// /app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import * as cheerio from "cheerio";
import { unstable_cache as cache } from "next/cache";

// Import Mongoose Model
import Event, { IEvent } from "@/models/Event";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

// =========================================================
// CONFIG
// =========================================================
// const BASE_URL = process.env.BASE_URL || "https://ojass.org";
const BASE_URL = "https://ojass.org";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

// =========================================================
// LLM Setup
// =========================================================
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: GEMINI_API_KEY,
  temperature: 0.3,
  maxRetries: 2,
});

const session = {
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; OjassBot/1.0; +https://ojass.org)",
  },
};

// =========================================================
// STATIC CONTEXT
// =========================================================
const OJASS_CONTEXT = `
Ojass is the annual Techno-Management Fest of NIT Jamshedpur.
It is one of the largest fests in East India.
Theme: Future, Technology, Management, Innovation.
`;

// =========================================================
// SCRAPER (Cached + Safe)
// =========================================================
async function get_all_links(baseUrl: string): Promise<string[]> {
  try {
    const res = await fetch(baseUrl, {
      ...session,
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const text = await res.text();
    const $ = cheerio.load(text);
    const links = new Set<string>();

    $("a[href]").each((i, el) => {
      const href = $(el).attr("href")?.trim();
      if (!href) return;

      if (href.startsWith("http") && href.includes(baseUrl)) {
        links.add(href);
      } else if (href.startsWith("/")) {
        links.add(baseUrl.replace(/\/$/, "") + href);
      }
    });
    return Array.from(links);
  } catch (e) {
    console.warn(`Error fetching links: ${e}`);
    return [];
  }
}

const cached_scrape = cache(
  async (keyword_hash: string) => {
    console.log(`SCRAPING (cache key: ${keyword_hash})`);

    const keyword_map: Record<string, string[]> = {
      about: ["about", "ojass", "fest", "home", "theme", "history", "faq"],
      contact: ["contact", "team", "organizer", "email", "address", "reach"],
      event: ["event", "competition", "register", "participate", "rule", "prize", "schedule", "timeline"],
      sponsors: ["sponsor", "partner", "collaborat"],
      gallery: ["gallery", "photo", "image", "media"],
    };

    const keywords = keyword_map[keyword_hash] || keyword_map.event;
    return scrape_relevant_pages(BASE_URL, keywords);
  },
  ["ojass-scraper-v2"],
  { revalidate: 3600 }
);

async function scrape_relevant_pages(
  baseUrl: string,
  keywords: string[]
): Promise<string> {
  const all_links = await get_all_links(baseUrl);
  let relevant_links = [baseUrl];

  const filtered = all_links.filter((link) =>
    keywords.some((kw) => link.toLowerCase().includes(kw))
  );
  relevant_links = [...relevant_links, ...filtered];
  relevant_links = Array.from(new Set(relevant_links));

  const links_to_scrape = relevant_links.slice(0, 4);

  let scraped_text = "";
  for (const link of links_to_scrape) {
    try {
      const res = await fetch(link, { ...session, next: { revalidate: 3600 } });
      if (!res.ok) continue;
      const text = await res.text();
      const $ = cheerio.load(text);

      $('script').remove();
      $('style').remove();
      $('nav').remove();
      $('footer').remove();

      const text_blocks: string[] = [];
      $("p, li, h1, h2, h3, h4, h5, h6, table").each((i, el) => {
        const t = $(el).text().replace(/\s+/g, " ").trim();
        if (t.length > 20) text_blocks.push(t);
      });

      const page_content = text_blocks.join("\n");
      const page_snippet = page_content.substring(0, 2000);
      if (page_snippet) {
        scraped_text += `\n\n--- Source: ${link} ---\n${page_snippet}`;
      }
    } catch (e) {
      console.warn(`Skipping ${link}: ${e}`);
      continue;
    }
  }
  return scraped_text.trim() || "No relevant info found on website.";
}

// =========================================================
// DATABASE HELPERS
// =========================================================
function extract_keywords(query: string): string[] {
  const stop_words = new Set([
    "tell", "me", "about", "related", "the", "and", "or", "in", "for",
    "what", "is", "are", "how", "to", "of", "all", "list", "show", "give"
  ]);
  const words = query.toLowerCase().match(/\b[a-zA-Z0-9]{3,}\b/g) || [];
  return words.filter((w) => !stop_words.has(w));
}

function format_event(ev: IEvent): string {
  // Safe accessors with fallbacks
  const head = ev.event_head || { name: 'N/A', Phone: 'N/A' };
  const prizes = ev.prizes || { total: 'N/A', winner: 'N/A' };

  const team_text = ev.isTeamEvent
    ? `Team Size: ${ev.teamSizeMin} - ${ev.teamSizeMax}`
    : `Individual Event`;

  const rules_text = Array.isArray(ev.rules) ? ev.rules.join("\n- ") : "Not specified";
  const details_text = Array.isArray(ev.details) ? ev.details.join("\n") : ev.description;
  const redirect_url = ev.redirect || '/events';

  return `### ${ev.name}
- **Type:** ${team_text}
- **Prizes:** Total: ${prizes.total} (1st: ${prizes.winner})
- **Contact:** ${head.name} (${head.Phone})
- **Link:** https://ojass.org${redirect_url}
- **Rulebook:** ${ev.rulebookurl || 'N/A'}
- **Description:** ${ev.description}
- **Details:**
${details_text}
- **Rules:**
- ${rules_text}`;
}

async function event_info_tool(query: string): Promise<string> {
  await connectToDatabase();
  const keywords = extract_keywords(query);

  const synonymMap: Record<string, string[]> = {
    contest: ["event", "competition"],
    coding: ["computer", "programming", "code"],
    robotics: ["robot", "bot", "robo"],
    quiz: ["trivia"],
  };

  const expanded = new Set(keywords);
  keywords.forEach(k => {
    if (synonymMap[k]) synonymMap[k].forEach(s => expanded.add(s));
  });

  const uniqKeywords = Array.from(expanded);

  // Partial matches for generic terms
  const regexPattern = uniqKeywords.length
    ? uniqKeywords.map((k) => `\\b${k}`).join("|")
    : query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape if empty

  // Query using Mongoose Model Structure
  const primaryQuery = {
    $or: [
      { name: { $regex: regexPattern, $options: "i" } },
      { description: { $regex: regexPattern, $options: "i" } },
      { "event_head.name": { $regex: regexPattern, $options: "i" } },
      // Note: Category and Tags do not exist on the current Event model
    ],
  };

  const results = await Event.find(primaryQuery).limit(5).lean();

  if (results.length > 0) {
    return results.map(e => format_event(e as unknown as IEvent)).join("\n\n");
  }

  // Fallback: If no specific name matched, but user asked for "events" generally
  if (query.toLowerCase().match(/event|competition|contest|list|show|what/)) {
    const all_events = await Event.find({}, 'name description').limit(20).lean();
    if (all_events.length > 0) {
      return "**Found these events:**\n" + all_events.map((e) => `- ${e.name}`).join("\n");
    }
  }

  return "No matching event found in the database.";
}

async function website_info_tool(query: string): Promise<string> {
  const query_lower = query.toLowerCase();
  if (query_lower.match(/sponsor|partner/)) return cached_scrape("sponsors");
  if (query_lower.match(/contact|team|email|call|reach/)) return cached_scrape("contact");
  if (query_lower.match(/about|ojass|history|theme|what is/)) return cached_scrape("about");
  return cached_scrape("event");
}

async function hybrid_tool(query: string) {
  const [db_data, web_data] = await Promise.all([
    event_info_tool(query),
    website_info_tool(query),
  ]);
  return { db_data, web_data };
}

// =========================================================
// PROMPTS
// =========================================================
const common_instructions = `
You are OjassBot, the intelligent assistant for Ojass 2026, NIT Jamshedpur.
${OJASS_CONTEXT}

Tone: Direct, professional, and concise. 
IMPORTANT: Do NOT start your response with greetings (e.g., "Greetings", "Hello", "Hi") unless the user explicitly greeted you first. Just answer the question immediately.
Format: Use Markdown (bold, lists) for readability.
Avoid: "As an AI", "I think", flowery intros.
`;

const hybrid_prompt = PromptTemplate.fromTemplate(
  `${common_instructions}

You have access to two data sources:

## 1. DATABASE (Verified Event Info)
{db_context}

## 2. WEBSITE (General Info, Teams, Policies)
{web_context}

Question: {input}

Instructions:
- Synthesize an answer using both sources.
- Prioritize Database for event rules/fees/dates.
- Use Website for general queries, contacts, or if DB is empty.
- If unsure, say you don't have that info yet.
- Suggest checking the official website if data seems incomplete.
- BE CONCISE.

Answer:`
);

const smalltalk_prompt = PromptTemplate.fromTemplate(
  `${common_instructions}

The user said: "{input}"

Reply in a friendly, engaging way. If they ask about you, say you are the Ojass System Bot.`
);

// Chains
const hybrid_chain = hybrid_prompt.pipe(llm);
const smalltalk_chain = smalltalk_prompt.pipe(llm);

// Router
const RouteDecision = z.object({
  route: z.enum(["database_lookup", "smalltalk"]),
});

const router_prompt = PromptTemplate.fromTemplate(
  `Classify the following user query.

Query: "{input}"

Categories:
- database_lookup: Any question about events, prizes, schedule, team, sponsors, contact, "what is ojass", "how to register", etc. basically anything requesting substantial info.
- smalltalk: Greetings, "hi", "thanks", "who are you", generic chit-chat.

Return JSON: {{"route": "..."}}`
);

const router_chain = router_prompt.pipe(llm.withStructuredOutput(RouteDecision));

// =========================================================
// API HANDLER
// =========================================================
export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string")
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });

    const user_input = message.trim();

    const { route } = await router_chain.invoke({ input: user_input });
    console.log(`[AI Search] Route: ${route} | Query: ${user_input}`);

    let responseText = "";

    if (route === "smalltalk") {
      const res = await smalltalk_chain.invoke({ input: user_input });
      responseText = res.content.toString();
    } else {
      const { db_data, web_data } = await hybrid_tool(user_input);
      const res = await hybrid_chain.invoke({
        db_context: db_data,
        web_context: web_data,
        input: user_input,
      });
      responseText = res.content.toString();
    }

    // Clean up unnecessary markdown escapes if any (LangChain sometimes does this)
    responseText = responseText.replace(/\\n/g, "\n");

    return NextResponse.json({ reply: responseText });

  } catch (e: unknown) {
    console.error("Chat Error:", e);
    return NextResponse.json(
      { error: "System malfunction. Please try again." },
      { status: 500 }
    );
  }
}