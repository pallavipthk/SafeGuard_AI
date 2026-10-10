@echo off
title SafeGuard AI - System Launcher
color 0B

echo ====================================================================
echo                SafeGuard AI - System Launcher
echo       Intelligent Road Safety ^& Accident Prevention Platform
echo ====================================================================
echo.

set "ROOT=%~dp0"
if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"

if exist "%ROOT%\backend\app.py" (
    set "PROJ=%ROOT%"
) else if exist "%ROOT%\safeguard-ai\backend\app.py" (
    set "PROJ=%ROOT%\safeguard-ai"
) else (
    set "PROJ=%ROOT%\.."
)

echo [1/4] Checking ports and cleaning up previous sessions...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ports = @(5000, 3000); foreach ($p in $ports) { try { $conns = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue; if ($conns) { foreach ($c in $conns) { if ($c.OwningProcess -and $c.OwningProcess -ne 0) { Write-Host \"  -> Releasing port $p (PID: $($c.OwningProcess))...\"; Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue } } } } catch {} }"

echo [2/4] Starting Backend API Server (Flask - Port 5000)...
start "SafeGuard AI - Backend API" /D "%PROJ%\backend" cmd /k "python app.py"

echo [3/4] Starting Frontend Server (Vite React - Port 3000)...
start "SafeGuard AI - Frontend Web App" /D "%PROJ%\frontend" cmd /k "npm run dev"

echo [4/4] Waiting for servers to initialize...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ready = $false; for ($i=0; $i -lt 20; $i++) { Start-Sleep -Seconds 1; try { $r = Invoke-RestMethod -Uri 'http://127.0.0.1:5000/api/health' -TimeoutSec 1 -ErrorAction Stop; if ($r.status -eq 'healthy') { $ready = $true; break } } catch {} }; if ($ready) { Write-Host '  -> Backend verified healthy!' -ForegroundColor Green } else { Write-Host '  -> Backend starting...' -ForegroundColor Yellow }"

timeout /t 2 >nul
echo.
echo Launching default browser at http://localhost:3000...
start http://localhost:3000

echo.
echo ====================================================================
echo               SafeGuard AI Launch Successful!
echo ====================================================================
echo   Frontend:     http://localhost:3000
echo   Backend API:  http://localhost:5000
echo.
echo   Default Accounts:
echo     Admin: admin@safeguard.ai / Admin@123
echo     User:  user@safeguard.ai  / User@123
echo ====================================================================
echo   Keep the backend and frontend terminal windows open.
echo   To stop all services cleanly at once, double-click 'stop.bat'.
echo ====================================================================
echo.
pause
