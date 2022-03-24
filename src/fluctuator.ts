type Range = {min: number, max: number};

function clamp(value: number, range: Range): number {
  return Math.min(Math.max(value, range.min), range.max);
}

function lerp(range: Range, percent: number): number {
  return range.min + (range.max - range.min) * percent;
}

export class Fluctuator {
  public center: number;
  public period_range: Range;
  public amplitude_range: Range;

  public period: number = 0;
  public amplitude: number = 0;
  public time: number = 0;

  public convergence_rate = 0.1;
  public learning_rate = 0.1;

  /**
   * @param center the sine wave's central position
   * @param period the range of possible periods of the sine wave
   * @param amplitude the maximum distance the fluctuator can wobble
   */
  constructor(
    center: number = 0,
    period: Range = {min: 3, max: 12},
    amplitude: Range = {min: 0, max: 1}
  ) {
    this.center = center;
    this.period_range = period;
    this.amplitude_range = amplitude;
    this.amplitude = amplitude.max;
    this.randomize_period();
  }

  /**
   * Randomize the fluctuator's parameters
   */
  randomize_period() {
    let p = lerp(this.period_range, Math.random());
    this.period = Math.floor(p * 10) / 10;
    this.time = 0;
  }

  get value() {
    return this.center + this.amplitude * Math.sin(this.time * 2 * Math.PI / this.period);
  }

  set value(v: number) {
    this.center = v;
  }

  /**
    * @param dt the time step since the last update
    * @param reward the feedback received from the environment
    */
  update(dt: number, reward: number = 0): number {
    this.amplitude -= this.convergence_rate * this.amplitude * reward;
    this.amplitude = clamp(this.amplitude, this.amplitude_range);

    let d = this.amplitude * Math.sin(this.time * 2 * Math.PI / this.period);
    this.center += this.learning_rate * d * reward;

    this.time += dt;
    if (this.time > this.period) this.randomize_period();

    return d;
  }
}
