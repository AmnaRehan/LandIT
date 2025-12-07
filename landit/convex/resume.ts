import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api } from "./_generated/api";

// Generate upload URL
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Create resume record
export const createResume = mutation({
  args: {
    userId: v.string(),
    jobDescriptionId: v.string(),
    fileName: v.string(),
    fileSize: v.number(),
    fileType: v.string(),
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const resumeId = await ctx.db.insert("resumes", {
      ...args,
      uploadedAt: Date.now(),
      analyzed: false,
    });
    return resumeId;
  },
});

// Get resumes - FIXED with optional jobDescriptionId
export const getResumesByJob = query({
  args: {
    userId: v.string(),
    jobDescriptionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.jobDescriptionId) {
      return [];
    }

    const resumes = await ctx.db
      .query("resumes")
      .withIndex("by_user_and_job", (q) =>
        q.eq("userId", args.userId).eq("jobDescriptionId", args.jobDescriptionId!)
      )
      .order("desc")
      .collect();
    return resumes;
  },
});

// Save analysis
export const saveAnalysis = mutation({
  args: {
    resumeId: v.string(),
    analysisData: v.string(),
    score: v.number(),
    atsScore: v.number(),
    jobMatchScore: v.number(),
  },
  handler: async (ctx, args) => {
    const analysisId = await ctx.db.insert("resumeAnalyses", {
      ...args,
      analyzedAt: Date.now(),
    });

    // Mark resume as analyzed
    const resumes = await ctx.db
      .query("resumes")
      .collect();
    
    const resume = resumes.find(r => r._id === args.resumeId);
    if (resume) {
      await ctx.db.patch(resume._id, { analyzed: true });
    }

    return analysisId;
  },
});

export const analyzeResumeWithAI = action({
  args: {
    resumeId: v.string(),
    resumeText: v.string(),
    jobDescriptionId: v.string(),
  },
  handler: async (ctx: any, args: any): Promise<{ analysisId: string; result: any }> => {
    const jobDesc = await ctx.runQuery(api.jobDescriptions.getJobDescriptionById, {
      id: args.jobDescriptionId as any,
    });

    if (!jobDesc) throw new Error("Job description not found");

    // Enhanced cleaning function
    const clean = (s: string) => {
      if (!s || typeof s !== 'string') return '';
      return s
        .replace(/[^\x09\x0A\x0D\x20-\uD7FF\uE000-\uFFFD]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    };
    
    const resumeText = clean(args.resumeText).slice(0, 15000);
    const jobTitle = clean(jobDesc.title || "");
    const company = clean(jobDesc.company || "N/A");
    const description = clean(jobDesc.description || "");
    const skills = Array.isArray(jobDesc.skills) 
      ? jobDesc.skills.map((s: string) => clean(s)).filter(Boolean).join(", ")
      : "N/A";
    const requirements = Array.isArray(jobDesc.requirements)
      ? jobDesc.requirements.map((r: string) => clean(r)).filter(Boolean).join(", ")
      : "N/A";

    // Validate inputs
    if (!resumeText) {
      throw new Error("Resume text is empty");
    }

    const prompt = `You are a resume analyzer. Analyze the following resume against the job description.

Job Title: ${jobTitle}
Company: ${company}
Description: ${description}
Skills: ${skills}
Requirements: ${requirements}

Resume:
${resumeText}

CRITICAL: Return ONLY a valid JSON object. Do not include any text before or after the JSON. Do not use markdown code blocks.

Required JSON format:
{
  "score": 85,
  "atsCompatibility": {
    "score": 80,
    "issues": ["Issue 1", "Issue 2"],
    "recommendations": ["Recommendation 1", "Recommendation 2"]
  },
  "jobMatch": {
    "score": 75,
    "strengths": ["Strength 1", "Strength 2"],
    "gaps": ["Gap 1", "Gap 2"]
  },
  "writingFormatting": {
    "score": 90,
    "issues": ["Issue 1", "Issue 2"],
    "recommendations": ["Recommendation 1", "Recommendation 2"]
  },
  "contentAnalysis": {
    "keywords": ["Keyword1", "Keyword2", "Keyword3"]
  },
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}

IMPORTANT: 
- All strings must be properly escaped
- No trailing commas
- All arrays must have at least one item or be empty []
- Scores must be numbers between 0-100
- Return ONLY the JSON object, nothing else`;

    try {
      // Check if API key exists (from Convex environment)
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured in Convex. Run: npx convex env set GEMINI_API_KEY your_key");
      }

      // Use gemini-2.5-flash with v1beta (matching your working code)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 5000,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Gemini API Error Response:", errorBody);
        
        // Try to parse error details
        try {
          const errorJson = JSON.parse(errorBody);
          const errorMsg = errorJson?.error?.message || errorBody;
          throw new Error(`Gemini API (${response.status}): ${errorMsg}`);
        } catch {
          throw new Error(`Gemini API error ${response.status}: ${errorBody.slice(0, 200)}`);
        }
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

      console.log("Raw AI Response:", text);

      // Extract JSON from response with better cleaning
      let jsonStr = text;
      
      // Remove markdown code blocks if present
      jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Find the JSON object
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("No JSON found in response:", text);
        throw new Error("No JSON found in AI response");
      }

      let result;
      try {
        // Try to parse the JSON
        result = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Attempted to parse:", jsonMatch[0]);
        
        // Try to fix common JSON issues
        try {
          // Remove trailing commas
          const fixed = jsonMatch[0]
            .replace(/,(\s*[}\]])/g, '$1')
            // Fix unescaped quotes in strings
            .replace(/:\s*"([^"]*)"([^,}\]]*)/g, (match: string, p1: string, p2: string) => {
              if (p2.includes('"')) {
                return `: "${p1}${p2.replace(/"/g, '\\"')}"`;
              }
              return match;
            });
          
          result = JSON.parse(fixed);
          console.log("Successfully parsed after fixing");
        } catch (fixError) {
          console.error("Could not fix JSON:", fixError);
          throw new Error("Invalid JSON response from AI - could not parse or fix");
        }
      }

      if (!result || typeof result !== 'object') {
        console.error("Result is not an object:", result);
        throw new Error("Invalid JSON response from AI");
      }

      // Ensure all required fields exist
      const validatedResult = {
        score: result.score || 0,
        atsCompatibility: {
          score: result.atsCompatibility?.score || 0,
          issues: Array.isArray(result.atsCompatibility?.issues) 
            ? result.atsCompatibility.issues 
            : [],
          recommendations: Array.isArray(result.atsCompatibility?.recommendations)
            ? result.atsCompatibility.recommendations
            : [],
        },
        jobMatch: {
          score: result.jobMatch?.score || 0,
          strengths: Array.isArray(result.jobMatch?.strengths)
            ? result.jobMatch.strengths
            : [],
          gaps: Array.isArray(result.jobMatch?.gaps)
            ? result.jobMatch.gaps
            : [],
        },
        writingFormatting: {
          score: result.writingFormatting?.score || 0,
          issues: Array.isArray(result.writingFormatting?.issues)
            ? result.writingFormatting.issues
            : [],
          recommendations: Array.isArray(result.writingFormatting?.recommendations)
            ? result.writingFormatting.recommendations
            : [],
        },
        contentAnalysis: {
          keywords: Array.isArray(result.contentAnalysis?.keywords)
            ? result.contentAnalysis.keywords
            : [],
        },
        suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
      };

      const analysisId = await ctx.runMutation(api.resume.saveAnalysis, {
        resumeId: args.resumeId,
        analysisData: JSON.stringify(validatedResult),
        score: validatedResult.score,
        atsScore: validatedResult.atsCompatibility.score,
        jobMatchScore: validatedResult.jobMatch.score,
      });

      return { analysisId, result: validatedResult };
    } catch (err) {
      console.error("AI Analysis Error:", err);
      const errorMessage = (err instanceof Error) ? err.message : String(err);
      throw new Error("Analysis failed: " + errorMessage);
    }
  },
});

export const getAnalysisByResumeId = query({
  args: {
    resumeId: v.string(),
  },
  handler: async (ctx, args) => {
    const analysis = await ctx.db
      .query("resumeAnalyses")
      .withIndex("by_resume", (q) => q.eq("resumeId", args.resumeId))
      .first();
    return analysis;
  },
});