export class Player {
    constructor(scene) {
        this.scene = scene; // Store the scene reference
        this.mesh = null; // Player's 3D mesh
        this.animations = {}; // Store animation groups
        this.speed = 0.1; // Movement speed
        this.isMoving = false; // Flag to track movement
        this.input = {
            w: false,
            a: false,
            s: false,
            d: false
        }; // Input state for WASD

        // Event listeners for keyboard input
        this.scene.actionManager = new BABYLON.ActionManager(this.scene); // Ensure ActionManager is initialized

        this.scene.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnKeyDownTrigger,
                (evt) => {
                    this.handleKeyDown(evt.sourceEvent.key); // Handle key down events
                }
            )
        );

        this.scene.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnKeyUpTrigger,
                (evt) => {
                    this.handleKeyUp(evt.sourceEvent.key); // Handle key up events
                }
            )
        );

        // Pointer lock to control mouse
        this.scene.onPointerDown = () => {
            if (!this.scene.isPointerLock) {
                this.scene.enterPointerLock(); // Enter pointer lock on click
            }
        };

        // Mouse move listener for rotation
        this.scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERMOVE:
                    if (this.scene.isPointerLock) {
                        this.handleMouseMove(pointerInfo.event); // Handle mouse move for rotation
                    }
                    break;
            }
        });

        // Register update loop for movement
        this.scene.onBeforeRenderObservable.add(() => {
            this.updateMovement(); // Update movement on each frame
        });
    }

    async loadModel() {
        try {
            const result = await BABYLON.SceneLoader.ImportMeshAsync(
                "",
                "assets/models/", // VERIFIQUE ESTE CAMINHO CUIDADOSAMENTE!
                "veado.glb", //
                this.scene // The scene to load the model into
            );

            this.mesh = result.meshes[0]; // Get the main mesh
            this.mesh.name = "Player"; // Name the mesh
            this.mesh.position = new BABYLON.Vector3(0, 0.05, 0); // Initial position, slightly above ground

            // Adjust scale if necessary
            this.mesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1); // Adjust scale to 50%

            // Configure collisions
            this.mesh.checkCollisions = true; // Enable collisions for the player mesh
            // You might want to add an ellipsoid for more accurate collision detection
            this.mesh.ellipsoid = new BABYLON.Vector3(0.5, 1, 0.5); // Example ellipsoid
            this.mesh.ellipsoidOffset = new BABYLON.Vector3(0, 0.5, 0); // Example ellipsoid offset

            // Extract animations (if the model has them)
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

    handleKeyDown(key) {
        key = key.toLowerCase(); // Convert key to lowercase
        if (this.input.hasOwnProperty(key)) {
            this.input[key] = true; // Set input state to true
        }
    }

    handleKeyUp(key) {
        key = key.toLowerCase(); // Convert key to lowercase
        if (this.input.hasOwnProperty(key)) {
            this.input[key] = false; // Set input state to false
        }
    }

    handleMouseMove(event) {
        if (!this.mesh) return; // Ensure mesh exists

        const sensitivity = 0.005; // Mouse sensitivity
        const rotationX = -event.movementX * sensitivity; // Calculate rotation based on mouse movement
        this.mesh.rotation.y += rotationX; // Apply rotation to player's Y-axis
    }

    updateMovement() {
        if (!this.mesh) return; // Ensure mesh exists

        let moveDirection = BABYLON.Vector3.Zero(); // Initialize movement direction
        this.isMoving = false; // Reset movement flag

        if (this.input.w) {
            moveDirection.z += 1; // Move forward
            this.isMoving = true; // Set moving flag
        }
        if (this.input.s) {
            moveDirection.z -= 1; // Move backward
            this.isMoving = true; // Set moving flag
        }
        if (this.input.a) {
            moveDirection.x -= 1; // Move left
            this.isMoving = true; // Set moving flag
        }
        if (this.input.d) {
            moveDirection.x += 1; // Move right
            this.isMoving = true; // Set moving flag
        }

        if (this.isMoving) {
            moveDirection = BABYLON.Vector3.TransformNormal(moveDirection, this.mesh.getWorldMatrix()); // Transform direction to world space
            moveDirection.y = 0; // Keep movement on the horizontal plane
            moveDirection = moveDirection.normalize().scale(this.speed); // Normalize and scale by speed
            this.mesh.moveWithCollisions(moveDirection); // Apply movement with collision detection

            // Play walk animation if available and not already playing
            if (this.animations.walk && !this.animations.walk.isPlaying) {
                this.animations.idle.stop(); // Stop idle animation
                this.animations.walk.start(true); // Start walk animation in a loop
            }
        } else {
            // Play idle animation if available and not already playing
            if (this.animations.idle && !this.animations.idle.isPlaying) {
                this.animations.walk.stop(); // Stop walk animation
                this.animations.idle.start(true); // Start idle animation in a loop
            }
        }
    }
}