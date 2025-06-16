#ifndef FZY_QUEUE_H
#define FZY_QUEUE_H

#include "defines.h"

typedef struct queue
{
  u8 *data;
  u32 front;
  u32 rear;
  u32 count;
  u32 capacity;
  u32 type_size;
  u8 tag;

} queue;

/**
  @brief Creates a new queue and returns a pointer to it, should only be used
    internally, Use queue_create instead

  @param type_size - the size fo the data stored in the data array
  @param capacity - the max number of item stored in the data array
  @param tag - the memory tag to be used for this allocation
  @return Ptr - pointer to the new que or 0 if unsuccessful
*/
queue* _queue_create( u32 type_size, u32 capacity, u8 memory_tag );

/**
  @brief Frees the memory associated with the queue

  @param queue - the queue to destroy
*/
void queue_destroy( queue *queue );

/**
  @brief Check if the queue is empty or not

  @param queue - the queue to Check
  @return b8 - true if empty
*/
b8 queue_is_empty( queue* queue );

/**
  @brief Returns a pointer to the front of the queue

  @param quque - The queue to access
  @return ptr - Pointer to the emement at the front of the queue
*/
void* queue_get_front( queue *queue );

/**
  @brief Method to push the given data onto the array in the queue

  @param queue - the queue to access
  @param data - the data to add to the queue
*/
void queue_push( queue *queue, const void* data );

/**
  @brief Pops the front fo the array

  @param queue - the queue to access
*/
void queue_pop( queue* queue );

// Macros -----------------
#define queue_create( type, capacity, tag ) _queue_create( sizeof( type ), capacity, tag )
#endif // FZY_QUEUE_H
