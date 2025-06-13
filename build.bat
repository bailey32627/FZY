@echo off
REM Usage: build.bat TARGET BUILD_TYPE [GENERATOR]
REM Example: build.bat editor Debug "NMake Makefiles"

setlocal enabledelayedexpansion

REM === Arguments with defaults ===
set "TARGET=%1"
if "%TARGET%"=="" (
    echo ERROR: Target not specified.
    echo Usage: build.bat TARGET BUILD_TYPE [GENERATOR]
    exit /b 1
)

set "BUILD_TYPE=%2"
if "%BUILD_TYPE%"=="" (
    set "BUILD_TYPE=Debug"
)

set "GENERATOR=%3"

REM === Resolve script directory (source dir) and fix trailing backslash ===
set "SOURCE_DIR=%~dp0"
if "%SOURCE_DIR:~-1%"=="\" set "SOURCE_DIR=%SOURCE_DIR:~0,-1%"

REM === Normalize build type to lowercase for folder naming ===
set "BUILD_TYPE_LOWER=%BUILD_TYPE%"
for %%A in (Debug Release RelWithDebInfo MinSizeRel) do (
    if /I "%%A"=="%BUILD_TYPE%" set "BUILD_TYPE_LOWER=%%A"
)
set "BUILD_TYPE_LOWER=%BUILD_TYPE_LOWER:~0,1%%BUILD_TYPE_LOWER:~1%"
setlocal disabledelayedexpansion
set "BUILD_TYPE_LOWER=%BUILD_TYPE_LOWER%"
endlocal & set "BUILD_TYPE_LOWER=%BUILD_TYPE_LOWER%"

REM === Choose build folder based on generator and build type ===
if "%GENERATOR%"=="" (
    REM Linux or default, no generator in folder name
    set "BUILD_DIR=%SOURCE_DIR%/build/%TARGET%_%BUILD_TYPE%"
) else (
    REM Replace spaces with underscores in generator name for folder naming
    set "GEN_SAFE=%GENERATOR: =_%"
    set "BUILD_DIR=%SOURCE_DIR%/build/%TARGET%_%BUILD_TYPE%_%GEN_SAFE%"
)

REM Convert forward slashes to backslashes for Windows cmd
set "BUILD_DIR=%BUILD_DIR:/=\%"

echo Source Dir: %SOURCE_DIR%
echo Build Dir: %BUILD_DIR%
echo Target: %TARGET%
echo Build Type: %BUILD_TYPE%
if defined GENERATOR echo Generator: %GENERATOR%

REM === Remove old build directory if exists ===
if exist "%BUILD_DIR%" (
    echo Removing old build directory...
    rmdir /s /q "%BUILD_DIR%"
)

REM === Create build directory ===
mkdir "%BUILD_DIR%"

REM === Configure ===
echo Configuring...
if "%GENERATOR%"=="" (
    cmake -S "%SOURCE_DIR%" -B "%BUILD_DIR%" -DCMAKE_BUILD_TYPE=%BUILD_TYPE% -DTARGET_NAME=%TARGET%
) else (
    cmake -G "%GENERATOR%" -S "%SOURCE_DIR%" -B "%BUILD_DIR%" -DCMAKE_BUILD_TYPE=%BUILD_TYPE% -DTARGET_NAME=%TARGET%
)

if errorlevel 1 (
    echo ERROR: CMake configuration failed.
    exit /b 1
)

REM === Build ===
echo Building...
cmake --build "%BUILD_DIR%" --config %BUILD_TYPE%

if errorlevel 1 (
    echo ERROR: Build failed.
    exit /b 1
)

echo Build succeeded!
endlocal
