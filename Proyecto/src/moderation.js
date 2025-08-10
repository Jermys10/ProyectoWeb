export const bannedWords = [
  'inapropiado',
  'ofensivo',
  'malapalabra'
];

export function containsInappropriateContent(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return bannedWords.some((word) => lower.includes(word));
}
