# Running the App Locally (one-click)

This project is a Vite + React + TypeScript app. Browsers cannot directly load the `index.html` in the project root because it imports TypeScript/TSX modules from `/src` that must be compiled or served by a dev server.

Two easy ways to run the app locally are provided below.

1) Recommended — Development (fast, HMR): Vite dev server

  Open PowerShell in the project root and run:

  ```powershell
  npm install
  npm run dev
  # or
  npm run start
  ```

  Then open the URL Vite prints (usually `http://localhost:5173`).

1.1) Start dev with one command (Windows)

  If you want a single double-clickable file to start HMR in Windows, run the bundled `run-dev.bat` (creates `node_modules` if needed and runs `npm run dev:open`):

  ```powershell
  # From project root (or double-click run-dev.bat in Explorer)
  .\run-dev.bat
  ```

  This will run `npm install` (if needed) and then `npm run dev:open` which starts Vite with HMR and opens the browser.

2) One-click preview of the production build (static) — uses PowerShell helper

  The `run-serve-dist.ps1` script will install deps, build the project, start a static server on port 5000, and open the browser for you.

  From PowerShell (project root) run:

  ```powershell
  # Allow script to run for this session if your policy blocks it
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

  # Run the helper
  .\run-serve-dist.ps1
  ```

  This runs `npm install` -> `npm run build` -> `npx http-server ./dist -p 5000`, then opens `http://localhost:5000`.

Notes & troubleshooting
- If `npm` is missing, install Node.js (v18+ recommended).
- If `npx` fails to run `http-server`, you can install it globally:
  ```powershell
  npm install -g http-server
  http-server ./dist -p 5000
  ```
- To preview the built files using the VS Code Live Server extension: build first with `npm run build`, then right-click `dist/index.html` -> "Open with Live Server".
- If the page is white when opening the project root `index.html`, that's expected — browsers cannot run TSX/TypeScript imports without a bundler (use the dev server or built `dist`).

If you want, I can add a `dev:open` script that automatically opens the browser for the Vite dev server or add `http-server` to `devDependencies`. Tell me which you prefer.
