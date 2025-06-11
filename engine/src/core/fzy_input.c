#include "core/fzy_input.h"
#include "core/fzy_logger.h"
#include "core/fzy_memory.h"
#include "core/fzy_event.h"
#include <SDL3/SDL.h>

#define KEY_COUNT 287 // SDL supports up to 286 index - see SDL_NUM_SCANCODES
#define MAX_BUTTONS 5

typedef struct keyboard_state
{
  b8 keys[ KEY_COUNT ];

} keyboard_state;
// -----------------------------------------------------------------------------

typedef struct mouse_state
{
  i16 x;
  i16 y;
  b8 buttons[ MAX_BUTTONS ];

} mouse_state;
// -----------------------------------------------------------------------------

typedef struct input_state
{
  keyboard_state keyboard_current;
  keyboard_state keyboard_previous;
  mouse_state mouse_current;
  mouse_state mouse_previous;

} input_state;
// ----------------------------------------------------------------------------

static input_state* state_ptr = 0;
// ----------------------------------------------------------------------------


b8 fzy_input_system_initialize( void )
{
  if( state_ptr )
    return false;

  state_ptr = fzy_memory_allocate( sizeof( input_state ), MEM_TAG_INPUTS );

  fzy_memory_zero( state_ptr->keyboard_current.keys, sizeof( state_ptr->keyboard_current.keys ) );
  fzy_memory_zero( state_ptr->keyboard_previous.keys, sizeof( state_ptr->keyboard_previous.keys ) );
  fzy_memory_zero( state_ptr->mouse_current.buttons, sizeof( state_ptr->mouse_current.buttons ) );
  fzy_memory_zero( state_ptr->mouse_previous.buttons, sizeof( state_ptr->mouse_previous.buttons ) );

  FZY_INFO( "Input system initialized." );
  return true;
} // ----------------------------------------------------------------------------

b8 fzy_input_system_shutdown( void )
{
  if( !state_ptr )
    return false;

  fzy_memory_delete( state_ptr, sizeof( input_state ), MEM_TAG_INPUTS );
  FZY_INFO( "Input system shutdown." );
  return true;
} // ----------------------------------------------------------------------------

void fzy_input_system_update( void )
{
  fzy_memory_copy( &state_ptr->keyboard_previous, &state_ptr->keyboard_current, sizeof( keyboard_state ) );
  fzy_memory_copy( &state_ptr->mouse_previous, &state_ptr->mouse_current, sizeof( mouse_state ) );

  f32 x,y;
  u32 buttons = SDL_GetMouseState( &x, &y );
  fzy_input_mouse_move( (i16)x, (i16)y );
  for( i32 i = 0; i < MAX_BUTTONS; i++ )
  {
    fzy_input_process_button( i+1, buttons & SDL_BUTTON_MASK( i + 1 ) );
  }

  const Uint8* keys_state = SDL_GetKeyboardState( NULL );
  for( i32 i = FZY_KEY_FIRST; i < KEY_COUNT; i++ )
    fzy_input_process_key( i, keys_state[ i ] );
} // ----------------------------------------------------------------------------

void fzy_input_process_key( keys key, b8 pressed )
{
  // only handle this if the state actually changed
  if( state_ptr->keyboard_current.keys[ key ] != pressed )
  {
    // update the internal state
    state_ptr->keyboard_current.keys[ key ] = pressed;

    // fire event
    event_context context;
    context.data.u16[0] = key;
    fzy_event_fire( pressed ? FZY_EVENT_CODE_KEY_PRESSED : FZY_EVENT_CODE_KEY_RELEASED, 0, context );
  }
} // ----------------------------------------------------------------------------

b8 fzy_input_is_key_down( keys key )
{
  return state_ptr->keyboard_current.keys[ key ] == true;
} // ----------------------------------------------------------------------------

b8 fzy_input_is_key_up( keys key )
{
  return state_ptr->keyboard_current.keys[ key ] == false;
} // ----------------------------------------------------------------------------

void fzy_input_mouse_move( i16 x, i16 y )
{
  // only process if actually different
  if( state_ptr->mouse_current.x != x || state_ptr->mouse_current.y != y )
  {
    // update internal state
    state_ptr->mouse_current.x = x;
    state_ptr->mouse_current.y = y;

    // fire the event
    event_context context;
    context.data.u16[0] = x;
    context.data.u16[1] = y;
    fzy_event_fire( FZY_EVENT_CODE_MOUSE_MOVED, 0, context );
  }
} // ----------------------------------------------------------------------------

void fzy_input_process_button( buttons button, b8 pressed )
{
  // if the state changed, fire an event
  if( state_ptr->mouse_current.buttons[ button] != pressed )
  {
    state_ptr->mouse_current.buttons[ button ] = pressed;

    // fire the event
    event_context context;
    context.data.u16[ 0 ] = button;
    fzy_event_fire( pressed ? FZY_EVENT_CODE_BUTTON_PRESSED : FZY_EVENT_CODE_BUTTON_RELEASED, 0, context );
  }
} // ----------------------------------------------------------------------------

b8 fzy_input_is_button_down( buttons button )
{
  return state_ptr->mouse_current.buttons[ button ] == true;
} // ----------------------------------------------------------------------------

b8 fzy_input_is_button_up( buttons button )
{
  return state_ptr->mouse_current.buttons[ button ] == false;
} // ----------------------------------------------------------------------------

void fzy_input_get_mouse_position( i32 *x, i32 *y )
{
  *x = state_ptr->mouse_current.x;
  *y = state_ptr->mouse_current.y;
} // ----------------------------------------------------------------------------

void fzy_input_get_mouse_delta( i32 *x, i32 *y )
{
  *x = state_ptr->mouse_previous.x - state_ptr->mouse_current.x;
  *y = state_ptr->mouse_previous.y - state_ptr->mouse_current.y;
} // ----------------------------------------------------------------------------

void fzy_input_process_mouse_wheel( i8 z_delta )
{
  event_context context;
  context.data.i8[0] = z_delta;
  fzy_event_fire( FZY_EVENT_CODE_MOUSE_WHEEL, 0, context );
} // ----------------------------------------------------------------------------

b8 fzy_input_is_mouse_in_rectangle( u16 x, u16 y, u16 width, u16 height )
{
  i16 minx = x;
  i16 miny = y;
  i16 maxx = x + width;
  i16 maxy = y + height;

  if( state_ptr->mouse_current.x < minx || state_ptr->mouse_current.y < miny ||
      state_ptr->mouse_current.x > maxx || state_ptr->mouse_current.y > maxy )
  {
    return false;
  }
  return true;
} // ----------------------------------------------------------------------------
