export function getMockEmbedding(text: string): number[] {
  // Simulate 384-dim vector
  const hash = text.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return Array.from({ length: 384 }, (_, i) => (Math.sin(hash + i) + 1) / 2);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

