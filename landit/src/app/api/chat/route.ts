import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages, difficulty, currentQuestion, totalQuestions } = await req.json();

    // System prompt to guide the AI interviewer
    const systemPrompt = `You are an expert technical interviewer conducting a ${difficulty} level software engineering interview. 

RULES:
- Ask ONE question at a time
- Current question: ${currentQuestion} of ${totalQuestions}
- Keep questions focused on: coding, algorithms, system design, and problem-solving
- Provide constructive feedback on answers
- Be encouraging but professional
- If this is question ${totalQuestions}, end with: "That completes our interview. Thank you for your time."

Difficulty Guidelines:
- Easy: Basic concepts, simple coding problems
- Medium: Intermediate algorithms, design patterns, moderate complexity
- Hard: Advanced algorithms, complex system design, optimization

After each answer:
1. Briefly acknowledge their response (1 sentence)
2. Ask the next relevant question
3. Keep responses concise (2-3 sentences for voice clarity)`;

    // Format messages - remove timestamp property
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: 'system', content: systemPrompt },
        ...formattedMessages
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;
    const isComplete = currentQuestion >= totalQuestions && 
                      aiResponse?.toLowerCase().includes('completes our interview');

    return NextResponse.json({
      message: aiResponse,
      isComplete
    });

  } catch (error: any) {
    console.error('Groq API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
