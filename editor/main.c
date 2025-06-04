#include "core/application.h"
#include "core/logger.h"
#include "core/fzy_memory.h"

#include "math/fzy_math.h"


b8 initialize( application *app )
{
  FZY_INFO( "Editor initialized" );
  return true;
} // ------------------------------------------------------------------

b8 update( application *app, f32 delta_time )
{
  return true;
} // -------------------------------------------------------------------

b8 shutdown( application *app )
{
  FZY_INFO( "Editor shutdown" );
  return true;
} // -------------------------------------------------------------------

b8 create_application( application *instance )
{
  if( !instance ) return false;
  instance->initialize = initialize;
  instance->update = update;
  instance->shutdown = shutdown;
  return true;
} // -------------------------------------------------------------------


int main() {
  memory_initialize();
  application *app = memory_allocate( sizeof( application ), MEMORY_TAG_APPLICATION );

  if( !create_application( app ) )
  {
    FZY_FATAL( "Failed to create application." );
    return -1;
  }

  if( !application_initialize(app) )
  {
    FZY_FATAL( "Initializtion failed." );
    return -2;
  }

  application_run( app );
  application_shutdown( app );

  return 0;
}
