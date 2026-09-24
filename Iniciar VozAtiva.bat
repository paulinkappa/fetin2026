@echo off
cd /d "%~dp0"

echo ============================================
echo   VozAtiva - iniciando...
echo ============================================
echo.
echo Se abrir uma segunda janela do PowerShell dizendo que a porta
echo 5500 ja esta em uso, pode ignorar - so significa que o servidor
echo ja estava rodando de uma vez anterior. Nao feche janela nenhuma.
echo.

start "VozAtiva - servidor local (NAO FECHE ate acabar a apresentacao)" powershell -NoExit -ExecutionPolicy Bypass -File ".claude\static-server.ps1" -Port 5500

timeout /t 2 /nobreak >nul

start http://localhost:5500

echo.
echo Pronto - o navegador deve abrir sozinho em http://localhost:5500
echo Esta janela aqui (preta, pequena) pode ser fechada normalmente.
echo A OUTRA janela do PowerShell (a do servidor) deve ficar aberta.
echo.
pause
