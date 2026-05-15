# Boids

An ASCII styled simulation of bird flocks, algorithmically generated using the Boids algorithm.

## Features
* An interactive home page with about, work, and contact sections
* A custom guestbook where visitors can plant a flower in my digital garden and leave me a message
* A markdown-based blogging system built on file-based routing to track all of my ideas
    * Blog includes a tagging system to organize posts and make them easier to find
* Lots of interactive, hand drawn animations to make my site fun!

## Tech Stack
A list of the toools used to build my website:
1. React
    * Framework
2. Tailwind CSS v4
    * Used for all of the styling

## Developer Log (for Hack Club's Sleepover event!)
This is an hour by hour log of everything I worked on and when each feature was implemented.

1. Project setup and vector math
    * Set up project repo + boilerplate
    * Set up README file with the project log
    * Installed Tailwind v4
    * Set up file structure, created `src/components`, `src/engine`, and `src/hooks`
    * Spent some time reading over the Boids model to understand the physics
    * Implemented a 2D Vector class to handle physics
    * Created basic methods for adding, subtracting, scalar multiplication, division
    * Added magnitude, normalization, and distance algorithms (needed for vector math)
2. Created Boid.ts
    * This file stores the variables for position, velocity, acceleration
    * Calculate movement by applying acceleration to velocity and velocity to position
    * Built an accumulation function (from my calc bc class!) to process external steering forces
        * Steering forces are essentailly the difference between where an object wants to go and where it is currently going (Desired Velocity - Current Velocity)
    * Long distance weighting calculate a "repulsive" vector that stops boids from colliding with other ones
3. Updated Boid.ts to add alignment math
    * Implemented alignment math to calculate a force that steers boids toward the average heading of local flocks
    * Implemented cohesion math to steer boids toward the average position of local flocks
    * Integrated all three forces into a single flock method
    * Built a boundary management function to enforce toroidal space, allowing boids to wrap seamlessly across the screen edges
        * ***Toroidal space make sure when an object exits the left side of the screen it reappears on the far right side at the exact same y-coordinate (same for up/down with x coordinate)
4. 

---
<div align="center">

### Made with ♡ by Revati Tambe.
</div>