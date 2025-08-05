@echo off
echo ========================================
echo   n8n Workflow Management
echo ========================================
echo.

echo Choose an option:
echo 1. Backup current n8n workflows
echo 2. Restore workflows from backup
echo 3. Import TravelEase chat workflow
echo 4. Export current workflows
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto backup
if "%choice%"=="2" goto restore
if "%choice%"=="3" goto import
if "%choice%"=="4" goto export
goto end

:backup
echo.
echo Creating backup of n8n workflows...
docker exec travel_ease_n8n_1 n8n export:workflow --backup --output=/home/node/.n8n/workflows/backup.json
echo Backup created successfully!
goto end

:restore
echo.
echo Restoring workflows from backup...
docker exec travel_ease_n8n_1 n8n import:workflow --input=/home/node/.n8n/workflows/backup.json
echo Workflows restored successfully!
goto end

:import
echo.
echo Importing TravelEase chat workflow...
echo Please manually import the workflow file in n8n dashboard:
echo 1. Open http://localhost:5678
echo 2. Click "Add workflow"
echo 3. Click "Import from file"
echo 4. Select: chat-agent/enhanced-n8n-chat-workflow.json
echo 5. Configure MongoDB credentials
echo 6. Save and activate the workflow
echo.
echo For detailed instructions, see: chat-agent/N8N_SETUP_GUIDE.md
goto end

:export
echo.
echo Exporting current workflows...
docker exec travel_ease_n8n_1 n8n export:workflow --all --output=/home/node/.n8n/workflows/export.json
echo Workflows exported successfully!
goto end

:end
echo.
pause
