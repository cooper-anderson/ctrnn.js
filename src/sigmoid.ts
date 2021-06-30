export function sigmoid(z: number): number {
  return Math.pow(1 + Math.exp(-z), -1);
}

export function inverseSigmoid(z: number): number {
  const x = Math.min(Math.max(z, 0.01), 0.99);
  return Math.log(x / (1 - x));
}
