file( GLOB GAME_SOURCES *.c )

add_executable( Game ${GAME_SOURCES} )

target_include_directories( Game
PRIVATE ${PROJECT_SOURCE_DIR}/include
)

target_link_libraries( Game PRIVATE Engine )
