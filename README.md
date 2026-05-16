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
4. Started implementing the renderer
    * Created a React component to mount an HTML5 Canvas element using a useRef hook
    * Implemented an animation loop to continuously clear and redraw the canvas
    * Generated an initial array of 150 Boids with randomized starting coordinates
    * (For now) Rendered each bird as a dot on screen
5. Optimized rendering to be less laggy and more smooth
    * Refactored canvas to replace dots with fun ASCII characters
    * Implemented conditional rendering to switch ASCII characters based on the direction
        * Did this by mapping the each boid vector using Math.atan2 into eight quadrants (or octetants whatever its called)
    * I also learned about an interesting O(N^2) performance bottleneck causing frame rate drops during continuous distance checks
        * Optimized Vector class by creating a squared distance method as Math.sqrt() is pretty computationally heavy
    * Overall managed to increase FPS
6. Panned the background gradient
    * Designed a custom CSS animation to pan a background gradient, creating an ambient shader effect
    * Fixed a hardware rendering artifact causing canvas pixelation on High-DPI displays (since I use a Retina display on my mac it looked blurrier than on other screens)
        * Added resolution scaling by using window.devicePixelRatio
    * Finalized typography variables, updating the font weight, family fallbacks, hex color, etc.
    * Defined a SimulationConfig interface to strictly type the physics parameters
    * Implemented React state (useState) in the root application component
7. Added a glasmorphism inspired layout panel
    * Created `ControlPanel.tsx` component
    * Created a custom Stepper component to replace sliders
    * Upgraded the overlay to a glassmorphic design using Tailwind filters
    * Decided to change the Typography to something more elegant, Instrument Serif and Inter
    * Adjusted the canvas gradient to be sky blue and teal
8. Added mouse interactions to control the boids!
    * Created a flee behaviour method to calculate a steering vector that opposes a provided coordinate
    * Developed an interaction radius check within the animation loop to isolate the cursor
    * Added a weight multipliernto the flee vector to prioritize collision avoidance over boid flight
9. Created an info panel explaining how the algorithm works
    * Created an `EducationalModal.tsx` component to explain the simulation
        * Went into detail on the separation, alignment, and cohesion vectors
    * Styled it to match the glassmorphism effect on the control panels
    * Made the popup and text responsive
    * Made sure to include the articles I used as references
10. Made an Export PNG button and added more styling
    * Transitioned the animated background so that users can select the sky gradient
    * Made the textbox drag-and-drop using ctx.measureText to approx bounding boxes
    * Made a PNG export utility utilizing canvas.toDataURL
    * Expanded the ControlPanel UI with color pickers for boids and the sky gradient + font selection
11. Fixed the export to be a GIF that you can add to your github profile
    * Honestly this might be too niche of a feature but I made it specifically because I was looking to add something interesting to my github profile README!
        * Built a special mode just for exporting to GitHub
        * When you click record, the app temporarily changes its shape to a wide rectangle (1200x400), perfectly centers your name, and takes the video for the GIF
    * Moved the animated sky gradient directly inside the canvas drawing loop
    * Added a gif.js to handle recording the animation
        * Because making a GIF takes a lot of computer power, we set it up to run in the background to make sure the app doesn't freeze and the birds keep flying smoothly while your GIF is being made
    * Updated the export button so that it temporarily locks the button while the GIF is being recorded
12. 

---
<div align="center">

### Made with ♡ by Revati Tambe.
</div>