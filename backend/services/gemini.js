const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({});

const extractInformation = async (query) => {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a travel assistant. Based on the following user request, extract the useful information in JSON format: ${query}.`,
    });

    console.log("OpenAI response:", response);

    const infoText = response.candidates[0].content.parts[0].text
        .replace(/^```json\n/, "")
        .replace(/\n```$/, "");
    return infoText;
};

const generateTravelRecommendation = async (infoData) => {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Based on the following information ${infoData} make a travel recommendation in a structured JSON format with following fields:
            1. venue_name
            2. location
            3. estimated_cost
            4. justification`,
    });
    const recommendationText = response.candidates[0].content.parts[0].text;
    const recommendationData = JSON.parse(
        recommendationText.replace(/^```json\n/, "").replace(/\n```$/, ""),
    );
    return recommendationData;
};

module.exports = {
    extractInformation,
    generateTravelRecommendation,
};
