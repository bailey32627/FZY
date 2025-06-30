#ifndef FZY_GL_SHADER_H
#define FZY_GL_SHADER_H

#include "renderer/opengl/gl_types.h"
#include "resources/fzy_resource_types.h"

#ifdef USING_OPENGL
/**
  @brief Compiles the given code into the given type of opengl shader. Returns
    0 on falure

  @param code Pointer to the shader code to use
  @param type GLenum describing the type of shader ( GL_VERTEX_SHADER, GL_FRAGMENT_SHADER, ... )
  @return Shader id on success, 0 on failure
*/
u32 gl_compile_shader( const char *code, u32 type );

/**
  @brief creates and links the shader program in opengl

  @param vertex_shader Id of the vertex shader to link ( created with opengl_compile_shader )
  @param fragment_shader ID to the fragment shader to link (created with opengl_compile_shader )
  @return ID of the shader program or 0 if failed
*/
u32 gl_link_shader( u32 vertex_shader, u32 fragment_shader );

/**
  @brief creates an opengl shader

  @param sdr The shader to initialize the internal data of
  @param vertex File name for the vertex shader to use ( Required )
  @param fragment File name for the fragment shader to use ( Required )
  @return True if successful, otherwise false
*/
b8 gl_shader_create( shader* sdr, const char* vertex, const char* fragment );

/**
  @brief Frees the shader and the opengl resources held

  @param shader The opengl_shader to free
  @return true if successful, false otherwise
*/
b8 gl_shader_destroy( shader* sdr );

/**
  @brief Add a uniform to the uniforms table in the shader

  @param shader The shader to add uniform to
  @param name The name of the uniform
  @param type The uniform type
  @return True if successful, false otherwise
*/
b8 gl_shader_add_uniform( shader* sdr, const char* name, u8 type );

/**
  @brief Returns the uniform location inside the shader

  @param shader Shader to access
  @param name The name of the shader to get the location of
  @param out_type Pointer to a uniform_type to set for the type of the accessed uniform
  @return Pointer to the uniform structure, or 0 if not found
*/
gl_uniform* gl_shader_get_uniform( gl_shader* sdr, const char* name );

/**
  @brief Sets the value of the uniform with the given name

  @param shader The opengl_shader to access
  @param name The name of the uniform
  @param value Pointer to the value to copy to the uniform
*/
void gl_shader_set_uniform( shader* sdr, const char* name, void* value );

/**
  @brief Tells opengl to use this shader to draw, pass 0 to unbind

  @param shader The shader to bind
*/
void gl_shader_use( shader* sdr );

#endif // USING_OPENGL
#endif // FZY_GL_SHADER_H
