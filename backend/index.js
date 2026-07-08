const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { default: ollama } = require('ollama');
const { calculateConsensus } = require('./groupPreferenceEngine');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Function to generate natural language summary of group vibe using Ollama
async function generateTravelVibeSummary(consensusData) {
  const prompt = `
You are an expert travel coordinator.
Analyze the following group travel consensus data and identified conflicts:

Consensus:
- Budget: ${consensusData.consensus.budget}
- Pace: ${consensusData.consensus.pace}
- Top Preferred Activities: ${consensusData.consensus.topActivities.join(', ') || 'None specified'}

Identified Conflicts:
${consensusData.conflicts.length > 0 ? consensusData.conflicts.map(c => `- ${c}`).join('\n') : 'No major conflicts.'}

Raw Activity Frequencies:
${JSON.stringify(consensusData.rawFrequencies, null, 2)}

Provide a natural language summary of the group's overall "travel vibe". Detail how they can balance their preferences, resolve the identified conflicts, and recommend how they should structure their itinerary. Keep the summary engaging, helpful, and concise (about 2-3 paragraphs).
`;

  try {
    const response = await ollama.chat({
      model: 'llama3.2',
      messages: [{ role: 'user', content: prompt }]
    });
    return response.message.content;
  } catch (error) {
    console.warn("Ollama Llama 3.2 communication warning/error:", error.message);
    return `[Fallback Vibe Summary] The group's consensus is a '${consensusData.consensus.budget}' budget with a '${consensusData.consensus.pace}' pace. The top activities are: ${consensusData.consensus.topActivities.join(', ') || 'none'}. ${consensusData.conflicts.length > 0 ? 'Note the following conflicts: ' + consensusData.conflicts.join(' ') : 'There are no major preferences conflicts.'} (Ollama connection error: ${error.message})`;
  }
}

app.get('/', (req, res) => {
  res.json({ message: "AI Travel Planner Backend API is running." });
});

// Endpoint to calculate consensus and get Ollama vibe summary
app.post('/api/group-consensus', async (req, res) => {
  try {
    const { preferences } = req.body;
    if (!preferences || !Array.isArray(preferences)) {
      return res.status(400).json({ error: "Invalid request. 'preferences' array is required in request body." });
    }

    const consensusData = calculateConsensus(preferences);
    const vibeSummary = await generateTravelVibeSummary(consensusData);

    res.json({
      ...consensusData,
      vibeSummary
    });
  } catch (error) {
    console.error("Error processing group consensus:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
