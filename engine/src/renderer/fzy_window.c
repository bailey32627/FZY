#include "renderer/fzy_window.h"
#include "core/fzy_logger.h"
#include <SDL3/SDL.h>
#include <glad/glad.h>

static b8 initialized = false;
static SDL_Window* window = NULL;
static SDL_GLContext gl_context = NULL;
static i32 window_width = 0;
static i32 window_height = 0;

b8 fzy_window_initialize( const char *title, i32 width, i32 height )
{
  if( initialized )
  {
    FZY_ERROR( "window_initialize :: window is already initialized" );
    return false;
  }
  // Set OpenGL attributes before window creation
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 1);
  SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_CORE);
  SDL_GL_SetAttribute(SDL_GL_DOUBLEBUFFER, 1);
  SDL_GL_SetAttribute(SDL_GL_STENCIL_SIZE, 8);

  window = SDL_CreateWindow(
    title,
    width,
    height,
    SDL_WINDOW_OPENGL
   );

  if( !window )
  {
    FZY_ERROR( "window_initialize :: Failed to create SDL window: %s", SDL_GetError() );
    return false;
  }

  SDL_SetWindowMinimumSize( window, 320, 320 );
  SDL_SetWindowResizable( window, true );

  gl_context = SDL_GL_CreateContext( window );
  if( !gl_context )
  {
    FZY_ERROR( "window_initialize :: Failed to create OpenGL context: %s", SDL_GetError() );
    return false;
  }

  SDL_GL_MakeCurrent( window, gl_context );

  if( !gladLoadGLLoader( (GLADloadproc)SDL_GL_GetProcAddress ) )
  {
    FZY_ERROR( "window_initialize :: failed to initialize GLAD" );
    SDL_GL_DestroyContext( gl_context );
    SDL_DestroyWindow( window );
    window = NULL;
    gl_context = NULL;
    return false;
  }

  initialized = true;
  return true;
} // -------------------------------------------------------------------------

void fzy_window_shutdown( void )
{
  if( gl_context )
  {
    SDL_GL_DestroyContext( gl_context );
  }
  if( window )
  {
    SDL_DestroyWindow( window );
  }
} // -------------------------------------------------------------------------

void fzy_window_swap_buffers( void )
{
  SDL_GL_SwapWindow( window );
} // -------------------------------------------------------------------------

i32 fzy_window_get_width( void )
{
  return window_width;
} // -------------------------------------------------------------------------

i32 fzy_window_get_height( void )
{
  return window_height;
} // -------------------------------------------------------------------------

f32 fzy_window_get_aspect_ratio( void )
{
  return ( window_height != 0 ) ? (f32)window_width / (f32)window_height : 1.0f;
} // -------------------------------------------------------------------------

void fzy_window_set_width_height( i32 width, i32 height )
{
  window_width = width;
  window_height = height;
} // -------------------------------------------------------------------------
