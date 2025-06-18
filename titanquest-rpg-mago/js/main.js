import { Player } from './player.js'; // Import Player class
import { setupUI } from './ui.js'; // Import setupUI function

const canvas = document.getElementById("gameCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Create Babylon.js engine

let player; // Declare player globally so it can be accessed

// Function to create the scene and initialize game elements
const createGameScene = async () => {
    const scene = new BABYLON.Scene(engine); // Create a new scene
    scene.clearColor = new BABYLON.Color3(0.5, 0.8, 0.9); // Sky color

    // Camera
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, BABYLON.Vector3.Zero(), scene); // Create a camera
    camera.attachControl(canvas, true); // Attach camera controls to canvas
    camera.setTarget(BABYLON.Vector3.Zero()); // Set camera target

    // Light
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene); // Create a light source
    light.intensity = 0.7; // Set light intensity

    // Ground
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { 
        width: 100, 
        height: 100 
    }, scene); // Create the ground mesh

    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene); // Create a material for the ground
    // **CORRECTION:** Ensure the texture path is correct relative to index.html
    const groundTexture = new BABYLON.Texture("assets/textures/textures/grama.jpg", scene); // Load the ground texture

    groundTexture.uScale = 10; // Repeat texture 10x on X axis
    groundTexture.vScale = 10; // Repeat texture 10x on Y axis
    groundMaterial.diffuseTexture = groundTexture; // Apply the texture
    groundMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1); // Reduce shininess

    ground.material = groundMaterial; // Apply material to the ground
    ground.receiveShadows = true; // Allow shadows on the ground

    // Player
    player = new Player(scene); // Create a new Player instance
    await player.loadModel(); // Load the player model asynchronously

    // UI Setup
    setupUI(scene); // Initialize the UI

    return scene;
};

// Initialize the game
createGameScene().then(scene => {
    engine.runRenderLoop(() => {
        scene.render(); // Render the scene in a loop
    });
});

// Handle window resize
window.addEventListener("resize", () => {
    engine.resize(); // Resize the Babylon.js engine when window resizes
});