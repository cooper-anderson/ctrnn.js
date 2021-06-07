import { Node } from "./node";
import { sigmoid } from "./sigmoid";

/**
 * Continuous-Time Recurrent Neural Network (`CTRNN`) implementation for JS.
 *
 * # Example
 *
 * ```typescript
 * import CTRNN from "ctrnn.js";
 * let ctrnn = new CTRNN();
 * ```
 */
export class CTRNN {
  /**
   * Number of nodes in the network
   */
  private count: number;
  /**
   * Array of each node's parameters:
   * - `bias`: how stimulated a neuron must be before activating
   * - `time_constant`: the excitatory component of a neuron
   */
  private nodes: Node[];
  /**
   * Array of each node's ***input*** weights
   * e.g. `weights[i][j]` is the weight ***FROM*** node `j` ***TO*** node `i`
   */
  private weights: number[][];
  /**
   * Array of each node's activation
   */
  public states: number[];

  constructor(nodes: number = 4) {
    let opts = { length: nodes };
    this.count = nodes;
    this.nodes = Array.from(opts, () => ({bias: 0, timeConstant: 1.0}));
    this.weights = Array.from(opts, () => Array.from(opts, () => 0));
    this.states = Array.from(opts, () => 0.5);
  }

  /*
   * TODO:
   * Replace these `set` methods with a general `setNode` method that takes an
   * object with `bias` and `timeConstant` attributes, and maybe even `weights`
   */

  // TODO: Documentation
  public setWeight(from: number, to: number, weight: number) {
    this.weights[to][from] = weight;
  }

  // TODO: Documentation
  public setBias(node: number, bias: number) {
    this.nodes[node].bias = bias;
  }

  // TODO: Documentation
  public setTimeConstant(node: number, timeConstant: number) {
    this.nodes[node].timeConstant = timeConstant;
  }

  // TODO: Documentation
  public tick(inputs: number[], dt: number) {
    const states = [];
    for (let i = 0; i < this.count; i++) {
      states.push(inputs[i] || (this.states[i] + this.getDelta(i) * dt));
    }
    this.states = states;
  }

  // TODO: Documentation
  private getDelta(node: number): number {
    const weights = this.weights[node];
    let sum = 0;
    for (let i = 0; i < this.count; i++) sum += weights[i] * this.states[i];
    const lhs = sigmoid(sum - this.nodes[node].bias) - this.states[node];
    return lhs / this.nodes[node].timeConstant;
  }
}
