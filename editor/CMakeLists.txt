
add_executable( Editor ${CMAKE_CURRENT_SOURCE_DIR}/main.c )

target_link_libraries( Editor PRIVATE Engine )

# This maps to the actual build output dir for the Engine DLL
get_target_property(ENGINE_OUTPUT_DIR Engine BINARY_DIR)

add_custom_command(TARGET Editor POST_BUILD
  COMMAND ${CMAKE_COMMAND} -E echo "Copying DLLs..."
  COMMAND ${CMAKE_COMMAND} -E copy_if_different
          "${ENGINE_OUTPUT_DIR}/$<CONFIG>/Engine.dll"
          "$<TARGET_FILE_DIR:Editor>/Engine.dll"
  COMMAND ${CMAKE_COMMAND} -E copy_if_different
          "C:/libs/SDL3/bin/SDL3.dll"
          "$<TARGET_FILE_DIR:Editor>/SDL3.dll"
)
