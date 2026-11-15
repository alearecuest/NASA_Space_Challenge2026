import { GoogleGenerativeAI } from "@google/generative-ai";
import type { FieldData } from "../types/field";
import type { RotationScore } from "../types/rotation";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY || "default-key"
);

interface AnalysisResult {
  summary: string;
  risks: string[];
  recommendations: string[];
  bestRotation: string;
  confidence: number;
}

export async function analyzeFieldConditions(
  fieldData: FieldData
): Promise<AnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert agronomist analyzing soil and climate data for a Uruguayan farm.

Field Data:
- Soil Moisture: ${fieldData.soilMoisture}% (Optimal: 40-60%)
- Rainfall (30 days): ${fieldData.rainfall}mm (Historical avg: ${fieldData.rainfallAvg}mm)
- Vegetation Health (NDVI): ${fieldData.ndvi.toFixed(2)} (Healthy: >0.6)
- Soil Type: ${fieldData.soilType}
- Temperature Average: ${fieldData.tempAvg}°C

Provide a JSON response with:
{
  "summary": "Brief assessment in English",
  "risks": ["risk1", "risk2"],
  "recommendations": ["action1", "action2"],
  "bestRotation": "rotation name",
  "confidence": 0-100
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return {
      summary: analysis.summary || "Analysis complete",
      risks: analysis.risks || [],
      recommendations: analysis.recommendations || [],
      bestRotation: analysis.bestRotation || "Cover crop",
      confidence: analysis.confidence || 75,
    };
  } catch (error) {
    console.error("AI Analysis error:", error);
    return {
      summary: "Analysis unavailable",
      risks: [],
      recommendations: ["Check field conditions manually"],
      bestRotation: "Current rotation",
      confidence: 0,
    };
  }
}

export async function predictCropSuitability(
  rotations: RotationScore[],
  fieldData: FieldData
): Promise<RotationScore[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const rotationList = rotations
      .map(
        (r) => `- Rotation ${r.rotationId}: Score ${r.overall}/100`
      )
      .join("\n");

    const prompt = `As an expert in crop adaptation to climate, re-score these rotations for a Uruguayan farm:

Current Conditions:
- Soil Moisture: ${fieldData.soilMoisture}%
- Annual Rainfall: ${fieldData.rainfall}mm
- NDVI: ${fieldData.ndvi}

Rotations to evaluate:
${rotationList}

Respond with JSON array: [{"rotationId": "R0", "scoreAdjustment": -5, "reason": "why"}]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return rotations;
    }

    const scores = JSON.parse(jsonMatch[0]);
    return rotations.map((rotation) => {
      const score = scores.find((s: any) => s.rotationId === rotation.rotationId);
      const adjustment = score?.scoreAdjustment || 0;
      return {
        ...rotation,
        overall: Math.max(0, Math.min(100, rotation.overall + adjustment)),
      };
    });
  } catch (error) {
    console.error("Crop suitability error:", error);
    return rotations;
  }
}

export async function generateAlerts(fieldData: FieldData): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate 1-2 urgent alerts for this farm condition in English:
- Soil Moisture: ${fieldData.soilMoisture}%
- Rainfall trend: ${fieldData.rainfall < fieldData.rainfallAvg ? "Below" : "Above"} average
- Temperature: ${fieldData.tempAvg}°C
- NDVI: ${fieldData.ndvi}

Respond with JSON array: ["alert1", "alert2"]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return [];
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Alert generation error:", error);
    return [];
  }
}
