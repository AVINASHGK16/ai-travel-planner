const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { default: ollama } = require('ollama');
const { calculateConsensus } = require('./groupPreferenceEngine');
const { getForecast } = require('./services/weatherForecaster');
const { searchFlights, searchHotels } = require('./services/staysAndFlights');
const { generatePackingList } = require('./services/packingListGen');

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

// Endpoint to generate full unified travel itinerary
app.post('/api/generate-itinerary', async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, preferences } = req.body;
    
    if (!destination || !startDate || !endDate || !budget || !preferences) {
      return res.status(400).json({ error: "Missing required parameters in request body. Required: destination, startDate, endDate, budget, preferences." });
    }

    // 1. Calculate duration and month
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24))) || 3;
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[start.getMonth()] || "October";

    // 2. Run GroupPreferenceEngine
    const consensusResult = calculateConsensus(preferences);

    // 3. Run Weather Forecaster
    const weatherResult = getForecast(destination, month);

    // 4. Run Stays and Flights GDS
    const flights = searchFlights("NYC", destination, `${startDate} to ${endDate}`, budget);
    const hotels = searchHotels(destination, `${startDate} to ${endDate}`, budget);

    // 5. Run Packing List Generator
    const packingResult = generatePackingList(weatherResult.condition, durationDays);

    // 6. Generate detailed day-by-day itinerary via local Ollama
    const selectedHotel = hotels[0] || {};
    const selectedFlight = flights[0] || {};
    
    const prompt = `
You are an expert corporate travel planner.
Generate a highly detailed, curated, day-by-day travel itinerary optimized for business professionals and digital nomads.

Destination: ${destination}
Dates: ${startDate} to ${endDate} (${durationDays} days)
Consensus Budget: ${consensusResult.consensus.budget} (User requested: ${budget})
Consensus Pace: ${consensusResult.consensus.pace}
Top Activities: ${consensusResult.consensus.topActivities.join(', ') || 'General sightseeing'}

Weather Forecast: Temp: ${weatherResult.temperature}°C, Condition: "${weatherResult.condition}"

Boutique Stay Selected:
- Name: ${selectedHotel.name || 'Boutique stay'} (${selectedHotel.type || 'Standard'})
- Location: ${selectedHotel.location || 'Central location'}
- Room Type: ${selectedHotel.roomType || 'Standard room'}
- Price: $${selectedHotel.pricePerNight || 'N/A'}/night

Flight Details:
- Airline: ${selectedFlight.airline || 'Standard Airline'} (${selectedFlight.class || 'Economy'})
- Stops: ${selectedFlight.stops !== undefined ? selectedFlight.stops : '1'} (${selectedFlight.layover || 'Non-stop'})
- Duration: ${selectedFlight.duration || 'N/A'}
- Roundtrip Price: $${selectedFlight.price || 'N/A'}

Group Member Preference Conflicts to account for:
${consensusResult.conflicts.length > 0 ? consensusResult.conflicts.map(c => `- ${c}`).join('\n') : '- None'}

Please output a professional travel itinerary. For each day, outline:
1. Morning: A quiet work-friendly cafe, co-working space, or light networking/culture spot.
2. Afternoon: Group sightseeing or collaborative team activity matching their preferred activity list.
3. Evening: A premium dining suggestion or social option that respects their budget level.

Add professional tips on how they can handle the preference conflicts during the trip (e.g. scheduling separate free time, choosing moderate budget options, or moving at different speeds). Keep the tone upscale, modern, and practical. Return ONLY the markdown itinerary.
`;

    let itinerary = "";
    try {
      const response = await ollama.chat({
        model: 'llama3.2',
        messages: [{ role: 'user', content: prompt }]
      });
      itinerary = response.message.content;
    } catch (ollamaError) {
      console.warn("Ollama Llama 3.2 is offline or model not loaded. Generating fallback itinerary...", ollamaError.message);
      
      // Detailed fallback generation logic
      let daysContent = "";
      for (let i = 1; i <= durationDays; i++) {
        daysContent += `
### Day ${i}: Work & Explore
* **Morning (09:00 - 13:00):** Check-in at a local coffee hub or high-speed co-working space near ${selectedHotel.name || 'your stay'} for deep focus work.
* **Afternoon (14:00 - 18:00):** Group excursion: Engage in ${consensusResult.consensus.topActivities[0] || 'local sightseeing'} or explore the historical sights around ${destination}.
* **Evening (19:00 - 22:00):** Team dinner at a local boutique bistro matching the '${consensusResult.consensus.budget}' budget. Review the day's progress.
`;
      }
      
      itinerary = `
# Curated Itinerary: ${destination} (${durationDays} Days)
*Optimized for Digital Nomads & Professionals*

**Accommodations:** ${selectedHotel.name || 'Boutique Hotel'} in ${selectedHotel.location || 'Central district'}
**Inbound Flight:** ${selectedFlight.airline || 'Global Carrier'} (${selectedFlight.class || 'Economy'})

---
${daysContent}
---
### 🛠️ Conflict Resolution Guide
* Since there is a ${consensusResult.consensus.pace} pace consensus, ensure members who prefer faster paces have independent afternoon options.
* Respecting the '${consensusResult.consensus.budget}' budget consensus, dinners should be booked at high-value mid-tier bistros rather than heavy luxury options to prevent budgeting friction.
* *(Note: This is a structured fallback itinerary as the local Ollama instance was offline during request processing)*
`;
    }

    // Return everything to the frontend
    res.json({
      consensus: consensusResult,
      weather: weatherResult,
      flights: flights,
      hotels: hotels,
      packingList: packingResult,
      itinerary: itinerary
    });

  } catch (error) {
    console.error("Error generating full itinerary:", error);
    res.status(500).json({ error: "Internal server error. Could not generate travel itinerary." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
