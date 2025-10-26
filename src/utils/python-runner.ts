import { spawn } from 'child_process';

export async function runSimulation(payload: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const jsonString = JSON.stringify(payload);

    const py = spawn('venv/bin/python', ['scripts/simulate.py', jsonString]);

    let data = '';
    let error = '';

    py.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    py.stderr.on('data', (chunk) => {
      error += chunk.toString();
    });

    py.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(error));
      } else {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          reject(new Error(`Invalid JSON from Python: ${data}`));
        }
      }
    });
  });
}
