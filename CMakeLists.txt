cmake_minimum_required( VERSION 3.5 )
project( FZY )

set( CMAKE_C_STANDARD 99 )
set( CMAKE_C_STANDARD_REQUIRED ON )

if( NOT CMAKE_BUILDF_TYPE )
    set( CMAKE_BUILD_TYPE Debug )
  endif()

  option(BUILD_EDITOR "Build the game editor" ON)
  option(BUILD_GAME "Build the game executable" ON)
  option(BUILD_TESTS "Build tests" OFF)

  # Add engine (always needed)
  add_subdirectory(engine)

  # Conditionally build editor
  if(BUILD_EDITOR)
      add_subdirectory(editor)
  endif()

  # Conditionally build game
  if(BUILD_GAME)
      add_subdirectory(game)
  endif()
