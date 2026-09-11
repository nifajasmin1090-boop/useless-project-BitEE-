/**
 * OPTIMAL BITE CALCULATOR - Sandwich Presets
 */

export const INGREDIENT_ICONS = {
  Bread: "🍞",
  Protein: "🥩",
  Vegetable: "🥬",
  Cheese: "🧀",
  Sauce: "🥫",
  Other: "⚡"
};

export const INGREDIENT_COLORS = {
  Bread: { bg: "#d97706", light: "#fef3c7", border: "#b45309", name: "Bread" },
  Protein: { bg: "#831843", light: "#fce7f3", border: "#500724", name: "Protein" },
  Vegetable: { bg: "#059669", light: "#d1fae5", border: "#047857", name: "Vegetable" },
  Cheese: { bg: "#eab308", light: "#fef9c3", border: "#ca8a04", name: "Cheese" },
  Sauce: { bg: "#dc2626", light: "#fee2e2", border: "#b91c1c", name: "Sauce" },
  Other: { bg: "#8b5cf6", light: "#ede9fe", border: "#6d28d9", name: "Other" }
};

export const PRESET_SANDWICHES = {
  classic: {
    id: "classic",
    name: "Classic Burger",
    tagline: "Baseline aerodynamic balance • Standard double-bun profile",
    description: "Balanced baseline burger with 47 mm standard airframe.",
    layers: [
      { id: "c1", name: "Top Sesame Bun", category: "Bread", thickness: 10, icon: "🍞" },
      { id: "c2", name: "Crisp Lettuce", category: "Vegetable", thickness: 3, icon: "🥬" },
      { id: "c3", name: "Beef Patty", category: "Protein", thickness: 15, icon: "🥩" },
      { id: "c4", name: "Cheddar Cheese", category: "Cheese", thickness: 2, icon: "🧀" },
      { id: "c5", name: "Sliced Tomato", category: "Vegetable", thickness: 5, icon: "🍅" },
      { id: "c6", name: "Special Sauce", category: "Sauce", thickness: 2, icon: "🥫" },
      { id: "c7", name: "Bottom Bun", category: "Bread", thickness: 10, icon: "🍞" }
    ]
  },
  engineersDream: {
    id: "engineersDream",
    name: "⭐ Engineer's Dream",
    tagline: "Mathematically calibrated 40/25/20/10/5 ratio • Optimal bite!",
    description: "Calibrated to exact theoretical tolerances: 40% Bread, 25% Protein, 20% Veg, 10% Cheese, 5% Sauce.",
    layers: [
      { id: "ed1", name: "Brioche Bun Top", category: "Bread", thickness: 20, icon: "🍞" },
      { id: "ed2", name: "Butterhead Lettuce", category: "Vegetable", thickness: 10, icon: "🥬" },
      { id: "ed3", name: "Aged Gruyère Slice", category: "Cheese", thickness: 10, icon: "🧀" },
      { id: "ed4", name: "Prime Angus Patty", category: "Protein", thickness: 25, icon: "🥩" },
      { id: "ed5", name: "Heirloom Tomato", category: "Vegetable", thickness: 10, icon: "🍅" },
      { id: "ed6", name: "Aerospace Truffle Aioli", category: "Sauce", thickness: 5, icon: "🥫" },
      { id: "ed7", name: "Brioche Bun Heel", category: "Bread", thickness: 20, icon: "🍞" }
    ]
  },
  breadMonster: {
    id: "breadMonster",
    name: "The Bread Monster",
    tagline: "Carb monolith overkill • Near-total flavor dampening",
    description: "An unhinged 93 mm carb monolith with near-total flavor dampening.",
    layers: [
      { id: "bm1", name: "Artisanal Sourdough Crown", category: "Bread", thickness: 30, icon: "🍞" },
      { id: "bm2", name: "Middle Bread Deck", category: "Bread", thickness: 25, icon: "🍞" },
      { id: "bm3", name: "Depressed Patty", category: "Protein", thickness: 5, icon: "🥩" },
      { id: "bm4", name: "Token Cheese Filament", category: "Cheese", thickness: 1, icon: "🧀" },
      { id: "bm5", name: "Microscopic Tomato", category: "Vegetable", thickness: 1, icon: "🍅" },
      { id: "bm6", name: "Homeopathic Lettuce", category: "Vegetable", thickness: 1, icon: "🥬" },
      { id: "bm7", name: "Dense Sourdough Base", category: "Bread", thickness: 30, icon: "🍞" }
    ]
  },
  tomatoDisaster: {
    id: "tomatoDisaster",
    name: "The Tomato Disaster",
    tagline: "Aqueous red-matter hazard • Guaranteed lateral slip",
    description: "A 30 mm aqueous red-matter bomb with guaranteed lateral ejection on first bite.",
    layers: [
      { id: "td1", name: "Top Bun", category: "Bread", thickness: 10, icon: "🍞" },
      { id: "td2", name: "Lettuce Friction Barrier", category: "Vegetable", thickness: 2, icon: "🥬" },
      { id: "td3", name: "Patty", category: "Protein", thickness: 10, icon: "🥩" },
      { id: "td4", name: "Supermassive Tomato Slab", category: "Vegetable", thickness: 30, icon: "🍅" },
      { id: "td5", name: "Cheese Lubricant", category: "Cheese", thickness: 2, icon: "🧀" },
      { id: "td6", name: "Sauce", category: "Sauce", thickness: 2, icon: "🥫" },
      { id: "td7", name: "Bottom Bun", category: "Bread", thickness: 10, icon: "🍞" }
    ]
  },
  sauceFlood: {
    id: "sauceFlood",
    name: "The Sauce Flood",
    tagline: "Hydrodynamic tsunami • Guaranteed shirt contamination",
    description: "25 mm liquid payload guaranteed to cause catastrophic shirt contamination.",
    layers: [
      { id: "sf1", name: "Top Bun (Unaware of Fate)", category: "Bread", thickness: 10, icon: "🍞" },
      { id: "sf2", name: "Patty Submersible", category: "Protein", thickness: 15, icon: "🥩" },
      { id: "sf3", name: "Cheese Sluice Gate", category: "Cheese", thickness: 3, icon: "🧀" },
      { id: "sf4", name: "Tsunami Special Sauce", category: "Sauce", thickness: 25, icon: "🥫" },
      { id: "sf5", name: "Floating Tomato", category: "Vegetable", thickness: 2, icon: "🍅" },
      { id: "sf6", name: "Drowning Lettuce", category: "Vegetable", thickness: 2, icon: "🥬" },
      { id: "sf7", name: "Bottom Bun Sponge", category: "Bread", thickness: 10, icon: "🍞" }
    ]
  },
  zeroGSub: {
    id: "zeroGSub",
    name: "The Parabolic Zero-G Sub",
    tagline: "NASA Crumb-Free Roll • Vacuum-sealed protein cylinder",
    description: "Tortilla wrapped high-density protein cylinder with zero atmospheric crumb scatter.",
    layers: [
      { id: "zg1", name: "Flour Tortilla Shell", category: "Bread", thickness: 4, icon: "🫓" },
      { id: "zg2", name: "Compressed Turkey Breast", category: "Protein", thickness: 18, icon: "🥩" },
      { id: "zg3", name: "Provolone Sealant", category: "Cheese", thickness: 6, icon: "🧀" },
      { id: "zg4", name: "Hydroponic Spinach", category: "Vegetable", thickness: 8, icon: "🥬" },
      { id: "zg5", name: "High-Viscosity Mayo Gel", category: "Sauce", thickness: 4, icon: "🥫" },
      { id: "zg6", name: "Lower Tortilla Lock", category: "Bread", thickness: 4, icon: "🫓" }
    ]
  }
};

export const QUICK_ADD_INGREDIENTS = [
  { name: "Top Sesame Bun", category: "Bread", thickness: 12, icon: "🍞" },
  { name: "Bottom Bun", category: "Bread", thickness: 10, icon: "🍞" },
  { name: "Sourdough Slice", category: "Bread", thickness: 15, icon: "🍞" },
  { name: "Brioche Bun", category: "Bread", thickness: 14, icon: "🍞" },
  { name: "Prime Beef Patty", category: "Protein", thickness: 18, icon: "🥩" },
  { name: "Smoked Bacon (2x)", category: "Protein", thickness: 4, icon: "🥓" },
  { name: "Crispy Fried Chicken", category: "Protein", thickness: 22, icon: "🍗" },
  { name: "Fried Egg (Sunny Runny)", category: "Protein", thickness: 6, icon: "🍳" },
  { name: "Crisp Butter Lettuce", category: "Vegetable", thickness: 4, icon: "🥬" },
  { name: "Heirloom Tomato Slice", category: "Vegetable", thickness: 6, icon: "🍅" },
  { name: "Dill Pickle Chips", category: "Vegetable", thickness: 3, icon: "🥒" },
  { name: "Caramelized Onions", category: "Vegetable", thickness: 4, icon: "🧅" },
  { name: "Fresh Avocado", category: "Vegetable", thickness: 7, icon: "🥑" },
  { name: "Jalapeño Coins", category: "Vegetable", thickness: 2, icon: "🌶️" },
  { name: "Sharp Cheddar", category: "Cheese", thickness: 3, icon: "🧀" },
  { name: "Swiss Emmental", category: "Cheese", thickness: 2, icon: "🧀" },
  { name: "Pepper Jack", category: "Cheese", thickness: 3, icon: "🧀" },
  { name: "Special Burger Sauce", category: "Sauce", thickness: 3, icon: "🥫" },
  { name: "Spicy Sriracha Mayo", category: "Sauce", thickness: 2, icon: "🥫" },
  { name: "Dijon Mustard", category: "Sauce", thickness: 1, icon: "🥫" },
  { name: "Smoky BBQ Glaze", category: "Sauce", thickness: 3, icon: "🥫" }
];
