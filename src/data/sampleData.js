// Sample data provided in the task
export const sampleGridData = {
  startTime: "2025-03-30T12:00:00Z",
  settlementPeriod: 25,
  data: [
    {
      fuelType: "BIOMASS",
      generation: 338,
    },
    {
      fuelType: "CCGT",
      generation: 1959,
    },
    {
      fuelType: "COAL",
      generation: 0,
    },
    {
      fuelType: "INTELEC",
      generation: 419,
    },
    {
      fuelType: "INTEW",
      generation: -527,
    },
    {
      fuelType: "INTFR",
      generation: -123,
    },
    {
      fuelType: "INTGRNL",
      generation: -514,
    },
    {
      fuelType: "INTIFA2",
      generation: 119,
    },
    {
      fuelType: "INTIRL",
      generation: -451,
    },
    {
      fuelType: "INTNED",
      generation: 830,
    },
    {
      fuelType: "INTNEM",
      generation: 921,
    },
    {
      fuelType: "INTNSL",
      generation: -505,
    },
    {
      fuelType: "INTVKL",
      generation: -655,
    },
    {
      fuelType: "NPSHYD",
      generation: 315,
    },
    {
      fuelType: "NUCLEAR",
      generation: 3756,
    },
    {
      fuelType: "OCGT",
      generation: 1,
    },
    {
      fuelType: "OIL",
      generation: 0,
    },
    {
      fuelType: "OTHER",
      generation: 404,
    },
    {
      fuelType: "PS",
      generation: -1315,
    },
    {
      fuelType: "WIND",
      generation: 10993,
    },
  ],
};

// Fuel type classifications as specified in the task requirements
export const FUEL_CLASSIFICATIONS = {
  green: ["BIOMASS", "NPSHYD", "NUCLEAR", "PS", "WIND"],
  notGreen: ["CCGT", "COAL", "OCGT", "OIL"],
  neutral: [
    "INTELEC",
    "INTEW",
    "INTFR",
    "INTGRNL",
    "INTIFA2",
    "INTIRL",
    "INTNED",
    "INTNEM",
    "INTNSL",
    "INTVKL",
    "OTHER",
  ],
};
