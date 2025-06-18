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
    // Remover ou comentar camera.attachControl(canvas, true) pois o player já controla a rotação com o mouse.
    // camera.attachControl(canvas, true); // Comente esta linha para evitar conflito com o controle do player.
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
    const groundTexture = new BABYLON.Texture("assets/textures/textures/grama.jpg", scene); // Load the ground texture

    groundTexture.uScale = 10; // Repeat texture 10x on X axis
    groundTexture.vScale = 10; // Repeat texture 10x on Y axis
    groundMaterial.diffuseTexture = groundTexture; // Apply the texture
    groundMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1); // Reduce shininess

    ground.material = groundMaterial; // Apply material to the ground
    ground.receiveShadows = true; // Allow shadows on the ground

    // Enable collisions for the scene
    scene.collisionsEnabled = true; // Enable scene-wide collisions
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0); // Apply gravity

    // Player
    player = new Player(scene); // Create a new Player instance
    await player.loadModel(); // Load the player model asynchronously

    // Faça a câmera acompanhar a rotação e posição do player
    if (player.mesh) {
        // Criar um "pai" invisível para a câmera que herda a rotação do player
        const cameraRig = new BABYLON.TransformNode("cameraRig", scene);
        cameraRig.parent = player.mesh; // O rig segue o player
        cameraRig.position = new BABYLON.Vector3(0, 0, 0); // Posição do rig relativa ao player

        camera.parent = cameraRig; // A câmera é filha do rig
        camera.position = new BABYLON.Vector3(0, 5, -7); // Posição da câmera relativa ao rig (atrás e acima)
        camera.setTarget(BABYLON.Vector3.Zero()); // Alvo da câmera é o centro do rig (que está no player)
        camera.useFramingBehavior = true; // Opcional: para um comportamento mais suave de seguir
        camera.framingBehavior.framingTime = 0; // Ajuste para quão rápido a câmera "alcança"
        camera.framingBehavior.elasticity = 0; // Ajuste para a suavidade do movimento
        camera.radius =100;//stância da câmera ao alvo (player)
        camera.lowerRadiusLimit = 5; // Limite mínimo de zoom
        camera.upperRadiusLimit = 200; // Limite máximo de zoom
        camera.wheelPrecision = 100; // Sensibilidade do zoom com a roda do mouse

        // Sincronizar a rotação horizontal da câmera com a do player
        scene.onBeforeRenderObservable.add(() => {
            if (player.mesh) {
                cameraRig.rotation.y = player.mesh.rotation.y; // O rig da câmera herda a rotação Y do player
            }
        });
    }


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