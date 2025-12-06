export async function generateJobDescriptionWithAI(
  jobTitle: string,
  company?: string,
  additionalInfo?: string
): Promise<{
  description: string;
  requirements: string[];
  skills: string[];
  experienceLevel: string;
  jobType: string;
}> {
  const prompt = `Generate a detailed job description for a ${jobTitle} position${
    company ? ` at ${company}` : ""
  }.

${additionalInfo ? `Additional context: ${additionalInfo}` : ""}

Provide:
1. Job description (2-3 paragraphs)
2. 5-7 requirements
3. 5-8 technical skills
4. Experience level
5. Job type

Format as JSON:
{
  "description": "...",
  "requirements": [...],
  "skills": [...],
  "experienceLevel": "mid",
  "jobType": "full-time"
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch
      ? JSON.parse(jsonMatch[0])
      : {
          description: "",
          requirements: [],
          skills: [],
          experienceLevel: "",
          jobType: ""
        };
  } catch (error) {
    console.error("AI generation error:", error);
    throw error;
  }
}