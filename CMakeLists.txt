cmake_minimum_required(VERSION 3.5)
project(FZY)

set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED ON)

# Define build type macros
if(CMAKE_BUILD_TYPE STREQUAL "Debug")
    add_definitions(-DFZY_CONFIG_DEBUG)
elseif(CMAKE_BUILD_TYPE STREQUAL "Release")
    add_definitions(-DFZY_CONFIG_RELEASE)
endif()



# Define platform macros
if(WIN32)
    add_definitions(-DFZY_PLATFORM_WINDOWS)
elseif(APPLE)
    add_definitions(-DFZY_PLATFORM_MACOS)
elseif(UNIX)
    add_definitions(-DFZY_PLATFORM_LINUX)
endif()


# Default all options to OFF
option(BUILD_EDITOR "Build the game editor" OFF)
option(BUILD_GAME "Build the game executable" OFF)
option(BUILD_TESTS "Build tests" OFF)
option(SUPPORT_OPENGL "Enable OpenGL backend" ON)
option(SUPPORT_VULKAN "Enable Vulkan backend" OFF)

# Enable options based on TARGET_NAME
if(DEFINED TARGET_NAME)
    string(TOLOWER "${TARGET_NAME}" TARGET_NAME_LOWER)
    message(STATUS "Configuring build for target: ${TARGET_NAME_LOWER}")

    if(TARGET_NAME_LOWER STREQUAL "editor")
        set(BUILD_EDITOR ON)
    elseif(TARGET_NAME_LOWER STREQUAL "game")
        set(BUILD_GAME ON)
    elseif(TARGET_NAME_LOWER STREQUAL "tests")
        set(BUILD_TESTS ON)
    else()
        message(FATAL_ERROR "Unknown TARGET_NAME: ${TARGET_NAME}")
    endif()
endif()

# Add engine (always needed)
add_subdirectory(engine)
add_subdirectory(vendor/glad)

# Conditionally build subdirectories
if(BUILD_EDITOR)
    add_subdirectory(editor)
endif()

if(BUILD_GAME)
    add_subdirectory(game)
endif()

if(BUILD_TESTS)
    add_subdirectory(tests)
endif()

# ----------------------------
# Install/Packaging with CPack
# ----------------------------

include(InstallRequiredSystemLibraries)

# Install only targets that were actually built
if(BUILD_EDITOR)
    install(TARGETS Editor DESTINATION .)
endif()

if(BUILD_GAME)
    install(TARGETS Game DESTINATION .)
endif()

# Example shared resources
install(DIRECTORY assets/ DESTINATION assets OPTIONAL)

# Package info
set(CPACK_PACKAGE_NAME "FZY")
set(CPACK_PACKAGE_VENDOR "YourCompany")
set(CPACK_PACKAGE_DESCRIPTION_SUMMARY "FZY Game Installer")
set(CPACK_PACKAGE_VERSION "1.0.0")
set(CPACK_PACKAGE_INSTALL_DIRECTORY "FZY")

# Windows specific
if(WIN32)
    set(CPACK_GENERATOR "NSIS")
    install(FILES "C:/libs/SDL3/bin/SDL3.dll" DESTINATION bin)
endif()

# Linux specific
if(UNIX AND NOT APPLE)
    set(CPACK_GENERATOR "TGZ")
endif()

# macOS specific
if(APPLE)
    set(CPACK_GENERATOR "DragNDrop")
endif()

# Include CPack
include(CPack)

# NSIS-specific config to launch the app after install
if(CPACK_GENERATOR STREQUAL "NSIS")
    set(CPACK_NSIS_EXECUTABLES "Editor" "Editor.exe")
    set(CPACK_NSIS_ENABLE_EXECUTE_AFTER_INSTALL ON)
endif()
