/**
 * Simulates a flight GDS search returning realistic flight options based on parameters.
 */
function searchFlights(origin, destination, dates, budget) {
  const normBudget = (budget || "moderate").toString().toLowerCase();

  const flightOptions = {
    budget: [
      {
        id: "FL-B-101",
        airline: "JetSwift Airlines (Budget Carrier)",
        flightNumber: "JS-492",
        class: "Economy (No Carry-on)",
        stops: 2,
        layover: "4h 15m in Frankfurt",
        duration: "14h 30m",
        price: 280,
        departureTime: "06:15 AM",
        arrivalTime: "08:45 PM"
      },
      {
        id: "FL-B-102",
        airline: "FlyEco Airways",
        flightNumber: "FE-810",
        class: "Economy Standard",
        stops: 1,
        layover: "2h 45m in Warsaw",
        duration: "11h 15m",
        price: 395,
        departureTime: "11:30 PM",
        arrivalTime: "10:45 AM (+1)"
      }
    ],
    moderate: [
      {
        id: "FL-M-201",
        airline: "Global Connect Airlines",
        flightNumber: "GC-108",
        class: "Main Cabin Economy (Includes Carry-on)",
        stops: 1,
        layover: "1h 30m in Munich",
        duration: "9h 45m",
        price: 750,
        departureTime: "10:00 AM",
        arrivalTime: "07:45 PM"
      },
      {
        id: "FL-M-202",
        airline: "National Airways",
        flightNumber: "NA-225",
        class: "Economy Comfort Plus",
        stops: 0,
        layover: "Non-stop",
        duration: "8h 15m",
        price: 920,
        departureTime: "02:15 PM",
        arrivalTime: "10:30 PM"
      }
    ],
    luxury: [
      {
        id: "FL-L-301",
        airline: "Aura Premium Airways",
        flightNumber: "AP-001",
        class: "Business Class (Flat-bed, Lounge access)",
        stops: 0,
        layover: "Non-stop",
        duration: "8h 10m",
        price: 2950,
        departureTime: "01:00 PM",
        arrivalTime: "09:10 PM"
      },
      {
        id: "FL-L-302",
        airline: "Royal Horizon Airlines",
        flightNumber: "RH-902",
        class: "First Class Suite (Private Cabin, Fine Dining)",
        stops: 0,
        layover: "Non-stop",
        duration: "7h 55m",
        price: 5200,
        departureTime: "09:30 PM",
        arrivalTime: "05:25 AM (+1)"
      }
    ]
  };

  // Resolve matching budget key
  let budgetKey = "moderate";
  if (normBudget === "low" || normBudget === "budget") budgetKey = "budget";
  if (normBudget === "high" || normBudget === "luxury") budgetKey = "luxury";

  const results = flightOptions[budgetKey].map(flight => ({
    ...flight,
    searchParams: { origin, destination, dates, requestedBudget: budget }
  }));

  return results;
}

/**
 * Simulates a boutique hotel search based on destination and budget.
 */
function searchHotels(destination, dates, budget) {
  const normBudget = (budget || "moderate").toString().toLowerCase();

  const hotelOptions = {
    budget: [
      {
        id: "HT-B-101",
        name: "The Nomad Nest Hostel",
        type: "Boutique Hostel",
        rating: "4.3/5",
        roomType: "Pod in 4-Bed Dorm (Co-working area included)",
        amenities: ["Free Wi-Fi", "Shared Kitchen", "Coffee Station", "Dedicated Workstations"],
        pricePerNight: 35,
        location: "Downtown / Creative District"
      },
      {
        id: "HT-B-102",
        name: "Uptown Guesthouse & Hub",
        type: "Micro-hotel / Guesthouse",
        rating: "4.1/5",
        roomType: "Compact Private Room (Shared Bath)",
        amenities: ["Free Wi-Fi", "Bicycle Rental", "Self-service Laundry"],
        pricePerNight: 55,
        location: "Historic Quarter"
      }
    ],
    moderate: [
      {
        id: "HT-M-201",
        name: "The Artisan Design Hotel",
        type: "Boutique Design Hotel",
        rating: "4.6/5",
        roomType: "Standard Queen Room",
        amenities: ["Free High-speed Wi-Fi", "Breakfast Included", "Boutique Workspace Room", "Gym Access"],
        pricePerNight: 160,
        location: "City Center / Arts District"
      },
      {
        id: "HT-M-202",
        name: "The Element Green Stay",
        type: "Eco-Boutique Hotel",
        rating: "4.5/5",
        roomType: "Deluxe King Room",
        amenities: ["Gigabit Wi-Fi", "Ergonomic Chairs in Room", "Local Organic Restaurant", "Sauna"],
        pricePerNight: 195,
        location: "Financial District Border"
      }
    ],
    luxury: [
      {
        id: "HT-L-301",
        name: "Aura Oasis Luxury Wellness Resort",
        type: "5-Star Luxury Boutique Resort",
        rating: "4.9/5",
        roomType: "Wellness Junior Suite with Balcony",
        amenities: ["Gigabit Fiber Wi-Fi", "Private Butler Service", "Infinity Pool", "Thermal Spa Access", "Michelin-starred Restaurant"],
        pricePerNight: 650,
        location: "Scenic Waterfront / Premium Hillside"
      },
      {
        id: "HT-L-302",
        name: "The Grand Regent Heritage Suites",
        type: "Historic Luxury Mansion Hotel",
        rating: "4.8/5",
        roomType: "Executive Suite (Separate Study Room)",
        amenities: ["Premium Wi-Fi", "In-suite Espresso Machine", "Private Meeting Rooms", "Chauffeur Service", "Rooftop Executive Lounge"],
        pricePerNight: 850,
        location: "Prestigious Diplomatic Quarter"
      }
    ]
  };

  // Resolve matching budget key
  let budgetKey = "moderate";
  if (normBudget === "low" || normBudget === "budget") budgetKey = "budget";
  if (normBudget === "high" || normBudget === "luxury") budgetKey = "luxury";

  const results = hotelOptions[budgetKey].map(hotel => ({
    ...hotel,
    searchParams: { destination, dates, requestedBudget: budget }
  }));

  return results;
}

module.exports = {
  searchFlights,
  searchHotels
};
