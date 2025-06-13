#include "core/fzy_event.h"
#include "core/fzy_string.h"
#include "core/fzy_memory.h"
#include "core/fzy_logger.h"
#include "core/fzy_vector.h"


typedef struct registered_event
{
  void* listener;
  on_event callback;

} registered_event;
// --------------------------------------------------------------------------


typedef struct event_code_entry
{
  vector* events;

} event_code_entry;
// ---------------------------------------------------------------------------

// this should be more than enough coudes ...
#define MAX_MESSAGES_CODES 4096
//----------------------------------------------------------------------------

// state structure
typedef struct event_system_state
{
  // lookup table for event codes
  event_code_entry registered[ MAX_MESSAGES_CODES ];

} event_system_state;
// ---------------------------------------------------------------------------

// pointer to the event state
static event_system_state* state_ptr = 0;
// ---------------------------------------------------------------------------

b8 event_system_initialize( void )
{
  if( !state_ptr )
  {
    state_ptr = memory_allocate( sizeof( struct event_system_state ), MEM_TAG_EVENT );
    for( i32 i = 0; i < MAX_MESSAGES_CODES; i++ )
    {
      state_ptr->registered[ i ].events = 0;
    }
    FZY_INFO( "Event System initialized." );
    return true;
  }
  return false;
} // ---------------------------------------------------------------------------

b8 event_system_shutdown( void )
{
  if( state_ptr )
  {
    for( i32 i = 0; i < MAX_MESSAGES_CODES; i++ )
    {
      if( state_ptr->registered[ i ].events != 0 )
      {
        vector_destroy( state_ptr->registered[ i ].events );
      }
    }
    memory_delete( state_ptr, sizeof( struct event_system_state ), MEM_TAG_EVENT );
    state_ptr = 0;
    FZY_INFO( "Event system shutdown." );
    return true;
  }
  return false;
} // ---------------------------------------------------------------------------

b8 event_add_listener( u16 code, void *listener, on_event on_event )
{
  if( !state_ptr ) return false;

  if( state_ptr->registered[ code ].events == 0 )
  {
    state_ptr->registered[ code ].events = vector_create( sizeof( struct registered_event ), 1, MEM_TAG_EVENT );
  }

  u32 registered_count = vector_size( state_ptr->registered[ code ].events );
  registered_event* e = 0;
  for( u32 i = 0; i < registered_count; i++ )
  {
    e = vector_get( registered_event, state_ptr->registered[ code ].events, i );
    if( e->listener == listener && e->callback == on_event )
    {
      FZY_WARNING( "fzy_event_add_listener :: Event has already been registered with the code %hu and the call back of %p", code, on_event );
      return false;
    }
  }

  // if at this point, no duplicate was found.  Proceed with registeration.
  registered_event event;
  event.listener = listener;
  event.callback = on_event;
  vector_push( state_ptr->registered[ code ].events, &event );
  return true;
} // ---------------------------------------------------------------------------

b8 event_remove_listener( u16 code, void* listener, on_event on_event )
{
  if( !state_ptr ) return false;

  // on nothing is registered for the code, boot out
  if( state_ptr->registered[ code ].events == 0 )
  {
    FZY_WARNING( "fzy_event_remove_listener :: attempted to remove a listener from a non-registered event." );
    return false;
  }

  u32 registered_count = vector_size( state_ptr->registered[ code ].events );
  registered_event* e = 0;
  for( u32 i = 0; i < registered_count; i++ )
  {
    e = vector_get( registered_event, state_ptr->registered[ code ].events, i );
    if( e->listener == listener && e->callback == on_event )
    {
      vector_remove_index( state_ptr->registered[ code ].events, i );
      return true;
    }
  }
  return false;
} // ---------------------------------------------------------------------------

b8 event_fire( u16 code, void *sender, event_context context )
{
  if( !state_ptr ) return false;

  // if nothing i sregistered for the code, boot out
  if( state_ptr->registered[ code ].events == 0 ) return false;

  u32 registered_count = vector_size( state_ptr->registered[ code ].events );

  registered_event* e = 0;
  for( u32 i = 0; i < registered_count; i++ )
  {
    e = vector_get( registered_event, state_ptr->registered[ code ].events, i );
    if( e->callback( code, sender, e->listener, context ) )
    {
      // message has been handled, do not send to the other listeners
      return true;
    }
  }

  // not found
  return false;
} // ---------------------------------------------------------------------------
