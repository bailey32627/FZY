#include "core/fzy_queue.h"
#include "core/fzy_logger.h"
#include "core/fzy_memory.h"

queue* _queue_create( u32 type_size, u32 capacity, u8 memory_tag )
{
  queue *q = memory_allocate( sizeof( struct queue ), memory_tag );
  q->data = memory_allocate( type_size * capacity, memory_tag );
  q->front = 0;
  q->rear = -1;
  q->count = 0;
  q->capacity = capacity;
  q->type_size = type_size;
  q->tag = memory_tag;
  return q;
} // ---------------------------------------------------------------------------

void queue_destroy( queue *queue )
{
  if( !queue ) return;
  if( queue->data )
  {
    memory_delete( queue->data, queue->type_size * queue->capacity, queue->tag );
    queue->data = 0;
  }
  memory_delete( queue, sizeof( struct queue ), queue->tag );
  queue = 0;
} // ---------------------------------------------------------------------------

b8 queue_is_empty( queue* queue )
{
  return !queue->count;
} // ---------------------------------------------------------------------------

void* queue_get_front( queue *queue )
{
  if( queue_is_empty( queue ) )
    FZY_ERROR( "queue_get_front :: queue is empty" );

  return &queue->data[ queue->front * queue->type_size ];
} // ---------------------------------------------------------------------------

void queue_push( queue* queue, const void* data )
{
  if( queue->count == queue->capacity )
  {
    FZY_ERROR( "queue_push :: overflow" );
    return;
  }

  queue->rear = ( queue->rear + 1 ) % queue->capacity;
  memory_copy( &queue->data[ queue->rear * queue->type_size ], data, queue->type_size );
  queue->count++;
} // ---------------------------------------------------------------------------

void queue_pop( queue* queue )
{
  if( queue_is_empty( queue ) )
  {
    FZY_ERROR( "queue_pop :: underflow, empty" );
    return;
  }

  queue->front = ( queue->front + 1 ) % queue->capacity;
  queue->count--;
} // ---------------------------------------------------------------------------
