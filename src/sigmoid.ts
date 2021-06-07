export function sigmoid(z: number): number {
  return Math.pow(1 + Math.exp(-z), -1);
}
