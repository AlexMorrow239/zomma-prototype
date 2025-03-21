const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const serveStatic = require("serve-static");

// Start backend process
console.log("Starting backend service...");
const backend = spawn("node", ["backend/dist/main.js"], {
  env: { ...process.env, NODE_ENV: process.env.NODE_ENV || "production" },
  stdio: "inherit",
});

backend.on("error", (err) => {
  console.error("Failed to start backend:", err);
  process.exit(1);
});

// Create frontend server
const app = express();

// Serve frontend static files
app.use(serveStatic(path.join(__dirname, "frontend/dist")));

// For any route not found, serve the index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

// Start frontend server
const PORT = process.env.FRONTEND_PORT || 80;
app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});

// Handle process termination
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  backend.kill("SIGTERM");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  backend.kill("SIGINT");
  process.exit(0);
});
