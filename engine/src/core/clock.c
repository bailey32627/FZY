#include "core/clock.h"
#include <SDL3/SDL_timer.h>

void clock_update( clock *clock )
{
  if( clock->start_time != 0 )
  {
    clock->elasped = SDL_GetTicks() - clock->start_time;
  }
} // ---------------------------------------------------

void clock_start( clock *clock )
{
  clock->start_time = SDL_GetTicks();
  clock->elasped = 0;
} // ---------------------------------------------------

void clock_stop( clock *clock )
{
  clock->start_time = 0;
} // ---------------------------------------------------
