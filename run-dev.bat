@echo off
REM run-dev.bat - install deps and start Vite dev server (opens browser)
cd /d "%~dp0"
echo Installing dependencies (if needed)...
npm install
echo Starting Vite dev server with HMR and opening browser...
npm run dev:open
echo Dev server exited. Press any key to close.
pause >nul
