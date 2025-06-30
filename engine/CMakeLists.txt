# === Collect all source files ===
file(GLOB_RECURSE ENGINE_SOURCES CONFIGURE_DEPENDS
    src/*.c
)

# === Define the Engine library FIRST ===
add_library(Engine SHARED ${ENGINE_SOURCES})

# === Set public include directories ===
target_include_directories(Engine
    PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}/include
        ${CMAKE_SOURCE_DIR}/vendor/stb
)

# === Define preprocessor macros for this library ===
target_compile_definitions(Engine PRIVATE FZY_EXPORTS)

# === SDL3 ===
set(CMAKE_PREFIX_PATH "C:/libs/SDL3")
find_package(SDL3 REQUIRED CONFIG)
target_link_libraries(Engine PUBLIC SDL3::SDL3)

# === Glad (or any other backend) ===
target_link_libraries(Engine PUBLIC glad)

# === Conditional compile definitions based on backend ===
if(SUPPORT_OPENGL)
    target_compile_definitions(Engine PRIVATE FZY_RENDERER_OPENGL)
endif()

if(SUPPORT_VULKAN)
    target_compile_definitions(Engine PRIVATE FZY_RENDERER_VULKAN)
endif()
