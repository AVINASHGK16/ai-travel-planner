/**
 * Calculates a group consensus and identifies conflicts based on an array of user preferences.
 * Each preference object should look like:
 * {
 *   name: "Alice",
 *   budget: "low", // 'low'|'medium'|'high' or 'budget'|'moderate'|'luxury'
 *   pace: "slow", // 'slow'|'moderate'|'fast'
 *   activityTypes: ["relaxation", "culture"] // array of strings
 * }
 */
function calculateConsensus(preferences) {
  if (!Array.isArray(preferences) || preferences.length === 0) {
    return {
      consensus: {
        budget: "moderate",
        pace: "moderate",
        topActivities: []
      },
      conflicts: ["No preferences provided."],
      rawFrequencies: {}
    };
  }

  const budgetMap = {
    low: 1, budget: 1,
    medium: 2, moderate: 2,
    high: 3, luxury: 3
  };

  const paceMap = {
    slow: 1,
    moderate: 2, medium: 2,
    fast: 3
  };

  const budgetReverseMap = { 1: "budget", 2: "moderate", 3: "luxury" };
  const paceReverseMap = { 1: "slow", 2: "moderate", 3: "fast" };

  let budgetSum = 0;
  let paceSum = 0;
  let budgetCount = 0;
  let paceCount = 0;

  const activityFreq = {};
  const conflicts = [];

  // Extremes tracking for conflict detection
  let minBudgetVal = Infinity;
  let maxBudgetVal = -Infinity;
  let minBudgetUser = "";
  let maxBudgetUser = "";

  let minPaceVal = Infinity;
  let maxPaceVal = -Infinity;
  let minPaceUser = "";
  let maxPaceUser = "";

  preferences.forEach(pref => {
    const name = pref.name || "Anonymous";

    // Budget aggregation
    if (pref.budget) {
      const budgetNorm = pref.budget.toString().toLowerCase();
      const val = budgetMap[budgetNorm];
      if (val !== undefined) {
        budgetSum += val;
        budgetCount++;
        
        if (val < minBudgetVal) {
          minBudgetVal = val;
          minBudgetUser = name;
        }
        if (val > maxBudgetVal) {
          maxBudgetVal = val;
          maxBudgetUser = name;
        }
      }
    }

    // Pace aggregation
    if (pref.pace) {
      const paceNorm = pref.pace.toString().toLowerCase();
      const val = paceMap[paceNorm];
      if (val !== undefined) {
        paceSum += val;
        paceCount++;

        if (val < minPaceVal) {
          minPaceVal = val;
          minPaceUser = name;
        }
        if (val > maxPaceVal) {
          maxPaceVal = val;
          maxPaceUser = name;
        }
      }
    }

    // Activities frequency count
    if (Array.isArray(pref.activityTypes)) {
      pref.activityTypes.forEach(act => {
        const normAct = act.trim().toLowerCase();
        activityFreq[normAct] = (activityFreq[normAct] || 0) + 1;
      });
    }
  });

  // Calculate averages (using round to get closest integer)
  const avgBudgetVal = budgetCount > 0 ? Math.round(budgetSum / budgetCount) : 2;
  const avgPaceVal = paceCount > 0 ? Math.round(paceSum / paceCount) : 2;

  const budgetConsensus = budgetReverseMap[avgBudgetVal] || "moderate";
  const paceConsensus = paceReverseMap[avgPaceVal] || "moderate";

  // Identify budget conflicts (low vs high)
  if (minBudgetVal !== Infinity && maxBudgetVal !== -Infinity && (maxBudgetVal - minBudgetVal) >= 2) {
    conflicts.push(`Budget conflict: ${minBudgetUser} prefers a low budget trip, while ${maxBudgetUser} wants a luxury trip.`);
  }

  // Identify pace conflicts (slow vs fast)
  if (minPaceVal !== Infinity && maxPaceVal !== -Infinity && (maxPaceVal - minPaceVal) >= 2) {
    conflicts.push(`Pace conflict: ${minPaceUser} prefers a slow pace, while ${maxPaceUser} wants a fast pace.`);
  }

  // Sort activities by frequency descending
  const sortedActivities = Object.keys(activityFreq).sort((a, b) => activityFreq[b] - activityFreq[a]);
  // Get top 3 activities
  const topActivities = sortedActivities.slice(0, 3);

  // If there's zero overlap in preferred activities among the group
  if (preferences.length > 1 && sortedActivities.length > 0) {
    const hasOverlap = Object.values(activityFreq).some(count => count > 1);
    if (!hasOverlap) {
      conflicts.push("Activity divergence: No common activities are shared. Every group member prefers different activities.");
    }
  }

  return {
    consensus: {
      budget: budgetConsensus,
      pace: paceConsensus,
      topActivities: topActivities
    },
    conflicts: conflicts,
    rawFrequencies: activityFreq
  };
}

module.exports = {
  calculateConsensus
};
