#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Freely Moving Pendulums in Vacuum

g : gravitational acceleration (planetary gravity)
L : lengths of the pendulums
m : masses of the pendulums

Simulates the positions of freely moving pendulums in vacuum 
using the Lagrangian formalism, starting from a given initial 
potential energy.

Created on Tue Oct 7 12:59:47 2025

@author: Tiffany
"""

#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Freely Moving Pendulums in Vacuum
Simulates the positions of three pendulums using the Lagrangian formalism.
"""

import sys
import json
import numpy as np
import scipy.integrate as integrate
from animate import animate_and_save

g = 9.8  # acceleration due to gravity
L = 1.0  # length of pendulums
m = 1.0  # mass of pendulums


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


def main():
    # -------------------------------
    # Validate and parse input
    # -------------------------------
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input provided"}))
        sys.exit(1)

    try:
        input_data = json.loads(sys.argv[1])
        # strict input validation
        if not all(k in input_data for k in ["theta1_init", "theta2_init", "theta3_init"]):
            print(json.dumps({"error": "Missing initial angles"}))
            sys.exit(1)

        theta1_init = float(input_data["theta1_init"])
        theta2_init = float(input_data["theta2_init"])
        theta3_init = float(input_data["theta3_init"])
    except Exception as e:
        print(json.dumps({"error": f"Invalid input: {str(e)}"}))
        sys.exit(1)

    # -------------------------------
    # Time parameters and integration
    # -------------------------------
    t = np.linspace(0, 20.0, 800)
    x0 = np.array([theta1_init, theta2_init, theta3_init, 0, 0, 0])
    x = integrate.odeint(dx, x0, t)

    x1 =   L * np.sin(x[:, 0])
    y1 = - L * np.cos(x[:, 0])
    x2 = x1 + L * np.sin(x[:, 1])
    y2 = y1 - L * np.cos(x[:, 1])
    x3 = x2 + L * np.sin(x[:, 2])
    y3 = y2 - L * np.cos(x[:, 2])

    # -------------------------------
    # Output result as JSON
    # -------------------------------
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
    }

    gif_file = animate_and_save(
        t, x1, y1, x2, y2, x3, y3,
        theta1_init, theta2_init, theta3_init,
        L = L
        )
    result["gifPath"] = gif_file
    print(json.dumps(result))


if __name__ == "__main__":
    main()
