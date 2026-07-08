const { calculateConsensus } = require('./groupPreferenceEngine');

// Mock data
const mockPreferences = [
  {
    name: "Alice",
    budget: "low",
    pace: "slow",
    activityTypes: ["relaxation", "culture", "sightseeing"]
  },
  {
    name: "Bob",
    budget: "medium",
    pace: "moderate",
    activityTypes: ["sightseeing", "foodie", "relaxation"]
  },
  {
    name: "Charlie",
    budget: "high",
    pace: "fast",
    activityTypes: ["adventure", "nightlife", "sightseeing"]
  }
];

console.log("=== Running GroupPreferenceEngine Consensus Test ===");
const consensusResult = calculateConsensus(mockPreferences);
console.log("Input Preferences Count:", mockPreferences.length);
console.log("\nCalculated Consensus:");
console.log(JSON.stringify(consensusResult.consensus, null, 2));

console.log("\nIdentified Conflicts:");
if (consensusResult.conflicts.length > 0) {
  consensusResult.conflicts.forEach(c => console.log(`- ${c}`));
} else {
  console.log("No conflicts identified.");
}

console.log("\nRaw Frequencies:");
console.log(JSON.stringify(consensusResult.rawFrequencies, null, 2));

// Test verification
const expectedBudget = "moderate";
const expectedPace = "moderate";
const expectedTopActivity = "sightseeing"; // should have 3 votes

let testsPassed = true;

if (consensusResult.consensus.budget !== expectedBudget) {
  console.error(`❌ Test Failed: Expected budget consensus '${expectedBudget}', got '${consensusResult.consensus.budget}'`);
  testsPassed = false;
}
if (consensusResult.consensus.pace !== expectedPace) {
  console.error(`❌ Test Failed: Expected pace consensus '${expectedPace}', got '${consensusResult.consensus.pace}'`);
  testsPassed = false;
}
if (!consensusResult.consensus.topActivities.includes(expectedTopActivity)) {
  console.error(`❌ Test Failed: Expected topActivities to include '${expectedTopActivity}'`);
  testsPassed = false;
}
if (consensusResult.conflicts.length !== 2) {
  console.error(`❌ Test Failed: Expected exactly 2 conflicts (budget and pace), got ${consensusResult.conflicts.length}`);
  testsPassed = false;
}

if (testsPassed) {
  console.log("\n✅ All GroupPreferenceEngine logic tests passed!");
} else {
  console.log("\n❌ Some GroupPreferenceEngine logic tests failed.");
}

// Optional Ollama communication test
async function testOllama() {
  console.log("\n=== Testing Ollama Llama 3.2 Integration ===");
  console.log("Attempting to connect to local Ollama Llama 3.2 instance...");
  const { default: ollama } = require('ollama');
  try {
    const start = Date.now();
    const response = await ollama.chat({
      model: 'llama3.2',
      messages: [{ role: 'user', content: 'Say hello and tell me you are ready!' }]
    });
    console.log(`Response received in ${((Date.now() - start) / 1000).toFixed(2)}s:`);
    console.log(response.message.content);
    console.log("✅ Ollama Llama 3.2 integration works perfectly!");
  } catch (error) {
    console.warn("⚠️ Ollama offline or Llama 3.2 model not loaded. (This is normal if Ollama is not running on this machine)");
    console.warn("Error message:", error.message);
  }
}

testOllama();
