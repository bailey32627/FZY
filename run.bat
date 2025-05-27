@echo off
setlocal enabledelayedexpansion

:: === USAGE: run.bat editor debug ===
set TARGET=%1
set BUILD_TYPE=%2

if "%TARGET%"=="" (
    echo Usage: run.bat [editor|game] [debug|release]
    exit /b 1
)

if "%BUILD_TYPE%"=="" (
    set BUILD_TYPE=release
)

:: Set the path to the executable
set RUN_PATH=%~dp0build\%TARGET%_%BUILD_TYPE%\editor\%BUILD_TYPE%\%TARGET%.exe

:: Check if the file exists
if not exist "%RUN_PATH%" (
    echo ERROR: Executable not found at: %RUN_PATH%
    echo Make sure you built and deployed first using deploy.bat
    exit /b 1
)

echo Running %RUN_PATH%...
echo ---------------------------------------
start "" "%RUN_PATH%"
::"%RUN_PATH%"
