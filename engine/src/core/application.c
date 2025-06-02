#include "core/application.h"
#include "core/logger.h"
#include "core/fzy_memory.h"

#include <SDL3/SDL.h>

#include <stdio.h> // remove

/*
  @brief Defines a structure to hold the state of the application
*/
typedef struct app_state
{
  b8 is_running;  // indicates if the application is running
  b8 is_suspended; // indicates if the application is is_suspended ( paused )

} app_state;

static b8 initialized = false;
static app_state state;


b8 application_initialize( application *instance )
{
  if( !initialized )
  {
    if( !logger_initialize() )
    {
      FZY_ERROR( "application_initialize failed to initialize logger." );
    }

    if( (SDL_Init( SDL_INIT_VIDEO|SDL_INIT_AUDIO|SDL_INIT_JOYSTICK) == -1 ) )
    {
      FZY_ERROR( "Could not initialize SDL: %s.\n", SDL_GetError() );
      return false;
    }

    // initialize other subsystems below

    // after initializing all subsytems
    instance->initialize( instance );
    state.is_running = true;
    state.is_suspended = false;
    initialized = true;
    return true;
  }
  else
  {
    FZY_ERROR( "application_initialize called more than once." );
  }
  return false;
} // ------------------------------------------------------------------------

b8 application_run( application *instance )
{
  instance->update( instance, 0.016 );
  printf("Press Enter to exit...\n");
  getchar();
  return true;
} // ------------------------------------------------------------------------

b8 application_shutdown( application *instance )
{
  if( !instance->shutdown( instance ) )
  {
    FZY_ERROR( "application_shutdown :: failed to shutdown application instance." );
    return false;
  }

  memory_delete( instance, sizeof( application), MEMORY_TAG_APPLICATION );
  FZY_INFO( memory_get_usage_str() );
  logger_shutdown();
  SDL_Quit();

  return true;
} // ------------------------------------------------------------------------
