#ifndef FZY_GL_TYPES_H
#define FZY_GL_TYPES_H

#include "defines.h"
#include "core/fzy_hashtable.h"

#ifdef FZY_RENDERER_OPENGL

/**  @brief Checks for opengl error and passes them to the logger if found */
void check_gl_error( void );

#ifndef FZY_CONFIG_RELEASE
#define FZY_CHECK_GL_ERROR check_gl_error()
#else
#define FZY_CHECK_GL_ERROR (void)0
#endif // FZY_CONFIG_RELEASE

/** @brief Structure to hold the uniform data for the shader */
typedef struct gl_uniform
{
  u8 type;       // the type of data the uniform holds
  i32 location;  // The location of the uniform
} gl_uniform;
// ---------------------------------------------------------------------------

/** @brief Represents a shader program in opengl  */
typedef struct gl_shader
{
  u32 program;          // The shader program maintained by opengl
  hashtable *uniforms;  // The uniforms maintained in this shader

} gl_shader;
// ----------------------------------------------------------------------------

/** @brief Represents a vertex buffer in opengl */
typedef struct gl_vertex_buffer
{
  u32 vbo;     // holds the vertex buffer object used by opengl

} gl_vertex_buffer;
// ----------------------------------------------------------------------------

/** @brief Represents geometry in opengl, a collections fo vertex buffers and a
      material that renders the geometry onto the screen */
typedef struct gl_mesh
{
  u32 vao;    // holds the opengl vertex array object
  u32 ibo;    // holds the opengl index buffer object

} gl_mesh;
// ----------------------------------------------------------------------------

/** @brief Represents a texture in opengl */
typedef struct gl_texture
{
  u32 id;             // opengl texture id
  u32 format;         // opengl pixel format
  i32 width;          // the width of the texture
  i32 height;         // the height of the textures
  u32 channels;       // the number of color channels used in this texture
  u32 atlas_square;   // the number of textuures held in the atlas, must me 2x2, 3x3, 4x4 etc...
  u8 attachment_type; // Holds the type of attachment this texture is

} gl_texture;
// ----------------------------------------------------------------------------

/** @brief Represents a framebuffer in opengl */
typedef struct gl_framebuffer
{
  u32 buffer;  // brief the buffer index in opengl

} gl_framebuffer;


#endif // FZY_RENDERER_OPENGL
#endif // FZY_GL_TYPES_H
