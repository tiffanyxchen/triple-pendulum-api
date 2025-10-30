#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import json
import os
import numpy as np
import scipy.integrate as integrate
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from datetime import datetime


# ============================================================
#  ANIMATION FUNCTION (merged from animate.py)
# ============================================================
def animate_and_save(t, x1, y1, x2, y2, x3, y3,
                     theta1_init, theta2_init, theta3_init, L=1.0):

    dt = t[1] - t[0]

    # Project root = directory that contains this file
    project_root = os.path.dirname(os.path.abspath(__file__))
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

    # Create results folder
    results_dir = os.path.join(project_root, "results", timestamp)
    os.makedirs(results_dir, exist_ok=True)

    # Build safe filename
    base = f"results_{theta1_init:.2f}_{theta2_init:.2f}_{theta3_init:.2f}"
    safe_base = base.replace('.', 'p').replace('-', 'm')
    filename = os.path.join(results_dir, safe_base + ".gif")

    # Log ONLY to stderr (safe)
    print(f"[ANIMATION] Saving GIF to: {filename}", file=sys.stderr)

    # Plot setup
    fig, ax = plt.subplots()
    ax.set_xlim(-3 * L, 3 * L)
    ax.set_ylim(-3 * L, 3 * L)
    ax.set_aspect("equal")
    ax.grid()

    line, = ax.plot([], [], 'o-', lw=2)
    time_text = ax.text(0.05, 0.9, '', transform=ax.transAxes)

    def init():
        line.set_data([], [])
        time_text.set_text('')
        return line, time_text

    def animate(i):
        thisx = [0, x1[i], x2[i], x3[i]]
        thisy = [0, y1[i], y2[i], y3[i]]
        line.set_data(thisx, thisy)
        time_text.set_text(f"time = {i * dt:.2f}s")
        return line, time_text

    ani = animation.FuncAnimation(
        fig, animate, frames=len(t), interval=25, init_func=init, blit=True
    )

    ani.save(filename, writer=animation.PillowWriter(fps=30))

    print(f"[ANIMATION] GIF saved: {filename}", file=sys.stderr)

    return filename


# ============================================================
#  DIFFERENTIAL EQUATIONS (same as before)
# ============================================================
g = 9.8
L = 1.0
m = 1.0

def dx(x, t):
    theta1, theta2, theta3, p1, p2, p3 = x
    c12 = np.cos(theta1 - theta2)
    c13 = np.cos(theta1 - theta3)
    c23 = np.cos(theta2 - theta3)

    Delta = 112 - 81*c12**2 + 81*c12*c13*c23 - 36*c13**2 - 63*c23**2
    A = np.array([
        [48 - 27*c23**2, -54*c12 + 27*c13*c23, 81*c12*c23 - 72*c13],
        [-54*c12 + 27*c13*c23, 84 - 27*c13**2, 81*c12*c13 - 126*c23],
        [81*c12*c23 - 72*c13, 81*c12*c13 - 126*c23, 336 - 243*c12**2]
    ])

    dtheta = (1/(m*L**2)) * (A @ np.array([p1, p2, p3])) / Delta
    dtheta1, dtheta2, dtheta3 = dtheta

    dp1 = -1.5*m*L**2*dtheta1*dtheta2*np.sin(theta1-theta2) \
          -0.5*m*L**2*dtheta1*dtheta3*np.sin(theta1-theta3) \
          -2.5*m*g*L*np.sin(theta1)

    dp2 = +1.5*m*L**2*dtheta1*dtheta2*np.sin(theta1-theta2) \
          -0.5*m*L**2*dtheta2*dtheta3*np.sin(theta2-theta3) \
          -1.5*m*g*L*np.sin(theta2)

    dp3 = +0.5*m*L**2*dtheta1*dtheta3*np.sin(theta1-theta3) \
          +0.5*m*L**2*dtheta2*dtheta3*np.sin(theta2-theta3) \
          -0.5*m*g*L*np.sin(theta3)

    return np.array([dtheta1, dtheta2, dtheta3, dp1, dp2, dp3])


# ============================================================
#  MAIN SIMULATION ENTRYPOINT
# ============================================================
def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input"}))
        sys.exit(1)

    input_data = json.loads(sys.argv[1])
    theta1_init = float(input_data["theta1_init"])
    theta2_init = float(input_data["theta2_init"])
    theta3_init = float(input_data["theta3_init"])

    # Time integration
    t = np.linspace(0, 20.0, 800)
    x0 = np.array([theta1_init, theta2_init, theta3_init, 0, 0, 0])
    x = integrate.odeint(dx, x0, t)

    x1 = L * np.sin(x[:, 0])
    y1 = -L * np.cos(x[:, 0])
    x2 = x1 + L * np.sin(x[:, 1])
    y2 = y1 - L * np.cos(x[:, 1])
    x3 = x2 + L * np.sin(x[:, 2])
    y3 = y2 - L * np.cos(x[:, 2])

    # Generate GIF
    gif_path = animate_and_save(
        t, x1, y1, x2, y2, x3, y3,
        theta1_init, theta2_init, theta3_init, L=L
    )

    # Final JSON output
    result = {
        "theta1_series": x[:, 0].tolist(),
        "theta2_series": x[:, 1].tolist(),
        "theta3_series": x[:, 2].tolist(),
        "time": t.tolist(),
        "x1": x1.tolist(),
        "y1": y1.tolist(),
        "x2": x2.tolist(),
        "y2": y2.tolist(),
        "x3": x3.tolist(),
        "y3": y3.tolist(),
        "gifPath": gif_path
    }

    # Very important — ONLY JSON to stdout
    print(json.dumps(result))


if __name__ == "__main__":
    main()
