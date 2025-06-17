export function setupUI(scene) {
    const healthBar = document.createElement("div"); // Create a div for the health bar
    healthBar.className = "health-bar"; // Assign CSS class
    document.getElementById("ui").appendChild(healthBar); // Append to the UI container
    console.log("UI setup complete.");
}