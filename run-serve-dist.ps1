#!/usr/bin/env pwsh
# run-serve-dist.ps1
# Builds the project and serves the `dist` folder on port 5000 using npx http-server.
# Usage: Right-click -> "Run with PowerShell" or run from PowerShell: `.
un-serve-dist.ps1`

Set-StrictMode -Version Latest

$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
Write-Host "Changing directory to project root: $scriptDir"
Set-Location $scriptDir

Write-Host "Installing dependencies (this may take a few minutes)..."
npm install

Write-Host "Building the project..."
npm run build

Write-Host "Starting static server (http://localhost:5000) using npx http-server..."
Start-Process -FilePath "npx" -ArgumentList "http-server ./dist -p 5000" -WindowStyle Hidden

Start-Sleep -Seconds 2
Write-Host "Opening http://localhost:5000 in your default browser..."
Start-Process "http://localhost:5000"

Write-Host "Server started. To stop the server, find the http-server process and stop it, or close the spawned terminal window."
