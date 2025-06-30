#include "renderer/opengl/gl_texture.h"
#include "core/fzy_memory.h"
#include "core/fzy_logger.h"
#include "resources/fzy_image.h"

#ifdef USING_OPENGL
#include <glad/glad.h>

static void setup_float_texture(GLenum format, GLenum channels, u16 width, u16 height, u32* id_out)
{
  glGenTextures(1, id_out);
  glBindTexture(GL_TEXTURE_2D, *id_out);
  glTexImage2D(GL_TEXTURE_2D, 0, format, width, height, 0, channels, GL_FLOAT, 0);
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
} // ---------------------------------------------------------------------------


b8 gl_texture_create( texture* texture, const char *path, u32 atlas_square )
{
  gl_texture* o_tex = memory_allocate( sizeof( gl_texture ), MEM_TAG_TEXTURE );

  o_tex->id = 0;
  o_tex->atlas_square = atlas_square;

  image *img = image_create( path );

  if( !img || image->channels < 3 || image->channels > 4 )
  {
    if( !img )
      FZY_WARNING( "gl_texture_create :: failed to create image" );

    static const f32 pixels[ ] = {
      0.f, 0.f, 1.f,  1.f, 1.f, 1.f,  0.f, 0.f, 1.f,  1.f, 1.f, 1.f,
      1.f, 1.f, 1.f,  0.f, 0.f, 1.f,  1.f, 1.f, 1.f,  0.f, 0.f, 1.f,
      0.f, 0.f, 1.f,  1.f, 1.f, 1.f,  0.f, 0.f, 1.f,  1.f, 1.f, 1.f,
      1.f, 1.f, 1.f,  0.f, 0.f, 1.f,  1.f, 1.f, 1.f,  0.f, 0.f, 1.f
    };
    o_tex->id = 0;
    o_tex->width = 4;
    o_tex->height = 4;
    o_tex->format = GL_RGB;

    glTexImage2D(GL_TEXTURE_2D, 0, o_tex->format, o_tex->width, o_tex->height, 0, o_tex->format, GL_FLOAT, pixels); FZY_CHECK_GL_ERROR;
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT); FZY_CHECK_GL_ERROR;
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT); FZY_CHECK_GL_ERROR;
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR); FZY_CHECK_GL_ERROR;
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR); FZY_CHECK_GL_ERROR;
    glGenerateMipmap(GL_TEXTURE_2D); FZY_CHECK_GL_ERROR;
    glBindTexture(GL_TEXTURE_2D, 0);
    memory_delete(o_tex, sizeof(gl_texture), MEM_TAG_TEXTURE);
    return false;
  }
  o_tex->width = img->width;
  o_tex->height = img->height;
  o_tex->format = (img->channels == 3) ? GL_RGB : GL_RGBA;

  glGenTextures(1, &o_tex->id);
  glBindTexture(GL_TEXTURE_2D, o_tex->id);
  glTexImage2D(GL_TEXTURE_2D, 0, o_tex->format, o_tex->width, o_tex->height, 0, o_tex->format, GL_UNSIGNED_BYTE, img->pixels); FZY_CHECK_GL_ERROR;
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT); FZY_CHECK_GL_ERROR;
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT); FZY_CHECK_GL_ERROR;
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR); FZY_CHECK_GL_ERROR;
  glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR); FZY_CHECK_GL_ERROR;
  glGenerateMipmap(GL_TEXTURE_2D); FZY_CHECK_GL_ERROR;

  glBindTexture(GL_TEXTURE_2D, 0);
  image_destroy(img);

  o_tex->type = ATTACHMENT_COLOR;
  texture->internal_data = o_tex;
  return true;
} // ------------------------------------------------------------------


b8 gl_texture_create_writeable( texture* texture, attachment attachment, u16 width, u16 height )
{
  gl_texture* t = memory_allocate(sizeof(gl_texture), MEM_TAG_TEXTURE);
 t->width = width;
 t->height = height;
 t->atlas_square = 1;
 t->type = attachment;

 switch (attachment)
 {
   case ATTACHMENT_POSITION:
   case ATTACHMENT_NORMAL:
     t->channels = GL_RGB;
     t->format = GL_RGB16F;
     setup_float_texture(t->format, t->channels, width, height, &t->id);
     break;

   case ATTACHMENT_COLOR:
     t->channels = GL_RGBA;
     t->format = GL_RGBA;
     setup_float_texture(t->format, t->channels, width, height, &t->id);
     break;

   case ATTACHMENT_DEPTH:
     t->channels = 0;
     t->format = 0;
     glGenRenderbuffers(1, &t->id);
     glBindRenderbuffer(GL_RENDERBUFFER, t->id);
     glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT, width, height);
     glBindRenderbuffer(GL_RENDERBUFFER, 0);
     break;

   default:
     memory_delete(t, sizeof(gl_texture), MEM_TAG_TEXTURE);
     return false;
 }

 texture->internal_data = t;
 return true;
} // ------------------------------------------------------------------

void gl_texture_destroy( texture *texture )
{
  if( texture )
  {
    gl_texture* id = (gl_texture*)texture->internal_data;

    if( id->type == ATTACHMENT_DEPTH )
    {
      if( id->id != 0 )
      {
        glDeleteRenderbuffers( 1, &id->id );
        id->id = 0;
      }
    }
    else
    {
      if( id->id != 0 )
      {
        glDeleteTextures( GL_TEXTURE_2D, &id->id );
        id->id = 0;
      }
    }
    memory_delete( id, sizeof( struct gl_texture ), MEMORY_TAG_TEXTURE );
  }
} // ------------------------------------------------------------------

void gl_texture_bind( texture *texture, u32 active_texture )
{
  if (!texture) {
    #ifdef FZY_CONFIG_DEBUG
      FZY_ERROR("gl_texture_bind :: texture is null");
    #endif
    return;
  }

  if (active_texture > 31) {
    #ifdef FZY_CONFIG_DEBUG
      FZY_ERROR("gl_texture_bind :: active_texture > 31 not supported");
    #endif
    return;
  }

  gl_texture* id = (gl_texture*)texture->internal_data;
  glActiveTexture(GL_TEXTURE0 + active_texture); FZY_CHECK_GL_ERROR;
  glBindTexture(GL_TEXTURE_2D, id->id); FZY_CHECK_GL_ERROR;

} // ------------------------------------------------------------------

void gl_texture_unbind( void )
{
  glBindTexture( GL_TEXTURE_2D, 0 ); FZY_CHECK_GL_ERROR;
} // ------------------------------------------------------------------

#endif
