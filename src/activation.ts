export function sigmoid(z: number): number {
  return Math.pow(1 + Math.exp(-z), -1);
}

export function inverseSigmoid(z: number): number {
  if (z < 0 || z > 1) throw new RangeError("z is out of bounds.");
  return Math.log(z / (1 - z));
}
