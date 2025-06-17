export class NPC {
    constructor(name, dialog) {
        this.name = name;
        this.dialog = dialog;
        this.mesh = this.createNPC();
    }

    createNPC() {
        // Creates a simple box as a placeholder for the NPC
        return BABYLON.MeshBuilder.CreateBox(this.name, { size: 2 });
    }

    speak() {
        console.log(`${this.name}: "${this.dialog}"`);
    }
}