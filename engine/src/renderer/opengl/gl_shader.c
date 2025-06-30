#include "renderer/opengl/gl_shader.h"

#include "core/fzy_string.h"
#include "core/fzy_memory.h"
#include "core/fzy_logger.h"

#ifdef USING_OPENGL

#include <glad/glad.h>


static void release_uniform( void* uniform )
{
  if( uniform )
  {
    memory_delete( uniform, sizeof( gl_uniform ), MEM_TAG_SHADER );
  }
} // -------------------------------------------------------------------------


u32 gl_compile_shader( const char *code, u32 type )
{
  u32 id = glCreateShader( type );
  glShaderSource( id, 1, &code, 0 ); FZY_CHECK_GL_ERROR;
  glCompileShader( id ); FZY_CHECK_GL_ERROR;

  #ifdef FZY_CONFIG_DEBUG
  char t[ 128 ] = {""};

  int loglen;

  if( type == GL_VERTEX_SHADER )
  {
    string_copy( t, "GL_VERTEX_SHADER" );
  }
  else if( type == GL_FRAGMENT_SHADER )
  {
    string_copy( t, "GL_FRAGMENT_SHADER" );
  }

  glGetShaderiv( id, GL_INFO_LOG_LENGTH,  &loglen ); FZY_CHECK_GL_ERROR;
  if (loglen > 0 && loglen < 16384)
  {
    char* log = memory_allocate(loglen, MEM_TAG_SHADER);
    glGetShaderInfoLog(id, loglen, &loglen, log);
    FZY_ERROR("[%s] %s\n", t, log);
    memory_delete(log, loglen, MEM_TAG_SHADER);
  }
  #endif  // DEBUGGING

  int status;
  glGetShaderiv( id, GL_COMPILE_STATUS, &status ); FZY_CHECK_GL_ERROR;

  if( !status )
  {
    glDeleteShader( id ); FZY_CHECK_GL_ERROR;
    return 0;
  }

  return id;
} // --------------------------------------------------------------------------

u32 gl_link_shader( u32 vertex_shader, u32 fragment_shader )
{
  u32 program = glCreateProgram(); FZY_CHECK_GL_ERROR;

  glAttachShader( program, vertex_shader ); FZY_CHECK_GL_ERROR;
  glAttachShader( program, fragment_shader ); FZY_CHECK_GL_ERROR;

  glLinkProgram( program ); FZY_CHECK_GL_ERROR;

  #ifdef FZY_CONFIG_DEBUG
  int len;
  glGetProgramiv( program, GL_INFO_LOG_LENGTH, &len );
  if( len )
  {
    char l[ len ];
    glGetProgramInfoLog( program, len, &len, l ); FZY_CHECK_GL_ERROR;
    FZY_ERROR( "%s", l );
  }

  #endif /* DEBUGGING */
  int status;

  glGetProgramiv( program, GL_LINK_STATUS, &status ); FZY_CHECK_GL_ERROR;

  if( !status )
  {
    glDeleteProgram( program ); FZY_CHECK_GL_ERROR;
    glDeleteShader( vertex_shader ); FZY_CHECK_GL_ERROR;
    glDeleteShader( fragment_shader ); FZY_CHECK_GL_ERROR;

    program = 0;
  }

  return program;
} // --------------------------------------------------------------------------

b8 gl_shader_create( shader* sdr, const char* vertex, const char* fragment )
{
  if( sdr->internal_data )
    return false;

  gl_shader* id = memory_allocate( sizeof( gl_shader ), MEM_TAG_SHADER );
  id->uniforms = hashtable_create( 27, release_uniform );

  u32 vertex_shader = gl_compile_shader( vertex, GL_VERTEX_SHADER );
  u32 fragment_shader = gl_compile_shader( fragment, GL_FRAGMENT_SHADER );

  if (vertex_shader == 0 || fragment_shader == 0)
  {
    FZY_ERROR("gl_shader_create :: shader compilation failed.");
    if (vertex_shader) glDeleteShader(vertex_shader);
    if (fragment_shader) glDeleteShader(fragment_shader);
    hashtable_destroy(id->uniforms);
    memory_delete(id, sizeof(gl_shader), MEM_TAG_SHADER);
    return false;
  }

  id->program = gl_link_shader( vertex_shader, fragment_shader );

  if( !id->program )
  {
    FZY_ERROR( "gl_shader_create :: failed to create shader program" );
    return false;
  }

  glDeleteShader( vertex_shader ); FZY_CHECK_GL_ERROR;
  glDeleteShader( fragment_shader ); FZY_CHECK_GL_ERROR;

  sdr->internal_data = id;
  return true;
} // --------------------------------------------------------------------------

b8 gl_shader_destroy( shader* sdr )
{
  if( sdr )
  {
    gl_shader* osdr = (gl_shader*)sdr->internal_data;
    glDeleteProgram( osdr->program );
    hashtable_destroy( osdr->uniforms );
    memory_delete( osdr, sizeof( gl_shader ), MEM_TAG_SHADER );
    return true;
  }
  return false;
} // --------------------------------------------------------------------------

b8 gl_shader_add_uniform( shader* sdr, const char* name, u8 type )
{
  if( sdr )
  {
    gl_shader* id = (gl_shader*)sdr->internal_data;
    i32 location = glGetUniformLocation( id->program, name ); FZY_CHECK_GL_ERROR;
    if( location > -1 )
    {
      gl_uniform *u = memory_allocate( sizeof( gl_uniform ), MEM_TAG_SHADER );
      u->location = location;
      u->type = type;
      hashtable_set( id->uniforms, name, u );
      return true;
    }
  }
  return false;
} // --------------------------------------------------------------------------

void gl_shader_set_uniform( shader* sdr, const char* name, void* value )
{
  if( sdr )
  {
    gl_shader* id = (gl_shader*)sdr->internal_data;

    gl_uniform *u = (gl_uniform*)hashtable_get( id->uniforms, name );

    if( !u )
    {
      #ifdef FZY_CONFIG_DEBUG
        FZY_WARNING("Uniform '%s' not found in shader.", name);
     #endif
     return;
    }

    switch( u->type )
    {
      case UNIFORM_TYPE_INT:
      {
        glUniform1iv( u->location, 1, (i32*)value );
        return;
      }
      case UNIFORM_TYPE_FLOAT:
      {
        glUniform1fv( u->location, 1, (GLfloat*)value );
        return;
      }
      case UNIFORM_TYPE_VEC2:
      {
        glUniform2fv( u->location, 1, (GLfloat*)value );
        return;
      }
      case UNIFORM_TYPE_VEC3:
      {
        glUniform3fv( u->location, 1, (GLfloat*)value );
        return;
      }
      case UNIFORM_TYPE_VEC4:
      {
        glUniform4fv( u->location, 1, (GLfloat*)value );
        return;
      }
      case UNIFORM_TYPE_MAT3:
      {
        glUniformMatrix3fv( u->location, 1, GL_FALSE, (GLfloat*)value );
        return;
      }
      case UNIFORM_TYPE_MAT4:
      {
        glUniformMatrix4fv( u->location, 1, GL_FALSE, (GLfloat*)value );
        return;
      }
    }
  }
} // --------------------------------------------------------------------------

void gl_shader_use( shader* sdr )
{
  if( sdr )
  {
    gl_shader* id = (gl_shader*)sdr->internal_data;
    glUseProgram( id->program );
    return;
  }
  glUseProgram( 0 );
} // --------------------------------------------------------------------------

#endif
