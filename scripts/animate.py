import sys
import os
import matplotlib.pyplot as plt
import matplotlib.animation as animation
import numpy as np
from datetime import datetime

def animate_and_save(t, x1, y1, x2, y2, x3, y3, theta1_init, theta2_init, theta3_init, L=1.0):
    dt = t[1] - t[0]

    # -----------------------------
    # Create output directory + filename
    # -----------------------------
    # os.makedirs("results", exist_ok=True)
    # filename = f"results/results_{theta1_init:.2f}_{theta2_init:.2f}_{theta3_init:.2f}"
    # filename = filename.replace('.', 'p').replace('-', 'm')
    # filename = filename + ".gif"   # ← GIF extension instead of CSV
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    timestamp = datetime.now().strftime("%Y-%m-%d")

    results_dir = os.path.join(project_root, "results", timestamp)
    os.makedirs(results_dir, exist_ok=True)

    # Build a safe filename (only modify the name itself, not the path)
    base = f"results_{theta1_init:.2f}_{theta2_init:.2f}_{theta3_init:.2f}"
    safe_base = base.replace('.', 'p').replace('-', 'm')
    filename = os.path.join(results_dir, safe_base + ".gif")

    print(f"Saving animation to {filename}", file = sys.stderr)

    # -----------------------------
    # Plot setup
    # -----------------------------
    fig, ax = plt.subplots(1,1)
    ax.set_xlim(-3*L, 3*L)
    ax.set_ylim(-3*L, 3*L)
    ax.set_aspect("equal")
    ax.grid()

    line, = ax.plot([], [], 'o-', lw=2)
    time_template = 'time = %.2fs'
    time_text = ax.text(0.05, 0.9, '', transform=ax.transAxes)

    def init():
        line.set_data([], [])
        time_text.set_text('')
        return line, time_text

    def animate(i):
        thisx = [0, x1[i], x2[i], x3[i]]
        thisy = [0, y1[i], y2[i], y3[i]]
        line.set_data(thisx, thisy)
        time_text.set_text(time_template % (i * dt))
        return line, time_text

    ani = animation.FuncAnimation(fig, animate, frames=len(t), interval=25, init_func=init, blit=True)

    ani.save(filename, writer=animation.PillowWriter(fps=30))
    print(f"✅ GIF saved: {filename}", file=sys.stderr)

    return filename   # So simulation.py can store it in the DB
