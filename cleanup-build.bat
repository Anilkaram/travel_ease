@echo off
echo Cleaning up Docker build cache and node_modules...
echo.

echo Step 1: Stopping all containers...
docker-compose down -v

echo.
echo Step 2: Removing all travel_ease related images...
for /f "tokens=*" %%i in ('docker images --filter reference="travel_ease*" -q 2^>nul') do docker rmi %%i

echo.
echo Step 3: Cleaning Docker build cache...
docker system prune -f

echo.
echo Step 4: Removing node_modules directories...
if exist "client\node_modules" (
    echo Removing client node_modules...
    rmdir /s /q "client\node_modules"
)

if exist "server\node_modules" (
    echo Removing server node_modules...
    rmdir /s /q "server\node_modules"
)

echo.
echo Step 5: Removing package-lock.json files...
if exist "client\package-lock.json" del "client\package-lock.json"
if exist "server\package-lock.json" del "server\package-lock.json"

echo.
echo Cleanup completed! Now you can run rebuild-with-node18.bat
echo.
pause
