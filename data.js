// ====== SETTINGS ======
const FAMILY = { size: 4, location: "Ottawa" };

// ====== FREE ONLINE IMAGES (NO DOWNLOAD) ======
// Uses Unsplash Source. These are safe-to-use image endpoints.
// NOTE: Needs internet for images to load.
const IMAGE_LIBRARY = {
  oatmeal:   "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=1200&q=80",
  eggs:      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80",
  pancakes:  "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?auto=format&fit=crop&w=1200&q=80",
  french:    "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=1200&q=80",
  yogurt:    "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",

  shawarma:  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
  sandwich:  "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80",
  tuna:      "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1200&q=80",
  friedrice: "https://images.unsplash.com/photo-1604908177453-7462950a6b94?auto=format&fit=crop&w=1200&q=80",
  salad:     "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80",

  jollof:    "https://images.unsplash.com/photo-1604908554069-6d7e0a6a5d47?auto=format&fit=crop&w=1200&q=80",
  spaghetti: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
  salmon:    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
  pizza:     "https://images.unsplash.com/photo-1548365328-9f547f9a7ce3?auto=format&fit=crop&w=1200&q=80",
  stirfry:   "https://images.unsplash.com/photo-1604908554162-18cf3f1a09a6?auto=format&fit=crop&w=1200&q=80",
  stew:      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80",
  soup:      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
  egusi:     "https://images.unsplash.com/photo-1604908554207-2c6c5c1397d1?auto=format&fit=crop&w=1200&q=80"
};


// ====== PRICE BOOK (ESTIMATES) ======
// Store labels: Costco | Walmart | AfricanStore
// Units supported: g, kg, ml, L, pcs
// Add more items to improve budget accuracy.
const PRICE_BOOK = {
  // Pantry
  "Rice":            { store: "Costco", unit: "kg", packSize: 10, price: 24.99, category: "Pantry" },
  "Oats":            { store: "Costco", unit: "kg", packSize: 2.2, price: 12.99, category: "Pantry" },
  "Pasta":           { store: "Walmart", unit: "kg", packSize: 1, price: 3.49, category: "Pantry" },
  "Pasta sauce":     { store: "Walmart", unit: "pcs", packSize: 1, price: 2.99, category: "Pantry" },
  "Flour":           { store: "Costco", unit: "kg", packSize: 10, price: 14.99, category: "Pantry" },
  "Bread":           { store: "Walmart", unit: "pcs", packSize: 1, price: 3.49, category: "Pantry" },
  "Beans (black-eyed peas)": { store: "AfricanStore", unit: "kg", packSize: 2, price: 9.99, category: "Pantry" },
  "Egusi":           { store: "AfricanStore", unit: "kg", packSize: 1, price: 12.99, category: "Pantry" },
  "Palm oil":        { store: "AfricanStore", unit: "L", packSize: 1, price: 9.99, category: "Pantry" },
  "Granola":         { store: "Walmart", unit: "kg", packSize: 0.8, price: 6.99, category: "Pantry" },
  "Peanut butter":   { store: "Costco", unit: "kg", packSize: 1, price: 8.99, category: "Pantry" },
  "Olive oil":       { store: "Costco", unit: "L", packSize: 1, price: 11.99, category: "Pantry" },

  // Meat/Fish
  "Chicken thighs":  { store: "Costco", unit: "kg", packSize: 3, price: 29.99, category: "Meat/Fish" },
  "Ground beef":     { store: "Costco", unit: "kg", packSize: 1.5, price: 19.99, category: "Meat/Fish" },
  "Salmon":          { store: "Costco", unit: "kg", packSize: 1, price: 24.99, category: "Meat/Fish" },
  "Tuna (canned)":   { store: "Walmart", unit: "pcs", packSize: 4, price: 6.49, category: "Meat/Fish" },
  "Turkey slices":   { store: "Walmart", unit: "pcs", packSize: 1, price: 5.49, category: "Meat/Fish" },

  // Dairy
  "Eggs":            { store: "Walmart", unit: "pcs", packSize: 30, price: 10.99, category: "Dairy" },
  "Milk":            { store: "Walmart", unit: "L", packSize: 4, price: 6.49, category: "Dairy" },
  "Yogurt":          { store: "Costco", unit: "pcs", packSize: 24, price: 13.99, category: "Dairy" },
  "Cheese":          { store: "Costco", unit: "kg", packSize: 1.2, price: 14.99, category: "Dairy" },
  "Butter":          { store: "Walmart", unit: "pcs", packSize: 1, price: 5.49, category: "Dairy" },

  // Produce
  "Bananas":         { store: "Walmart", unit: "kg", packSize: 1, price: 1.79, category: "Produce" },
  "Berries":         { store: "Costco", unit: "kg", packSize: 1, price: 9.99, category: "Produce" },
  "Apples":          { store: "Costco", unit: "kg", packSize: 2.2, price: 7.99, category: "Produce" },
  "Onions":          { store: "Costco", unit: "kg", packSize: 3, price: 6.99, category: "Produce" },
  "Tomatoes":        { store: "Walmart", unit: "kg", packSize: 1, price: 4.49, category: "Produce" },
  "Bell pepper":     { store: "Costco", unit: "kg", packSize: 1.5, price: 7.99, category: "Produce" },
  "Potatoes":        { store: "Costco", unit: "kg", packSize: 4.5, price: 8.99, category: "Produce" },
  "Green beans":     { store: "Walmart", unit: "kg", packSize: 0.5, price: 3.99, category: "Produce" },
  "Lettuce":         { store: "Walmart", unit: "pcs", packSize: 1, price: 2.99, category: "Produce" },
  "Cucumber":        { store: "Walmart", unit: "pcs", packSize: 1, price: 1.49, category: "Produce" },
  "Carrots":         { store: "Costco", unit: "kg", packSize: 2, price: 4.99, category: "Produce" }
};

// ====== MEAL POOL ======
// The randomizer picks from here.
// To reduce repeats, add more meals over time.
const MEAL_POOL = [
  // --- Breakfast ---
  poolMeal("Oatmeal + Fruit", "Global", 420, ["Breakfast","Quick"], ["Oats","Milk","Bananas"], IMAGE_LIBRARY.oatmeal),
  poolMeal("Scrambled Eggs + Toast", "Global", 420, ["Breakfast","Quick"], ["Eggs","Bread"], IMAGE_LIBRARY.eggs),
  poolMeal("Pancakes + Berries", "Global", 520, ["Breakfast","Fun"], ["Flour","Eggs","Milk","Berries","Butter"], IMAGE_LIBRARY.pancakes),
  poolMeal("French Toast + Fruit", "Global", 550, ["Breakfast"], ["Bread","Eggs","Milk","Bananas"], IMAGE_LIBRARY.french),
  poolMeal("Yogurt Parfait", "Global", 400, ["Breakfast"], ["Yogurt","Granola","Berries"], IMAGE_LIBRARY.yogurt),
  poolMeal("Akara + Bread", "Nigerian", 500, ["Breakfast","Nigerian"], ["Beans (black-eyed peas)","Onions","Bread"], IMAGE_LIBRARY.akara),
  poolMeal("Moi Moi + Boiled Eggs", "Nigerian", 520, ["Breakfast","Nigerian"], ["Beans (black-eyed peas)","Eggs","Onions"], IMAGE_LIBRARY.moi),

  // --- Lunch ---
  poolMeal("Chicken Shawarma Wraps", "Middle Eastern", 650, ["Lunch"], ["Chicken thighs","Lettuce","Cucumber","Tomatoes"], IMAGE_LIBRARY.shawarma),
  poolMeal("Turkey Sandwich + Apple", "Global", 580, ["Lunch","Quick"], ["Turkey slices","Bread","Apples","Cheese"], IMAGE_LIBRARY.sandwich),
  poolMeal("Tuna Melt + Carrot Sticks", "Global", 600, ["Lunch"], ["Tuna (canned)","Bread","Cheese","Carrots"], IMAGE_LIBRARY.tuna),
  poolMeal("Fried Rice + Egg", "Nigerian/Global", 700, ["Lunch"], ["Rice","Eggs","Carrots","Onions"], IMAGE_LIBRARY.friedrice),
  poolMeal("Chicken Caesar Salad + Bread", "Global", 620, ["Lunch"], ["Chicken thighs","Lettuce","Cheese","Bread"], IMAGE_LIBRARY.salad),

  // --- Dinner ---
  poolMeal("Jollof Rice + Grilled Chicken", "Nigerian", 750, ["Dinner","Nigerian"], ["Rice","Chicken thighs","Tomatoes","Onions","Bell pepper"], IMAGE_LIBRARY.jollof),
  poolMeal("Spaghetti Bolognese (Mild)", "Italian", 780, ["Dinner"], ["Pasta","Ground beef","Pasta sauce","Onions"], IMAGE_LIBRARY.spaghetti),
  poolMeal("Salmon + Roasted Potatoes + Green Beans", "Canadian", 720, ["Dinner"], ["Salmon","Potatoes","Green beans","Olive oil"], IMAGE_LIBRARY.salmon),
  poolMeal("Family Pizza Night", "Italian", 850, ["Dinner","Fun"], ["Flour","Pasta sauce","Cheese","Ground beef"], IMAGE_LIBRARY.pizza),
  poolMeal("Beef Stir-fry + Rice", "Asian", 780, ["Dinner"], ["Ground beef","Rice","Bell pepper","Onions"], IMAGE_LIBRARY.stirfry),
  poolMeal("Tomato Stew + Rice", "Nigerian", 780, ["Dinner","Nigerian"], ["Tomatoes","Onions","Chicken thighs","Rice"], IMAGE_LIBRARY.stew),
  poolMeal("Light Veg Soup + Grilled Cheese", "Global", 600, ["Dinner","Light"], ["Carrots","Onions","Bread","Cheese"], IMAGE_LIBRARY.soup),
  poolMeal("Egusi Soup + Rice", "Nigerian", 800, ["Dinner","Nigerian"], ["Egusi","Palm oil","Onions","Rice"], IMAGE_LIBRARY.egusi),
];

// Build a pool meal with real-ish quantities for shopping calculations
function poolMeal(title, cuisine, kcalPerServing, tags, keyIngredients, image) {
  const ingredients = keyIngredients.map((name) => estimateIngredient(name));
  return {
    title,
    cuisine,
    kcalPerServing,
    tags: ["Family of 4","Kid-friendly", ...tags],
    ingredients,
    steps: [
      "Use your preferred recipe approach.",
      "Keep spices mild for kids; add heat to adult portion."
    ],
    note: "",
    image: image || ""
  };
}

// Rough quantity estimates for a family of 4 (weekly planner needs some numbers)
function estimateIngredient(name){
  // Use units that work with the price book (kg/L/pcs)
  const n = name.toLowerCase();

  if (n.includes("rice")) return { name, qty: 0.7, unit: "kg", note: "" };
  if (n.includes("chicken")) return { name, qty: 1.4, unit: "kg", note: "" };
  if (n.includes("ground beef")) return { name, qty: 1.0, unit: "kg", note: "" };
  if (n.includes("salmon")) return { name, qty: 1.0, unit: "kg", note: "" };
  if (n.includes("eggs")) return { name, qty: 10, unit: "pcs", note: "" };
  if (n.includes("bread")) return { name, qty: 1, unit: "pcs", note: "" };
  if (n.includes("milk")) return { name, qty: 1, unit: "L", note: "" };
  if (n.includes("oats")) return { name, qty: 0.35, unit: "kg", note: "" };
  if (n.includes("yogurt")) return { name, qty: 8, unit: "pcs", note: "" };
  if (n.includes("cheese")) return { name, qty: 0.35, unit: "kg", note: "" };
  if (n.includes("flour")) return { name, qty: 0.7, unit: "kg", note: "" };
  if (n.includes("pasta sauce")) return { name, qty: 2, unit: "pcs", note: "" };
  if (n.includes("pasta")) return { name, qty: 0.8, unit: "kg", note: "" };

  // produce
  if (n.includes("onion")) return { name, qty: 0.5, unit: "kg", note: "" };
  if (n.includes("tomato")) return { name, qty: 1.0, unit: "kg", note: "" };
  if (n.includes("pepper")) return { name, qty: 0.5, unit: "kg", note: "" };
  if (n.includes("carrot")) return { name, qty: 0.8, unit: "kg", note: "" };
  if (n.includes("lettuce")) return { name, qty: 1, unit: "pcs", note: "" };
  if (n.includes("cucumber")) return { name, qty: 2, unit: "pcs", note: "" };
  if (n.includes("potato")) return { name, qty: 2.5, unit: "kg", note: "" };
  if (n.includes("green beans")) return { name, qty: 1.0, unit: "kg", note: "" };
  if (n.includes("apples")) return { name, qty: 1.0, unit: "kg", note: "" };
  if (n.includes("bananas")) return { name, qty: 1.0, unit: "kg", note: "" };
  if (n.includes("berries")) return { name, qty: 0.7, unit: "kg", note: "" };

  // african items
  if (n.includes("egusi")) return { name, qty: 0.4, unit: "kg", note: "" };
  if (n.includes("palm oil")) return { name, qty: 0.25, unit: "L", note: "" };
  if (n.includes("beans")) return { name, qty: 0.6, unit: "kg", note: "" };

  // fallback
  return { name, qty: 1, unit: "pcs", note: "" };
}
