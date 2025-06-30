#ifndef FZY_GL_BACKEND_H
#define FZY_GL_BACKEND_H

#ifdef USING_OPENGL

#include "defines.h"
#include "renderer/renderer_types.h"

#include "renderer/opengl/gl_shader.h"
#include "renderer/opengl/gl_mesh.h"
#include "renderer/opengl/gl_texture.h"

/**
  @brief Initialize the opengl renderer

  @param backend Pointer to the backend structure for initialization
  @return true on success otherwise false
*/
b8 gl_renderer_initialize( struct renderer_backend *backend );

/**
  @brief Shutdowns the opengl renderer and frees resources held by it

  @param backend Pointer to the backend structure to free resources from
  @return true on success otherwise false
*/
b8 gl_renderer_shutdown( struct renderer_backend *backend );

void gl_renderer_enable( u8 flag, b8 enable );

/**
  @brief Called when the window is resized to resize the resources

  @param backend The backend structure to access resources from
  @param width The new width of the window
  @param height The new height of the window
*/
void gl_renderer_resized( struct renderer_backend *backend, u16 width, u16 height );

/**
  @brief Begins the frame for the backend, clears the back buffers color and depth textures

  @param backend The backend structure to access
  @param delta_time The time in milliseconds the last frame took to complete
  @return true on success, otherwise false
*/
b8 gl_renderer_begin_frame( struct renderer_backend* backend, f32 delta_time );

/**
  @brief Ends the frame and swaps the front and back buffer for the window

  @param backend The backend structure to access
  @param delta_time The time in milliseconds the last frame took to complete
  @return true on success, otherwise false
*/
b8 gl_renderer_end_frame( struct renderer_backend* backend, f32 delta_time );

/**
  @brief Create the backend resources for a framebuffer ( render target )

  @param framebuffer The buffer to create backend resources for
  @return True if successful
*/
b8 gl_renderpass_create( renderpass* pass, u32 clear_flags );

/**
  @brief Destroys the backend resources for a framebuffer

  @param framebufer The buffer to destroy the resources of
  @return true if successful
*/
b8 gl_renderpass_destroy( renderpass* pass );

/**
  @brief bind the framebuffer for rendering

  @param framebuffer The buffer to bind or 0 to unbind
*/
void gl_renderpass_begin( renderpass* pass );

/**
  @brief bind the framebuffer for rendering

  @param framebuffer The buffer to unbind
*/
void gl_renderpass_end( renderpass* pass );

#endif // USING_OPENGL

#endif // FZY_GL_BACKEND_H
