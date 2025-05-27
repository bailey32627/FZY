@echo off
setlocal

echo Cleaning build and dist directories...

REM Define paths
set "BUILD_DIR=%~dp0build"
set "DIST_DIR=%~dp0dist"

REM Remove build directory
if exist "%BUILD_DIR%" (
    echo Deleting build directory: %BUILD_DIR%
    rmdir /s /q "%BUILD_DIR%"
) else (
    echo Build directory not found: %BUILD_DIR%
)

REM Remove dist directory
if exist "%DIST_DIR%" (
    echo Deleting dist directory: %DIST_DIR%
    rmdir /s /q "%DIST_DIR%"
) else (
    echo Dist directory not found: %DIST_DIR%
)

set "FILE=C:\Users\Brad\Dropbox\FZY\log.txt"

if exist "%FILE%" (
    echo Deleting %FILE%...
    del /f /q "%FILE%"
) else (
    echo File not found: %FILE%
)

echo Clean complete.
endlocal
