import { sigmoid } from "./activation";
import { ICTRNN } from "./ictrnn";
import { Fluctuator } from "./fluctuator";

const ACTIVITY_WEIGHT = 0.01;

export class RlCtrnn implements ICTRNN {
  private _size: number;
  private _biases: Fluctuator[];
  private _timeConstants: Fluctuator[];
  private _weights: Fluctuator[][];
  private _fluctuators: Fluctuator[];

  public _activity: number[];
  private _outputs: number[];

  constructor(size: number) {
    this._size = size;
    const o = { length: size };
    this._biases = Array.from(o, () => new Fluctuator(0));
    this._timeConstants = Array.from(o, () => new Fluctuator(1));
    this._weights = Array.from(o, () => Array.from(o, () => new Fluctuator(0)));
    this._fluctuators = [];

    this._activity = Array.from(o, () => 0);
    this._outputs = Array.from(o, () => 0);

    for (let i = 0; i < this._size; i++) {
      this._fluctuators.push(this._biases[i]);
      this._fluctuators.push(this._timeConstants[i]);
      for (let j = 0; j < this._size; j++) {
        this._fluctuators.push(this._weights[i][j]);
      }
    }
    // TODO: replace this with a real way to set the amplitude
    this._fluctuators.forEach((f) => {
      f.amplitude_range.min = 0;
      f.amplitude_range.max = 1;
      f.amplitude = 0;
    });
  }

  get size(): number {
    return this._size;
  }

  get biases(): readonly number[] {
    return this._biases.map((b) => b.value);
  }

  get timeConstants(): readonly number[] {
    return this._timeConstants.map((tc) => tc.value);
  }

  get weights(): readonly (readonly number[])[] {
    return this._weights.map((w) => w.map((w) => w.value));
  }

  get fluctuators(): Fluctuator[][] {
    return this._weights;
  }

  setBias(index: number, bias: number): void {
    this._biases[index].value = bias;
  }

  setTimeConstant(index: number, timeConstant: number): void {
    this._timeConstants[index].value = timeConstant;
  }

  setWeight(from: number, to: number, weight: number): void {
    this._weights[to][from].value = weight;
  }

  addNode(): void {
    const ctrnn = this;
    function normflux(value: number): Fluctuator {
      const f = new Fluctuator(value);
      ctrnn._fluctuators.push(f);
      // f.amplitude_range.min = 0;
      // f.amplitude_range.max = 1;
      // f.amplitude = 0;
      return f;
    }
    this._biases.push(normflux(0));
    this._timeConstants.push(normflux(1));
    for (let i = 0; i < this._size; i++) {
      this._weights[i].push(normflux(0));
    }
    const o = { length: ++this._size };
    this._weights.push(Array.from(o, () => normflux(0)));
  }

  private update_activity(dt: number, voltages: number[]) {
    const outputs = this.getOutputs(voltages);
    for (let i = 0; i < this.size; i++) {
      const weighted = this._activity[i] * (1 - ACTIVITY_WEIGHT);
      const diff = Math.abs(outputs[i] - this._outputs[i]);
      this._activity[i] = weighted + ACTIVITY_WEIGHT * diff;
    }
    this._outputs = outputs;
  }

  update(
    dt: number,
    voltages: number[],
    inputs?: number[],
    locked = false
  ): number[] {
    inputs = inputs !== undefined ? inputs : Array(this._size).fill(0);
    if (inputs.length !== this._size) throw new RangeError();
    // this.update_activity(0, voltages);
    // for (let pre = 0; pre < this.size; pre++) {
    //   for (let post = 0; post < this.size; post++) {
    //     this._weights[pre][post].update(dt, 0);
    //   }
    // }
    const final = voltages.map((v, i) => v + this.getDelta(voltages, i) * dt);
    return final.map((v, i) => v + inputs![i]);
  }

  getOutputs(voltages: number[]): number[] {
    return voltages.map((v, i) => sigmoid(v + this._biases[i].value));
  }

  init_voltage(): number[] {
    return Array(this._size).fill(0);
  }

  private getDelta(voltages: number[], index: number): number {
    const weights = this._weights[index];
    let sum = 0;
    for (let j = 0; j < this._size; j++) {
      const activation = sigmoid(voltages[j] + this._biases[j].value);
      sum += weights[j].value * activation;
    }
    return (sum - voltages[index]) / this._timeConstants[index].value;
  }
}
