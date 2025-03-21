#!/bin/sh

# Start the backend in the background
cd /app/backend
NODE_ENV=${NODE_ENV:-production} node dist/main.js &
BACKEND_PID=$!

# Wait a moment for the backend to initialize
sleep 3

# Start the frontend server
cd /app
node -e "
const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.join('/app/frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join('/app/frontend/dist/index.html'));
});
const PORT = process.env.FRONTEND_PORT || 80;
app.listen(PORT, () => {
  console.log(\`Frontend server running on port \${PORT}\`);
});"

# Forward signals to child processes
trap 'kill $BACKEND_PID; exit' SIGTERM SIGINT

# Wait for all child processes to exit
wait 