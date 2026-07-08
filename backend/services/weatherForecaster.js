// Simulated weather database for key destinations
const destinationsData = {
  tokyo: {
    winter: { temp: 6, cond: "Clear & Cold" },
    spring: { temp: 15, cond: "Mild & Sunny" },
    summer: { temp: 28, cond: "Hot & Humid" },
    autumn: { temp: 18, cond: "Cool & Pleasant" }
  },
  paris: {
    winter: { temp: 5, cond: "Overcast & Chilly" },
    spring: { temp: 14, cond: "Mild & Rainy" },
    summer: { temp: 23, cond: "Warm & Sunny" },
    autumn: { temp: 13, cond: "Cool & Breezy" }
  },
  newyork: {
    winter: { temp: 1, cond: "Cold & Snowy" },
    spring: { temp: 12, cond: "Breezy & Sunny" },
    summer: { temp: 26, cond: "Hot & Humid" },
    autumn: { temp: 15, cond: "Cool & Crisp" }
  },
  london: {
    winter: { temp: 6, cond: "Rainy & Damp" },
    spring: { temp: 11, cond: "Showers & Overcast" },
    summer: { temp: 19, cond: "Mild & Sunny" },
    autumn: { temp: 12, cond: "Cool & Windy" }
  },
  sydney: {
    // Southern Hemisphere - opposite seasons
    winter: { temp: 13, cond: "Cool & Sunny" }, // June-August
    spring: { temp: 18, cond: "Warm & Mild" },  // Sept-Nov
    summer: { temp: 24, cond: "Hot & Clear" },  // Dec-Feb
    autumn: { temp: 19, cond: "Mild & Pleasant" } // March-May
  }
};

function getSeason(monthStr, isSouthernHemisphere = false) {
  const month = monthStr.toLowerCase();
  const winterMonths = ["december", "dec", "january", "jan", "february", "feb"];
  const springMonths = ["march", "mar", "april", "apr", "may"];
  const summerMonths = ["june", "jun", "july", "jul", "august", "aug"];
  const autumnMonths = ["september", "sept", "sep", "october", "oct", "november", "nov"];

  let season = "spring";
  if (winterMonths.some(m => month.startsWith(m))) season = "winter";
  else if (springMonths.some(m => month.startsWith(m))) season = "spring";
  else if (summerMonths.some(m => month.startsWith(m))) season = "summer";
  else if (autumnMonths.some(m => month.startsWith(m))) season = "autumn";

  if (isSouthernHemisphere) {
    const opposites = {
      winter: "summer",
      spring: "autumn",
      summer: "winter",
      autumn: "spring"
    };
    return opposites[season];
  }
  return season;
}

function getForecast(destination, month) {
  if (!destination || !month) {
    return {
      destination: destination || "Unknown",
      month: month || "Unknown",
      temperature: 20,
      condition: "Mild",
      error: "Destination and month are required."
    };
  }

  const destClean = destination.trim().toLowerCase();
  const isSouthern = destClean.includes("sydney") || destClean.includes("australia") || destClean.includes("south africa") || destClean.includes("brazil") || destClean.includes("argentina") || destClean.includes("melbourne") || destClean.includes("cape town");

  const season = getSeason(month.toString(), isSouthern);

  // If in database
  const matchingKey = Object.keys(destinationsData).find(key => destClean.includes(key));
  if (matchingKey) {
    const data = destinationsData[matchingKey][season];
    return {
      destination: destination,
      month: month,
      temperature: data.temp,
      condition: data.cond
    };
  }

  // Consistent hashing fallback for other destinations
  let hash = 0;
  for (let i = 0; i < destClean.length; i++) {
    hash = destClean.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Map hash to base temperature offset (-10 to +15)
  const baseOffset = Math.abs(hash) % 25 - 10; 
  
  // Apply seasonal variance
  let seasonalTemp = 15;
  let condition = "Sunny";

  switch (season) {
    case "winter":
      seasonalTemp = 5 + baseOffset;
      condition = Math.abs(hash) % 2 === 0 ? "Rainy & Cold" : "Overcast & Snowy";
      break;
    case "spring":
      seasonalTemp = 15 + baseOffset;
      condition = Math.abs(hash) % 2 === 0 ? "Mild & Breezy" : "Pleasant & Clear";
      break;
    case "summer":
      seasonalTemp = 25 + baseOffset;
      condition = Math.abs(hash) % 3 === 0 ? "Hot & Humid" : (Math.abs(hash) % 3 === 1 ? "Sunny & Dry" : "Scattered Showers");
      break;
    case "autumn":
      seasonalTemp = 14 + baseOffset;
      condition = Math.abs(hash) % 2 === 0 ? "Cool & Windy" : "Overcast & Chilly";
      break;
  }

  // Ensure temperature stays in a reasonable range (-15 to 45)
  const finalTemp = Math.max(-15, Math.min(45, seasonalTemp));

  return {
    destination: destination,
    month: month,
    temperature: finalTemp,
    condition: condition
  };
}

module.exports = {
  getForecast
};
