const express = require('express');
const { spawn } = require('child_process');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Spawn a new shell instance for each connected user
  const shell = spawn(process.platform === 'win32' ? 'cmd' : 'bash');

  const emitBufferedLines = (buffer, emitFunction) => {
    const lines = buffer.split('\n');
    const lastLine = lines.pop();
    lines.forEach((line) => emitFunction(line));
    return lastLine;
  };

  const handleData = (initialBuffer, data, emitFunction) => {
    const buffer = initialBuffer + data.toString();
    return emitBufferedLines(buffer, emitFunction);
  };

  let stdoutBuffer = '';
  let stderrBuffer = '';

  // Listen for command output and send it back to the user
  shell.stdout.on('data', (data) => {
    stdoutBuffer = handleData(stdoutBuffer, data, (line) => socket.emit('output', line));
  });

  shell.stderr.on('data', (data) => {
    stderrBuffer = handleData(stderrBuffer, data, (line) => socket.emit('output', line));
  });

  // Listen for command input from the user and send it to the shell
  socket.on('command', (command) => {
    shell.stdin.write(command + '\n');
  });

  // Clean up the shell instance when the user disconnects
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    shell.kill();
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
