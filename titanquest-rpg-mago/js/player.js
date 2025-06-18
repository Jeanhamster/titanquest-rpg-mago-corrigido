export class Player {
    constructor(scene) {
        this.scene = scene; // Store the scene reference
        this.mesh = null; // Player's 3D mesh
        this.animations = {}; // Store animation groups
    }

    async loadModel() {
        try {
            const result = await BABYLON.SceneLoader.ImportMeshAsync(
                "",
                "assets/models/", // VERIFIQUE ESTE CAMINHO CUIDADOSAMENTE!
                "raw_meat.glb",
                this.scene // The scene to load the model into
            );

            this.mesh = result.meshes[0]; // Get the main mesh
            this.mesh.name = "Player"; // Name the mesh
            this.mesh.position = new BABYLON.Vector3(0, 0.5, 0); // Initial position, slightly above ground

            // Adjust scale if necessary
            this.mesh.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5); // Adjust scale to 50%

            // Configure collisions
            this.mesh.checkCollisions = true; // Enable collisions for the player mesh

            // Extract animations (if the model has them)
            // It's crucial that "Idle", "Walk", "Attack" match the animation group names in your FBX file
            this.animations = {
                idle: this.scene.getAnimationGroupByName("Idle"), // Get "Idle" animation group
                walk: this.scene.getAnimationGroupByName("Walk"), // Get "Walk" animation group
                attack: this.scene.getAnimationGroupByName("Attack") // Get "Attack" animation group
            };

            // Start idle animation if available
            if (this.animations.idle) {
                this.animations.idle.start(true); // Start idle animation in a loop
            }

            console.log("Player model loaded successfully! Mesh:", this.mesh);
            // Adicione uma verificação para garantir que o mesh é visível
            if (this.mesh) {
                this.mesh.setEnabled(true); // Garante que o mesh não está desabilitado
            }

        } catch (error) {
            // Este log mostrará mais detalhes do erro
            console.error("Error loading player model:", error.message || error);
            if (error.stack) {
                console.error("Stack trace:", error.stack);
            }
        }
    }
}