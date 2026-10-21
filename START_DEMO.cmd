@echo off
cd /d "%~dp0"
echo Open http://127.0.0.1:61448 in your browser after the server starts.
node preview-server.cjs 61448
pause
