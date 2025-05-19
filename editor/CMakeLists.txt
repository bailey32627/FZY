
add_executable( Editor ${CMAKE_CURRENT_SOURCE_DIR}/main.c )

target_link_libraries( Editor PRIVATE Engine )
