import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import axios from "axios";
import * as cheerio from "cheerio";
import { store } from '../store';
import { setRateLimited } from '../store/slices/configSlice';

class AIRouter {
  constructor() {
    this.gemini = null;
    this.anthropic = null;
    this.config = null;
  }

  init(config) {
    this.config = config;
    if (config.geminiKey) {
      this.gemini = new GoogleGenerativeAI(config.geminiKey);
    }
    if (config.anthropicKey) {
      this.anthropic = new Anthropic({
        apiKey: config.anthropicKey,
        dangerouslyAllowBrowser: true,
      });
    }
  }

  async extractTextFromUrl(url) {
    try {
      const { data } = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const $ = cheerio.load(data);
      $('script, style, nav, footer, header').remove();
      let text = $('main').text() || $('article').text() || $('body').text();
      text = text.replace(/\s+/g, ' ').trim();
      return text.substring(0, 5000);
    } catch (error) {
      throw new Error("EXTRACTION_FAILED");
    }
  }

  /**
   * Unified AI Caller with Dynamic Fallback & Rate Limit Capture
   */
  async callAI(prompt, systemInstruction = "") {
    let mode = this.config.preferredModel;
    let usingFallback = false;

    // Phase 1: Dynamic Fallback Analysis
    if (mode.includes('claude') && !this.config.anthropicKey) {
      if (this.config.geminiKey) {
        mode = 'gemini-2.5-flash'; // Confirmed active fallback
        usingFallback = true;
        window.dispatchEvent(new CustomEvent('ai-toast', { detail: 'Using Gemini fallback (Claude key missing)' }));
      } else {
        throw new Error("KEY_REQUIRED_CLAUDE");
      }
    }

    if (mode.includes('gemini') && !this.config.geminiKey) {
      if (this.config.anthropicKey) {
        mode = 'claude-3-haiku-20240307'; // Fast fallback
        usingFallback = true;
        window.dispatchEvent(new CustomEvent('ai-toast', { detail: 'Using Claude fallback (Gemini key missing)' }));
      } else {
        throw new Error("KEY_REQUIRED_GEMINI");
      }
    }

    // Phase 2: Execution
    try {
      if (mode.includes('gemini')) {
        const genModel = this.gemini.getGenerativeModel({ model: mode });
        const result = await genModel.generateContent(
          systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt
        );
        const response = result.response.text();
        return response.replace(/```json|```/gi, "").trim();
      } 
      
      if (mode.includes('claude')) {
        const response = await this.anthropic.messages.create({
          model: mode,
          max_tokens: 4096,
          system: systemInstruction,
          messages: [{ role: "user", content: prompt }],
        });
        return response.content[0].text;
      }
    } catch (error) {
      // 429 Capture
      if (error.status === 429 || error.message?.includes('429')) {
        store.dispatch(setRateLimited(true));
        throw new Error("RATE_LIMIT_EXCEEDED");
      }
      throw error;
    }
  }

  async scanJob(text) {
    const system = `Expert HR Fraud Investigator. Analyze job vacancy. JSON ONLY: score, verdict, flags, recommendation.`;
    const result = await this.callAI(text, system);
    return JSON.parse(result);
  }

  async analyzeCV(cvText, jdText) {
    const system = "Expert Career Coach. Analyze Match. Return JSON: matchScore, strengths(array), gaps(array), preppMode(string).";
    const prompt = `CV: ${cvText}\nJD: ${jdText}`;
    const result = await this.callAI(prompt, system);
    return JSON.parse(result);
  }

  async polishSection(content, context) {
    const system = "Linguistic Excellence Engine. Polish the resume section. Use impactful action verbs.";
    const prompt = `Context: ${context}\nContent: ${content}`;
    return await this.callAI(prompt, system);
  }

  async generateCareerRoadmap(profile, targetJD) {
    const system = "Act as a Strategic Career Mentor. Compare the user profile to the target job and identify the 5 most critical milestones to bridge the gap.";
    const prompt = `Return a JSON array of 5 objects strictly. Structure: [{ "title": "...", "description": "...", "suggestedProject": "...", "estimatedWeeks": 2 }]

Constraint: Do not include any text outside of the JSON array. Output must be valid, parseable JSON.

User Profile:
${JSON.stringify(profile)}

Target Job Description:
${targetJD}`;
    
    // Use the specific Gemma API key if available for this specific call, otherwise fallback to existing config
    const apiKey = import.meta.env.VITE_GEMMA_API_KEY || this.config?.geminiKey;
    if (!apiKey) {
      throw new Error("Missing Gemma API Key");
    }
    const tempGemini = new GoogleGenerativeAI(apiKey);
    const genModel = tempGemini.getGenerativeModel({ model: 'gemini-2.5-flash' }); // Or preferred model
    const result = await genModel.generateContent(`${system}\n\n${prompt}`);
    const response = result.response.text();
    return JSON.parse(response.replace(/```json|```/gi, "").trim());
  }
}

export const aiRouter = new AIRouter();
export default aiRouter;
