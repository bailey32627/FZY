#include "core/fzy_timer.h"


void fzy_timer_start( timer *t, f32 duration, b8 repeating )
{
  t->duration = duration;
  t->elasped = 0.0f;
  t->repeating = repeating;
  t->active = true;
} // -------------------------------------------------------------------------

b8 fzy_timer_update( timer *t, f32 delta_time )
{
  if( !t->active ) return false;

  t->elasped += delta_time;
  if( t->elasped >= t->duration )
  {
    if( t->repeating )
    {
      t->elasped -= t->duration;
    }
    else
    {
      t->active = false;
    }
    return true;
  }
  return false;
} // -------------------------------------------------------------------------

void fzy_timer_stop( timer *t )
{
  t->active = false;
} // -------------------------------------------------------------------------

void fzy_timer_reset( timer *t )
{
  t->elasped = 0.0f;
} // -------------------------------------------------------------------------
