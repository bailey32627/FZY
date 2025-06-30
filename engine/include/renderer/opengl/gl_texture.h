#ifndef FZY_GL_TEXTURE_H
#define FZY_GL_TEXTURE_H

#include "renderer/opengl/gl_types.h"
#include "resources/fzy_resource_types.h"

#ifdef FZY_RENDERER_OPENGL

/**
  @brief Creates a new opengl texture

  @param tex - the texture to initialize
  @param path - The file path to the texture file
  @param attachment - the type of attachement this texture will be
  @param width - the width of the texture
  @param height - the height of the texture
  @param atlas_square - The number of rows and columns in the texture atlas, 1 if not an atlas
  @return PTR - pointer to the new texture
  @example load a texture from file - gl_texture_create(&my_tex, "assets/textures/brick_diffuse.png", ATTACHMENT_COLOR, 0, 0, 0);
  @example load a writable texture - gl_texture_create(&my_tex, 0, ATTACHMENT_NORMAL, 1024, 1024, 0);
*/
b8 gl_texture_create(texture* out_texture, const char* path, attachment type, u16 width, u16 height, u32 atlas_square);

/**
  @brief Frees the memory and allocated opengl resources fo rthe texture

  @param tex - the texture to free
*/
void gl_texture_destroy( texture* texture );

/**
  @brief binds the texture to render

  @param tex - the texure to bind
*/
void gl_texture_bind( texture* texture, u32 active_texture );

/**
  @brief unbinds the texture
*/
void gl_texture_unbind( void );

#endif // FZY_RENDERER_OPENGL

#endif // FZY_GL_TEXTURE_H
