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

  // Get dominant fuel types for more contextual messaging
  const dominantGreen = positiveGeneration
    .filter((item) => FUEL_CLASSIFICATIONS.green.includes(item.fuelType))
    .sort((a, b) => b.generation - a.generation)[0];

  const dominantFossil = positiveGeneration
    .filter((item) => FUEL_CLASSIFICATIONS.notGreen.includes(item.fuelType))
    .sort((a, b) => b.generation - a.generation)[0];

  return {
    totalGeneration: Math.round(totalGeneration),
    greenGeneration: Math.round(greenGeneration),
    fossilGeneration: Math.round(fossilGeneration),
    neutralGeneration: Math.round(neutralGeneration),
    greenPercentage: Math.round(greenPercentage * 10) / 10,
    fossilPercentage: Math.round(fossilPercentage * 10) / 10,
    neutralPercentage: Math.round(neutralPercentage * 10) / 10,
    dominantGreen: dominantGreen?.fuelType || null,
    dominantFossil: dominantFossil?.fuelType || null,
    dominantGreenAmount: dominantGreen?.generation || 0,
    dominantFossilAmount: dominantFossil?.generation || 0,
  };
}

/**
 * Determine grid status based on green and fossil fuel percentages
 * @param {number} greenPercentage - Percentage of green generation
 * @param {number} fossilPercentage - Percentage of fossil fuel generation
 * @returns {string} Grid status: 'excellent', 'good', 'moderate', or 'poor'
 */
export function determineGridStatus(greenPercentage, fossilPercentage) {
  // Dynamic thresholds based on actual data patterns
  if (greenPercentage >= 80) {
    return "excellent"; // Exceptionally green
  }

  if (greenPercentage >= 60) {
    return "good"; // Majority renewable with good buffer
  }

  if (fossilPercentage >= 50) {
    return "poor"; // Fossil fuels dominate
  }

  if (fossilPercentage >= 30) {
    return "moderate"; // Significant fossil fuel usage
  }

  return "good"; // Low fossil fuels, decent renewables
}

/**
 * Get dynamic user message based on actual grid conditions
 * @param {string} status - Grid status from determineGridStatus()
 * @param {Object} metrics - Full metrics object with detailed data
 * @returns {Object} Message object with text, icon, and action
 */
export function getGridMessage(status, metrics) {
  const {
    fossilPercentage,
    greenPercentage,
    dominantGreen,
    dominantFossil,
    dominantGreenAmount,
  } = metrics;

  // Dynamic messages based on actual data
  const messages = {
    excellent: {
      text: `Excellent! ${greenPercentage}% renewable energy right now${
        dominantGreen
          ? `, led by ${dominantGreen.toLowerCase()} (${dominantGreenAmount.toLocaleString()} MW)`
          : ""
      }. Perfect time for energy-intensive tasks!`,
      icon: "🌱",
      action: "encourage",
      severity: "positive",
    },
    good: {
      text: `Good renewable mix at ${greenPercentage}% green energy. ${
        fossilPercentage < 20 ? "Very low fossil fuel usage - " : ""
      }Normal energy consumption is fine.`,
      icon: "✅",
      action: "neutral",
      severity: "positive",
    },
    moderate: {
      text: `Moderate conditions: ${greenPercentage}% renewable, ${fossilPercentage}% fossil fuels${
        dominantFossil ? ` (mainly ${dominantFossil.toLowerCase()})` : ""
      }. Consider timing large energy tasks for later.`,
      icon: "⚡",
      action: "consider",
      severity: "neutral",
    },
    poor: {
      text: `High fossil fuel usage at ${fossilPercentage}%${
        dominantFossil ? ` (${dominantFossil.toLowerCase()} dominant)` : ""
      }. Every bit of energy reduction helps lower emissions right now.`,
      icon: "⚠️",
      action: "reduce",
      severity: "warning",
    },
  };

  const baseMessage = messages[status] || messages.moderate;

  // Add time-sensitive context
  const hour = new Date().getHours();
  let timeContext = "";

  if (status === "excellent" && hour >= 10 && hour <= 16) {
    timeContext =
      " Solar generation is likely contributing to these great conditions!";
  } else if (status === "poor" && hour >= 17 && hour <= 19) {
    timeContext = " Peak demand period - grid is working hard right now.";
  } else if (status === "good" && dominantGreen === "WIND") {
    timeContext = " Windy conditions are helping keep the grid clean!";
  }

  return {
    ...baseMessage,
    text: baseMessage.text + timeContext,
  };
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

/**
 * Generate contextual recommendations based on current grid state
 * @param {Object} metrics - Grid metrics
 * @param {string} status - Grid status
 * @returns {Array} Array of recommendation objects
 */
export function getEnergyRecommendations(metrics, status) {
  const { greenPercentage, fossilPercentage, dominantGreen } = metrics;

  const recommendations = [];

  if (status === "excellent") {
    recommendations.push(
      { icon: "🔌", text: "Charge electric vehicles", priority: "high" },
      { icon: "🧺", text: "Run washing machines/dryers", priority: "high" },
      { icon: "🏠", text: "Use heat pumps and AC", priority: "medium" },
      {
        icon: "🔋",
        text: "Charge all devices and batteries",
        priority: "medium",
      }
    );
  } else if (status === "good") {
    recommendations.push(
      { icon: "✅", text: "Normal energy usage is fine", priority: "high" },
      { icon: "🧺", text: "Good time for laundry", priority: "medium" },
      { icon: "🔌", text: "EV charging is reasonable", priority: "medium" }
    );
  } else if (status === "moderate") {
    recommendations.push(
      {
        icon: "⏰",
        text: "Delay energy-intensive tasks if possible",
        priority: "high",
      },
      { icon: "💡", text: "Use energy-efficient settings", priority: "medium" },
      {
        icon: "🌡️",
        text: "Adjust heating/cooling by 1-2°C",
        priority: "medium",
      }
    );
  } else {
    recommendations.push(
      {
        icon: "⚡",
        text: "Minimize energy use when possible",
        priority: "high",
      },
      { icon: "🔌", text: "Delay EV charging if not urgent", priority: "high" },
      {
        icon: "🏠",
        text: "Reduce heating/cooling temporarily",
        priority: "medium",
      },
      {
        icon: "💻",
        text: "Consider unplugging unused devices",
        priority: "low",
      }
    );
  }

  return recommendations;
}
