
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

from numpy import *
import numpy as np
import matplotlib.pyplot as plt
import scipy.integrate as integrate
import matplotlib.animation as animation # 

from numba import jit

g = 9.8 # acceleration due to gravity, in m/s^2
L = 1.0 # length of pendulums
m = 1.0 # mass of pendulums

@jit(nopython=True)
def dx(x,t):
    """
    The right-hand side of the pendulum ODE
    x=[x1,x2,x3,x4]
    """
    theta1, theta2, theta3, p1, p2, p3 = x
    
    # cosines
    c12 = np.cos(theta1 - theta2)
    c13 = np.cos(theta1 - theta3)
    c23 = np.cos(theta2 - theta3)
    
    # matrix M
    '''
    M = np.array([
        [7/3, 3/2*c12, 1/2*c13],
        [3/2*c12, 4/3, 1/2*c23],
        [1/2*c13, 1/2*c23, 1/3]
    ])
    '''
    
    # Inverse of M
    # Using symbolic formula from before
    Delta = 112 - 81*c12**2 + 81*c12*c13*c23 - 36*c13**2 - 63*c23**2
    A = np.array([
        [48 - 27*c23**2, -54*c12 + 27*c13*c23, 81*c12*c23 - 72*c13],
        [-54*c12 + 27*c13*c23, 84 - 27*c13**2, 81*c12*c13 - 126*c23],
        [81*c12*c23 - 72*c13, 81*c12*c13 - 126*c23, 336 - 243*c12**2]
    ])
    
    # Velocities: dtheta_i/dt = (1/(m*L^2)) * M^-1 @ p
    dtheta = (1/(m*L**2)) * (A @ np.array([p1, p2, p3])) / Delta
    
    dtheta1, dtheta2, dtheta3 = dtheta
    
    # dp_i/dt = ∂L/∂θ_i
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


# create a time array from 0..100 sampled at 0.1 second steps

# independent variable time
t = linspace(0,20.,800)
dt = t[1]-t[0]
# initial state
x0 = array([pi-0.1, -pi/2, -pi/2, 0, 0, 0])

# integrate your ODE using scipy.integrate.
x = integrate.odeint(dx, x0, t)

x1 =   L * sin(x[:,0])
y1 = - L * cos(x[:,0])
x2 = x1 + L*sin(x[:,1])
y2 = y1 - L*cos(x[:,1])
x3 = x2 + L * sin(x[:, 2])
y3 = y2 - L * cos(x[:, 2])

fig, ax = plt.subplots(1,1)
ax.set_xlim(-3*L,3*L)
ax.set_ylim(-3*L,3*L)

ax.grid()
line, = ax.plot([], [], 'o-', lw=2)
time_template = 'time = %.1fs'
time_text = ax.text(0.05, 0.9, '', transform=ax.transAxes) # transform: position text relative to the axes.

def init():
    line.set_data([], [])
    time_text.set_text('')
    return line, time_text
    #pass

def animate(i):
    thisx = [0, x1[i], x2[i], x3[i]]
    thisy = [0, y1[i], y2[i], y3[i]]

    line.set_data(thisx, thisy)
    time_text.set_text(time_template%(i*dt))
    return line, time_text

ani = animation.FuncAnimation(fig, animate, arange(1, len(t)), interval=25, init_func=init, blit=True)

plt.show() 