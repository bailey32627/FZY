#include "renderer/opengl/gl_backend.h"

#ifdef USING_OPENGL

#include "renderer/fzy_window.h"
#include "core/fzy_logger.h"
#include "core/fzy_memory.h"
#include "renderer/opengl/gl_types.h"
#include "resources/fzy_resource_types.h"

#include <glad/glad.h>
#include <SDL3/SDL.h>

const u32 FZY_BYTE = GL_BYTE;
const u32 FZY_UBYTE = GL_UNSIGNED_BYTE;
const u32 FZY_INT = GL_INT;
const u32 FZY_UINT = GL_UNSIGNED_INT;
const u32 FZY_SHORT = GL_SHORT;
const u32 FZY_USHORT = GL_UNSIGNED_SHORT;
const u32 FZY_FLOAT = GL_FLOAT;
const u32 FZY_DOUBLE = GL_DOUBLE;



b8 gl_renderer_initialize( struct renderer_backend *backend )
{
  if (!backend)
    return false;

  glEnable(GL_DEPTH_TEST); FZY_CHECK_GL_ERROR;
  glEnable(GL_CULL_FACE); FZY_CHECK_GL_ERROR;
  glEnable(GL_BLEND); FZY_CHECK_GL_ERROR;
  glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA); FZY_CHECK_GL_ERROR;

  FZY_INFO("OpenGL renderer initialized successfully");
  return true;
} // --------------------------------------------------------------------------

b8 gl_renderer_shutdown( struct renderer_backend *backend )
{
  if( !backend ) return false;

  // No-op for now. Add OpenGL resource cleanup here if needed.
  return true;
} // --------------------------------------------------------------------------

void gl_renderer_enable( u8 flag, b8 enable )
{
  switch( flag )
  {
    case DEPTH:
      if( enable ) glEnable( GL_DEPTH_TEST );
      else glDisable( GL_DEPTH_TEST );
      break;
    default: break;
  }
} // --------------------------------------------------------------------------

void gl_renderer_resized( struct renderer_backend *backend, u16 width, u16 height )
{
  glViewport( 0, 0, width, height ); FZY_CHECK_GL_ERROR;
} // --------------------------------------------------------------------------

b8 gl_renderer_begin_frame( struct renderer_backend* backend, f32 delta_time )
{
  glClearColor( 0.0, 0.0, 0.0, 1.0 );
  glClear( GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT );
  return true;
} // --------------------------------------------------------------------------

b8 gl_renderer_end_frame( struct renderer_backend* backend, f32 delta_time )
{
  window_swap();
  return true;
} // --------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Renderpass
//------------------------------------------------------------------------------

b8 gl_renderpass_create( renderpass* pass, u32 clear_flags )
{
  if( !pass ) return false;

  if (bitmask_test(clear_flags, COLOR)) pass->clear_flags |= GL_COLOR_BUFFER_BIT;
  if (bitmask_test(clear_flags, DEPTH)) pass->clear_flags |= GL_DEPTH_BUFFER_BIT;
  if (bitmask_test(clear_flags, STENCIL)) pass->clear_flags |= GL_STENCIL_BUFFER_BIT;

  if (!pass->internal_data)
  {
    gl_framebuffer* fb = memory_allocate(sizeof(struct gl_framebuffer), MEMORY_TAG_RENDERER);

    u8 attach_pos[ATTACHMENT_TOTAL];
    u8 count = 0;

    for (u8 i = 0; i < ATTACHMENT_TOTAL; i++)
    {
      if (i == ATTACHMENT_DEPTH) continue;
      if (pass->attachments[i]) attach_pos[count++] = i;
    }

    u32 attachments[ATTACHMENT_TOTAL];
    for (u8 i = 0; i < count; ++i)
    {
      attachments[i] = GL_COLOR_ATTACHMENT0 + i;
    }

    glGenFramebuffers(1, &fb->buffer);
    glBindFramebuffer(GL_FRAMEBUFFER, fb->buffer);
    glDrawBuffers(count, attachments);

    gl_texture* texture = 0;
    for (u8 i = 0; i < count; i++)
    {
      texture = (gl_texture*)pass->attachments[attach_pos[i]]->internal_data;
      glFramebufferTexture2D(GL_FRAMEBUFFER, attachments[i], GL_TEXTURE_2D, texture->id, 0);
    }

    if (pass->attachments[ATTACHMENT_DEPTH])
    {
      texture = (gl_texture*)pass->attachments[ATTACHMENT_DEPTH]->internal_data;
      glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, texture->id);
    }

    if (glCheckFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE)
    {
      FZY_ERROR("gl_framebuffer_create - incomplete framebuffer");
      glDeleteFramebuffers(1, &fb->buffer);
      memory_delete(fb, sizeof(struct gl_framebuffer), MEMORY_TAG_RENDERER);
      return false;
    }

    pass->internal_data = fb;
    return true;
  }

  return false;
} // --------------------------------------------------------------------------

b8 gl_renderpass_destroy( renderpass* pass )
{
  if( pass )
  {
    if( pass->internal_data )
    {
      gl_framebuffer* fb = (gl_framebuffer*)pass->internal_data;

      glDeleteFramebuffers( 1, &fb->buffer );
      fb->buffer = 0;
      memory_delete( fb, sizeof( struct gl_framebuffer ), MEMORY_TAG_RENDERER );
      fb = 0;
      return true;
    }
  }
  return false;
} // --------------------------------------------------------------------------

void gl_renderpass_begin( renderpass* pass )
{
  if (!pass || !pass->internal_data) {
    FZY_ERROR("gl_renderpass_begin :: invalid render pass or framebuffer");
    return;
  }

  gl_framebuffer* fb = (gl_framebuffer*)pass->internal_data;
  glBindFramebuffer(GL_FRAMEBUFFER, fb->buffer);

  if (bitmask_test(pass->clear_flags, COLOR)) {
    glClearColor(pass->clear_color.r, pass->clear_color.g, pass->clear_color.b, pass->clear_color.a);
  }

  glViewport(0, 0, pass->width, pass->height);
  glClear(pass->clear_flags);
} // --------------------------------------------------------------------------

void gl_renderpass_end( renderpass* pass )
{
  glBindFramebuffer(GL_FRAMEBUFFER, 0);
  i32 w = window_width();
  i32 h = window_height();
  glViewport(0, 0, w, h);
} // --------------------------------------------------------------------------

#endif // USING_OPENGL
