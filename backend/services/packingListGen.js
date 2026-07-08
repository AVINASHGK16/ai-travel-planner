/**
 * Generates a structured, categorized packing list in JSON format,
 * tailored for a digital nomad or business professional.
 * 
 * @param {string} weatherCondition - E.g. 'Rainy', 'Hot', 'Cold', 'Snowy', 'Sunny', 'Mild'
 * @param {number} durationDays - Length of the trip in days
 */
function generatePackingList(weatherCondition, durationDays) {
  const duration = parseInt(durationDays) || 3;
  const cond = (weatherCondition || "Mild").toString().toLowerCase();

  // Basic Nomad Essentials (included for every trip)
  const electronics = [
    { item: "Work Laptop & Charger", quantity: 1, essential: true },
    { item: "Universal Travel Power Adapter", quantity: 1, essential: true },
    { item: "Noise-canceling Headphones", quantity: 1, essential: true },
    { item: "High-capacity Power Bank (10000mAh+)", quantity: 1, essential: true },
    { item: "Various charging cables (USB-C, Lightning, etc.)", quantity: 1, essential: true },
    { item: "Portable Laptop Stand & Ergonomic Mouse", quantity: 1, essential: false },
    { item: "Blue-light Glasses", quantity: 1, essential: false }
  ];

  const documents = [
    { item: "Passport & Visas (if international)", quantity: 1, essential: true },
    { item: "Credit/Debit Cards & small amount of local currency", quantity: 1, essential: true },
    { item: "Travel & Health Insurance documents", quantity: 1, essential: true },
    { item: "Company ID / Business Cards", quantity: 10, essential: false },
    { item: "Notebook & Pen", quantity: 1, essential: false }
  ];

  const toiletries = [
    { item: "Toothbrush & Toothpaste (travel size)", quantity: 1, essential: true },
    { item: "Deodorant", quantity: 1, essential: true },
    { item: "Travel-size Shampoo & Body Wash", quantity: 1, essential: true },
    { item: "Personal Medication & Basic First-aid", quantity: 1, essential: true },
    { item: "Nail Clippers & Tweezers", quantity: 1, essential: false }
  ];

  // Base clothing calculation
  const undergarmentsQty = Math.min(duration, 7);
  const socksQty = Math.min(duration, 7);
  const shirtsQty = Math.min(duration, 5);
  const pantsQty = Math.max(1, Math.min(Math.ceil(duration / 3), 3));

  const clothing = [
    { item: "Underwear", quantity: undergarmentsQty, essential: true },
    { item: "Socks", quantity: socksQty, essential: true },
    { item: "Business Casual / Smart Shirts", quantity: shirtsQty, essential: true },
    { item: "Chino Pants or Smart Trousers", quantity: pantsQty, essential: true },
    { item: "Light Blazer or Professional Cardigan", quantity: 1, essential: true },
    { item: "Comfortable Walking Shoes (Smart-casual style)", quantity: 1, essential: true },
    { item: "Sleepwear", quantity: Math.min(duration, 2), essential: true }
  ];

  const miscellaneous = [
    { item: "Reusable Water Bottle", quantity: 1, essential: true },
    { item: "Hand Sanitizer & Wet Wipes", quantity: 1, essential: true },
    { item: "E-reader / Kindle", quantity: 1, essential: false }
  ];

  // Weather-specific modifications
  if (cond.includes("rain") || cond.includes("damp") || cond.includes("shower")) {
    clothing.push({ item: "Waterproof Shell Jacket / Raincoat", quantity: 1, essential: true });
    clothing.push({ item: "Water-resistant / Leather Shoes", quantity: 1, essential: true });
    electronics.push({ item: "Dry Bags / Zip-locks for electronics", quantity: 3, essential: true });
    miscellaneous.push({ item: "Compact Travel Umbrella", quantity: 1, essential: true });
  }

  if (cond.includes("cold") || cond.includes("snow") || cond.includes("chilly") || cond.includes("winter")) {
    clothing.push({ item: "Heavy Winter Coat / Parka", quantity: 1, essential: true });
    clothing.push({ item: "Thermal Base Layers (Top & Bottom)", quantity: Math.min(duration, 3), essential: true });
    clothing.push({ item: "Warm Beanie / Woolen Cap", quantity: 1, essential: true });
    clothing.push({ item: "Insulated Gloves", quantity: 1, essential: true });
    clothing.push({ item: "Woolen Scarf", quantity: 1, essential: true });
    clothing.push({ item: "Thick Wool Socks (replacing regular)", quantity: socksQty, essential: true });
    toiletries.push({ item: "Lip Balm & Heavy Moisturizer", quantity: 1, essential: true });
  }

  if (cond.includes("hot") || cond.includes("humid") || cond.includes("warm") || cond.includes("summer")) {
    clothing.push({ item: "Lightweight Breathable Shorts", quantity: Math.min(duration, 3), essential: true });
    clothing.push({ item: "Swimwear", quantity: 1, essential: false });
    clothing.push({ item: "Sunglasses with UV Protection", quantity: 1, essential: true });
    clothing.push({ item: "Sun Hat / Baseball Cap", quantity: 1, essential: false });
    toiletries.push({ item: "Sunscreen (SPF 30+ / travel size)", quantity: 1, essential: true });
    toiletries.push({ item: "Insect Repellent", quantity: 1, essential: false });
  }

  return {
    weatherContext: weatherCondition,
    durationDays: duration,
    vibe: "Digital Nomad / Professional",
    packingList: {
      clothing,
      electronics,
      documents,
      toiletries,
      miscellaneous
    }
  };
}

module.exports = {
  generatePackingList
};
