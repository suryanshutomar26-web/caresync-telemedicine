/**
 * Rule-based symptom -> specialization mapper.
 * This is a lightweight, explainable stand-in for a full medical NLP model.
 * Swap `analyzeSymptoms` internals with a call to an LLM API (OpenAI/Anthropic)
 * or a trained ClinicalBERT classifier for a more advanced version later.
 */

const SPECIALIZATION_KEYWORDS = {
  'General Physician': [
    'fever', 'cold', 'cough', 'flu', 'body ache', 'weakness', 'fatigue',
    'headache', 'sore throat', 'vomiting', 'diarrhea',
  ],
  Cardiologist: [
    'chest pain', 'palpitations', 'heart', 'high blood pressure', 'shortness of breath',
    'irregular heartbeat', 'bp',
  ],
  Dermatologist: [
    'skin', 'rash', 'itching', 'acne', 'eczema', 'hives', 'pimples', 'hair fall',
  ],
  Orthopedic: [
    'joint pain', 'back pain', 'fracture', 'knee pain', 'bone', 'sprain', 'arthritis', 'neck pain',
  ],
  Gastroenterologist: [
    'stomach', 'abdominal pain', 'acidity', 'constipation', 'bloating', 'ulcer', 'nausea',
  ],
  Ophthalmologist: [
    'eye', 'vision', 'blurry', 'redness in eye', 'eye pain', 'watering eyes',
  ],
  ENT: [
    'ear pain', 'hearing', 'sinus', 'nose block', 'throat infection', 'tonsil',
  ],
  Psychiatrist: [
    'stress', 'anxiety', 'depression', 'insomnia', 'panic', 'mood swings', 'sleep problems',
  ],
  Dentist: [
    'tooth', 'toothache', 'gum', 'teeth', 'cavity', 'jaw pain',
  ],
  Pediatrician: [
    'child fever', 'infant', 'baby cough', 'child rash',
  ],
  Gynecologist: [
    'pregnancy', 'menstrual', 'period pain', 'pcos', 'pcod',
  ],
};

const EMERGENCY_KEYWORDS = [
  'severe chest pain', 'can\'t breathe', 'cannot breathe', 'unconscious',
  'heavy bleeding', 'severe', 'stroke', 'seizure', 'suicidal', 'accident',
];

function analyzeSymptoms(symptomText) {
  const text = symptomText.toLowerCase();

  // Determine urgency
  let urgency = 'low';
  if (EMERGENCY_KEYWORDS.some((kw) => text.includes(kw))) {
    urgency = 'high';
  } else if (text.includes('pain') || text.includes('infection')) {
    urgency = 'medium';
  }

  // Score each specialization by keyword matches
  const scores = {};
  for (const [specialization, keywords] of Object.entries(SPECIALIZATION_KEYWORDS)) {
    const matchCount = keywords.filter((kw) => text.includes(kw)).length;
    if (matchCount > 0) scores[specialization] = matchCount;
  }

  let predictedSpecialization = 'General Physician';
  let matchedKeywords = [];
  if (Object.keys(scores).length > 0) {
    predictedSpecialization = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    matchedKeywords = SPECIALIZATION_KEYWORDS[predictedSpecialization].filter((kw) =>
      text.includes(kw)
    );
  }

  return {
    predictedSpecialization,
    urgency,
    matchedKeywords,
    allScores: scores,
  };
}

module.exports = { analyzeSymptoms, SPECIALIZATION_KEYWORDS };
