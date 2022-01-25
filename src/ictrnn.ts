export interface ICTRNN {
  get size(): number;
  get biases(): ReadonlyArray<number>;
  get timeConstants(): ReadonlyArray<number>;
  get weights(): ReadonlyArray<ReadonlyArray<number>>;
  setBias(index: number, bias: number): void;
  setTimeConstant(index: number, timeConstant: number): void;
  update(dt: number, voltages: number[], inputs?: number[]): number[];
  setWeight(from: number, to: number, weight: number): void;
  getOutputs(voltages: number[]): number[];
  init_voltage(): number[];
}
