# Collect all .c files from src/
file(GLOB_RECURSE ENGINE_SOURCES CONFIGURE_DEPENDS
    src/*.c
)

# Define the Engine library
add_library(Engine STATIC ${ENGINE_SOURCES})

# Public headers go in include/
target_include_directories(Engine
    PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}/include  # for #include "Engine/Renderer.h"
)

# define FZY_EXPORTS when building the Engine add_library
target_compile_definitions( Engine PRIVATE FZY_EXPORTS )



# SDL3 is in vendor/SDL
set(CMAKE_PREFIX_PATH "C:/libs/SDL3" )
find_package( SDL3 REQUIRED CONFIG )
target_link_libraries( Engine PUBLIC SDL3::SDL3 )
