@echo off
if exist "%~dp0..\stop.bat" (
    call "%~dp0..\stop.bat"
) else (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$ports = @(5000, 3000); foreach ($p in $ports) { try { $conns = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue; if ($conns) { foreach ($c in $conns) { if ($c.OwningProcess -and $c.OwningProcess -ne 0) { Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue } } } } catch {} }; Write-Host 'Services stopped.' -ForegroundColor Green"
)
