// Provisional segment coefficients; one source for defaults and validation ranges.
export const surfaceDefaults = Object.freeze({ grip: 1, roughness: 0, rollingResistance: 1, hazardModifier: 1 });
export const surfaceRules = Object.freeze({ grip: [0.1, 2], roughness: [0, 2], rollingResistance: [0.1, 2], hazardModifier: [0, 2] });
