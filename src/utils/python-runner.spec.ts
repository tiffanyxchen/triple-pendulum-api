import { runSimulation } from './python-runner';

describe('Python Runner Integration', () => {
  it('should run the Python script and return valid simulation data', async () => {
    const payload = {
      theta1_init: 0.5,
      theta2_init: 0.6,
      theta3_init: 0.7,
    };

    const result = await runSimulation(payload);

    expect(result).toHaveProperty('theta1_series');
    expect(result).toHaveProperty('theta2_series');
    expect(result).toHaveProperty('theta3_series');
    expect(result).toHaveProperty('time');
    expect(Array.isArray(result.time)).toBe(true);
    expect(result.theta1_series.length).toBeGreaterThan(0);
  }, 10000); // increase timeout in case simulation runs long

  it('should throw an error for invalid input', async () => {
    await expect(runSimulation({})).rejects.toThrow();
  });
});
