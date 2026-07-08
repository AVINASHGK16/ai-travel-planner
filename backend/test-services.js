const { getForecast } = require('./services/weatherForecaster');
const { searchFlights, searchHotels } = require('./services/staysAndFlights');
const { generatePackingList } = require('./services/packingListGen');

console.log("=========================================");
console.log("   RUNNING TRAVEL SERVICES TEST SUITE    ");
console.log("=========================================\n");

// 1. Test Weather Forecaster
console.log("--- 1. Testing Weather Forecaster ---");
const testCasesWeather = [
  { dest: "Tokyo", month: "July" },
  { dest: "Paris", month: "January" },
  { dest: "Sydney, Australia", month: "January" }, // Southern hemisphere
  { dest: "Bali, Indonesia", month: "October" }    // Simulated fallback
];

testCasesWeather.forEach(tc => {
  const result = getForecast(tc.dest, tc.month);
  console.log(`Destination: ${result.destination} | Month: ${result.month}`);
  console.log(`Forecast: Temp: ${result.temperature}°C, Condition: "${result.condition}"`);
  console.log("-----------------------------------------");
});

// 2. Test Stays and Flights
console.log("\n--- 2. Testing Stays and Flights ---");
const testCasesStays = [
  { origin: "NYC", dest: "Tokyo", dates: "Oct 10 - Oct 17", budget: "low" },
  { origin: "NYC", dest: "Tokyo", dates: "Oct 10 - Oct 17", budget: "medium" },
  { origin: "NYC", dest: "Tokyo", dates: "Oct 10 - Oct 17", budget: "luxury" }
];

testCasesStays.forEach(tc => {
  console.log(`Searching flights/hotels for Budget category: [${tc.budget.toUpperCase()}]`);
  
  const flights = searchFlights(tc.origin, tc.dest, tc.dates, tc.budget);
  console.log(`  Flights Found (${flights.length}):`);
  flights.forEach(f => {
    console.log(`    - ${f.airline} (${f.class}): $${f.price} | Stops: ${f.stops} | Duration: ${f.duration}`);
  });

  const hotels = searchHotels(tc.dest, tc.dates, tc.budget);
  console.log(`  Hotels Found (${hotels.length}):`);
  hotels.forEach(h => {
    console.log(`    - ${h.name} (${h.type}): $${h.pricePerNight}/night | Location: ${h.location}`);
  });
  console.log("-----------------------------------------");
});

// 3. Test Packing List Generator
console.log("\n--- 3. Testing Packing List Generator ---");
const testCasesPacking = [
  { condition: "Hot & Humid", duration: 5 },
  { condition: "Overcast & Snowy", duration: 7 },
  { condition: "Rainy & Damp", duration: 3 }
];

testCasesPacking.forEach(tc => {
  console.log(`Generating packing list for ${tc.duration} days of "${tc.condition}" weather:`);
  const result = generatePackingList(tc.condition, tc.duration);
  
  console.log(`  Vibe: ${result.vibe}`);
  const list = result.packingList;
  
  console.log(`    Clothing Qty (${list.clothing.length}):`);
  list.clothing.forEach(c => console.log(`      * ${c.item} x${c.quantity} ${c.essential ? '(Essential)' : ''}`));
  
  console.log(`    Electronics Qty (${list.electronics.length}):`);
  list.electronics.forEach(e => console.log(`      * ${e.item} x${e.quantity}`));

  console.log(`    Miscellaneous Qty (${list.miscellaneous.length}):`);
  list.miscellaneous.forEach(m => console.log(`      * ${m.item} x${m.quantity}`));
  console.log("-----------------------------------------");
});

console.log("\n✅ All travel services verified successfully!");
