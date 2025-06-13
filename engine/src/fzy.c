#include "fzy.h"
#include "renderer/fzy_window.h"

#include <SDL3/SDL.h>
#include <glad/glad.h>// remove

// Defines a structure to hold the state of the application
typedef struct app_state
{
  b8 is_running; // indicates if the app is running or not
  b8 is_suspended; // indicates if the app is suspended (paused)

} app_state;

static b8 initialized = false;
static app_state state;
// ----------------------------------------------------------------------------

// helper function to process events
static void process_events( void )
{
  SDL_Event event;

  while( SDL_PollEvent(&event) )
  {
    switch( event.type )
    {
      case SDL_EVENT_QUIT:
        state.is_running = false;
        break;
    }
  }
} // --------------------------------------------------------------------------

b8 fzy_initialize( void )
{
  if( initialized ) FZY_ERROR( "fzy_initialize :: initialized called more than once" );

  if( !fzy_logger_initialize( ) )
  {
    FZY_ERROR( "Failed to initialize the logger" );
    return false;
  }

  if( !fzy_memory_initialize() )
  {
    FZY_ERROR( "Failed to initialize the memory manager" );
    return false;
  }

  // after all subsystems
  if( (SDL_Init( SDL_INIT_VIDEO|SDL_INIT_AUDIO|SDL_INIT_JOYSTICK) == -1 ) )
  {
    FZY_ERROR( "Could not initialize SDL: %s.\n", SDL_GetError() );
    return false;
  }

  if( !fzy_event_system_initialize( ) )
  {
    FZY_ERROR( "fzy_initialize :: Failed to initialize the event system." );
    return false;
  }

  if( !fzy_input_system_initialize() )
  {
    FZY_ERROR( "fzy_initialize :: Failed to initialize the input system." );
    return false;
  }

  // this opens a window, can be moved to renderer if possible
  if( !fzy_window_initialize( "FZY Editor", 800, 600 ) )
  {
     FZY_ERROR( "application_initialize :: Failed to initialize the SDL window" );
     return false;
  }
  fzy_window_set_fullscreen( true );

  initialized = true;
  state.is_running = true;
  state.is_suspended = false;
  return true;
} // --------------------------------------------------------------------------

FZY_API b8 fzy_update( f32 deltaTime )
{
  while( state.is_running )
  {
    process_events( );

    // for testing
    glClearColor(0.1f, 0.1f, 0.2f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);
    fzy_window_swap_buffers();
  }

  return true;
} // --------------------------------------------------------------------------

FZY_API void fzy_shutdown( void )
{
  // shutdown the window
  fzy_window_shutdown();

  if( !fzy_input_system_shutdown() ) FZY_ERROR( "fzy_shutdown :: failed to shutdown the input system." );

  if( !fzy_event_system_shutdown() ) FZY_ERROR( "fzy_shutdown :: failed to shutdown the event system." );

  if( !fzy_memory_shutdown() ) FZY_ERROR( "Failed to shutdown the memory manager" );

  SDL_Quit();
  fzy_logger_shutdown();
} // --------------------------------------------------------------------------
