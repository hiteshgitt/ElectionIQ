import { NextResponse } from 'next/server';
import { generateElectionJourney } from '@/ai/vertex';
import { checkEligibility } from '@/utils/eligibility';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { age, isFirstTimeVoter, state } = body;

    if (age === undefined || age === null || !state) {
      return NextResponse.json({ error: "Missing required fields: age or state" }, { status: 400 });
    }

    const ageNum = parseInt(age, 10);
    
    // 1. Prioritize Logic before AI
    const eligibilityResult = checkEligibility({ age: ageNum, isFirstTimeVoter, state });

    if (!eligibilityResult.isEligible) {
      // If logic says not eligible, return immediately without calling AI
      return NextResponse.json({
        success: true,
        data: {
          eligibility: eligibilityResult.reason,
          explanation: eligibilityResult.educationalInfo,
          steps: [],
          timeline: [],
          tips: ["Learn about your local representatives.", "Understand the role of the Election Commission of India.", "Prepare for when you turn 18!"]
        }
      });
    }

    // 2. If eligible, call AI for personalized journey
    const aiResponse = await generateElectionJourney(ageNum, isFirstTimeVoter, state);

    if (!aiResponse) {
      return NextResponse.json({ error: "Failed to generate AI response. Check server logs or API key." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: aiResponse });

  } catch (error) {
    console.error("Assistant API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
