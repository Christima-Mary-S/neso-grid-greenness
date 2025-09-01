import { FUEL_CLASSIFICATIONS } from "../data/sampleData.js";

/**
 * Calculate grid metrics from generation data
 * @param {Array} generationData - Array of {fuelType, generation} objects
 * @returns {Object} Calculated grid metrics
 */
export function calculateGridMetrics(generationData) {
  // Only count positive generation values (negative = export/pumped storage discharge)
  const positiveGeneration = generationData.filter(
    (item) => item.generation > 0
  );

  // Categorize generation by fuel type
  const greenGeneration = positiveGeneration
    .filter((item) => FUEL_CLASSIFICATIONS.green.includes(item.fuelType))
    .reduce((sum, item) => sum + item.generation, 0);

  const fossilGeneration = positiveGeneration
    .filter((item) => FUEL_CLASSIFICATIONS.notGreen.includes(item.fuelType))
    .reduce((sum, item) => sum + item.generation, 0);

  const neutralGeneration = positiveGeneration
    .filter((item) => FUEL_CLASSIFICATIONS.neutral.includes(item.fuelType))
    .reduce((sum, item) => sum + item.generation, 0);

  // Calculate total positive generation
  const totalGeneration =
    greenGeneration + fossilGeneration + neutralGeneration;

  // Calculate percentages
  const greenPercentage =
    totalGeneration > 0 ? (greenGeneration / totalGeneration) * 100 : 0;
  const fossilPercentage =
    totalGeneration > 0 ? (fossilGeneration / totalGeneration) * 100 : 0;
  const neutralPercentage =
    totalGeneration > 0 ? (neutralGeneration / totalGeneration) * 100 : 0;

  return {
    totalGeneration: Math.round(totalGeneration),
    greenGeneration: Math.round(greenGeneration),
    fossilGeneration: Math.round(fossilGeneration),
    neutralGeneration: Math.round(neutralGeneration),
    greenPercentage: Math.round(greenPercentage * 10) / 10, // Round to 1 decimal
    fossilPercentage: Math.round(fossilPercentage * 10) / 10,
    neutralPercentage: Math.round(neutralPercentage * 10) / 10,
  };
}

/**
 * Determine grid status based on green and fossil fuel percentages
 * @param {number} greenPercentage - Percentage of green generation
 * @param {number} fossilPercentage - Percentage of fossil fuel generation
 * @returns {string} Grid status: 'excellent', 'good', 'moderate', or 'poor'
 */
export function determineGridStatus(greenPercentage, fossilPercentage) {
  // Business logic for grid status classification
  // These thresholds are based on typical renewable energy targets

  if (greenPercentage >= 70) {
    return "excellent"; // Very high renewable energy
  }

  if (greenPercentage >= 50) {
    return "good"; // Majority renewable energy
  }

  if (fossilPercentage >= 40) {
    return "poor"; // High fossil fuel dependency
  }

  return "moderate"; // Mixed energy sources
}

/**
 * Get user message and recommendations based on grid status
 * @param {string} status - Grid status from determineGridStatus()
 * @param {number} fossilPercentage - Current fossil fuel percentage
 * @returns {Object} Message object with text, icon, and action
 */
export function getGridMessage(status, fossilPercentage) {
  const messages = {
    excellent: {
      text: "Grid is very green today! Great time to use energy-intensive appliances like washing machines, dishwashers, or electric vehicle charging.",
      icon: "🌱",
      action: "encourage",
      severity: "positive",
    },
    good: {
      text: "Grid is fairly green right now. Normal energy usage is perfectly fine, and it's still a decent time for larger energy tasks.",
      icon: "✅",
      action: "neutral",
      severity: "positive",
    },
    moderate: {
      text: "Mixed energy sources today. Consider timing energy-intensive tasks for later when renewables might be higher.",
      icon: "⚡",
      action: "consider",
      severity: "neutral",
    },
    poor: {
      text: `High fossil fuel usage right now (${fossilPercentage}%). Try to reduce energy consumption when possible - every bit helps reduce emissions.`,
      icon: "⚠️",
      action: "reduce",
      severity: "warning",
    },
  };

  return messages[status] || messages.moderate;
}

/**
 * Get color scheme for UI based on grid status
 * @param {string} status - Grid status
 * @returns {Object} Tailwind color classes
 */
export function getStatusColors(status) {
  const colorSchemes = {
    excellent: {
      bg: "bg-green-500",
      text: "text-green-800",
      border: "border-green-500",
      light: "bg-green-50",
    },
    good: {
      bg: "bg-lime-500",
      text: "text-lime-800",
      border: "border-lime-500",
      light: "bg-lime-50",
    },
    moderate: {
      bg: "bg-amber-500",
      text: "text-amber-800",
      border: "border-amber-500",
      light: "bg-amber-50",
    },
    poor: {
      bg: "bg-red-500",
      text: "text-red-800",
      border: "border-red-500",
      light: "bg-red-50",
    },
  };

  return colorSchemes[status] || colorSchemes.moderate;
}
