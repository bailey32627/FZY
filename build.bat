@echo off
REM === Usage: build.bat TARGET BUILD_TYPE [GENERATOR] [BACKEND] ===
REM === Example: build.bat editor Debug "NMake Makefiles" vulkan ===

REM === Required argument ===
set "TARGET=%~1"
if "%TARGET%"=="" (
    echo ERROR: Target not specified.
    echo Usage: build.bat TARGET BUILD_TYPE [GENERATOR] [BACKEND]
    exit /b 1
)

REM === Optional arguments ===
set "BUILD_TYPE=%~2"
if "%BUILD_TYPE%"=="" set "BUILD_TYPE=Debug"

set "GENERATOR=%~3"
set "BACKEND=%~4"
if "%BACKEND%"=="" set "BACKEND=opengl"

REM === Source directory ===
set "SOURCE_DIR=%~dp0"
if "%SOURCE_DIR:~-1%"=="\" set "SOURCE_DIR=%SOURCE_DIR:~0,-1%"

REM === Sanitize build folder name ===
set "GEN_SUFFIX="
if not "%GENERATOR%"=="" (
    set "GEN_SUFFIX=%GENERATOR: =_%"
)

set "BUILD_DIR=%SOURCE_DIR%\build\%TARGET%_%BUILD_TYPE%_%GEN_SUFFIX%_%BACKEND%"
set "BUILD_DIR=%BUILD_DIR::=%"
set "BUILD_DIR=%BUILD_DIR:"=%"

echo:
echo === Configuration ===
echo Target:       %TARGET%
echo Build Type:   %BUILD_TYPE%
if not "%GENERATOR%"=="" echo Generator:     %GENERATOR%
echo Backend:      %BACKEND%
echo Build Dir:    %BUILD_DIR%
echo Source Dir:   %SOURCE_DIR%
echo:

REM === Set CMake backend flags ===
set "CMAKE_BACKEND_FLAGS="
if /I "%BACKEND%"=="opengl" (
    set "CMAKE_BACKEND_FLAGS=-DSUPPORT_OPENGL=ON -DSUPPORT_VULKAN=OFF"
) else if /I "%BACKEND%"=="vulkan" (
    set "CMAKE_BACKEND_FLAGS=-DSUPPORT_OPENGL=OFF -DSUPPORT_VULKAN=ON"
) else if /I "%BACKEND%"=="both" (
    set "CMAKE_BACKEND_FLAGS=-DSUPPORT_OPENGL=ON -DSUPPORT_VULKAN=ON"
) else (
    echo ERROR: Invalid backend '%BACKEND%'. Use "opengl", "vulkan", or "both".
    exit /b 1
)

REM === Clean and create build directory ===
if exist "%BUILD_DIR%" (
    echo Removing old build directory...
    rmdir /s /q "%BUILD_DIR%"
)
mkdir "%BUILD_DIR%"

REM === Run CMake ===
echo Running CMake configuration...
if "%GENERATOR%"=="" (
    cmake -S "%SOURCE_DIR%" -B "%BUILD_DIR%" -DCMAKE_BUILD_TYPE=%BUILD_TYPE% %CMAKE_BACKEND_FLAGS%
) else (
    cmake -G "%GENERATOR%" -S "%SOURCE_DIR%" -B "%BUILD_DIR%" -DCMAKE_BUILD_TYPE=%BUILD_TYPE% %CMAKE_BACKEND_FLAGS%
)

if errorlevel 1 (
    echo ERROR: CMake configuration failed.
    exit /b 1
)

echo Building project...
cmake --build "%BUILD_DIR%" --config %BUILD_TYPE%

if errorlevel 1 (
    echo ERROR: Build failed.
    exit /b 1
)

echo:
echo Build succeeded!
