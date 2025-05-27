@echo off
setlocal

REM === Usage: package.bat TARGET BUILD_TYPE [GENERATOR] ===

set "TARGET=%1"
if "%TARGET%"=="" (
    echo ERROR: Target not specified.
    echo Usage: package.bat TARGET BUILD_TYPE [GENERATOR]
    exit /b 1
)

set "BUILD_TYPE=%2"
if "%BUILD_TYPE%"=="" (
    set "BUILD_TYPE=Debug"
)

set "GENERATOR=%3"

REM === Resolve script directory ===
set "SOURCE_DIR=%~dp0"
if "%SOURCE_DIR:~-1%"=="\" set "SOURCE_DIR=%SOURCE_DIR:~0,-1%"

REM === Normalize build type for folder naming ===
set "BUILD_TYPE_LOWER=%BUILD_TYPE%"
for %%A in (Debug Release RelWithDebInfo MinSizeRel) do (
    if /I "%%A"=="%BUILD_TYPE%" set "BUILD_TYPE_LOWER=%%A"
)
setlocal disabledelayedexpansion
set "BUILD_TYPE_LOWER=%BUILD_TYPE_LOWER%"
endlocal & set "BUILD_TYPE_LOWER=%BUILD_TYPE_LOWER%"

REM === Generate build directory path ===
if "%GENERATOR%"=="" (
    set "BUILD_DIR=%SOURCE_DIR%\build\%TARGET%_%BUILD_TYPE_LOWER%"
) else (
    set "GEN_SAFE=%GENERATOR: =_%"
    set "BUILD_DIR=%SOURCE_DIR%\build\%TARGET%_%BUILD_TYPE_LOWER%_%GEN_SAFE%"
)

REM === Convert slashes ===
set "BUILD_DIR=%BUILD_DIR:/=\%"

echo.
echo Source Dir: %SOURCE_DIR%
echo Build Dir: %BUILD_DIR%
echo Target: %TARGET%
echo Build Type: %BUILD_TYPE%
if defined GENERATOR echo Generator: %GENERATOR%

REM === Install step (copies files to staging directory) ===
echo.
echo Installing...
cmake --install "%BUILD_DIR%" --config %BUILD_TYPE% --prefix "%SOURCE_DIR%\dist"
if errorlevel 1 (
    echo ERROR: Installation failed.
    exit /b 1
)

REM === Package step (runs CPack) ===
echo.
echo Packaging...
cmake --build "%BUILD_DIR%" --config %BUILD_TYPE% --target package
if errorlevel 1 (
    echo ERROR: Packaging failed.
    exit /b 1
)

echo.
echo Package created successfully.
endlocal
