/**
 * Confidence Thresholds & Evaluation
 * Configurable thresholds for AI prediction confidence.
 * Note: These are system decision thresholds, not scientific validity claims.
 */
const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.80,
  MEDIUM: 0.60,
};

/**
 * Categorize confidence into HIGH, MEDIUM, or LOW
 * @param {number} confidence (0.0 - 1.0)
 * @returns {{ level: 'HIGH' | 'MEDIUM' | 'LOW', isLowConfidence: boolean, adviceKey: string }}
 */
const evaluateConfidence = (confidence) => {
  const score = Number(confidence) || 0;
  if (score >= CONFIDENCE_THRESHOLDS.HIGH) {
    return {
      level: 'HIGH',
      isLowConfidence: false,
      adviceKey: 'high_confidence',
      description: 'Diagnosis has high statistical alignment with database patterns.',
    };
  }
  if (score >= CONFIDENCE_THRESHOLDS.MEDIUM) {
    return {
      level: 'MEDIUM',
      isLowConfidence: false,
      adviceKey: 'medium_confidence',
      description: 'Moderate alignment. Look closely at symptoms listed below.',
    };
  }
  return {
    level: 'LOW',
    isLowConfidence: true,
    adviceKey: 'low_confidence',
    description: 'Confidence is low. Please take another clear photo or consult your local agricultural expert (KVK).',
  };
};

module.exports = {
  CONFIDENCE_THRESHOLDS,
  evaluateConfidence,
};
