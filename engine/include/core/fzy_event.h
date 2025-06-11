#ifndef FZY_EVENT_H
#define FZY_EVENT_H

#include "defines.h"

/**
  @brief Represents event contextual data to be sent along with an event code
    when an event is fired. This is a union that is 128 bits in size, meaning data
    can be mixed and matched as required by the user.
*/
typedef struct event_context
{
  // 128 bytes
    union {
        /** @brief An array of 2 64-bit signed integers. */
        i64 i64[2];
        /** @brief An array of 2 64-bit unsigned integers. */
        u64 u64[2];

        /** @brief An array of 2 64-bit floating-point numbers. */
        f64 f64[2];

        /** @brief An array of 4 32-bit signed integers. */
        i32 i32[4];
        /** @brief An array of 4 32-bit unsigned integers. */
        u32 u32[4];
        /** @brief An array of 4 32-bit floating-point numbers. */
        f32 f32[4];

        /** @brief An array of 8 16-bit signed integers. */
        i16 i16[8];

        /** @brief An array of 8 16-bit unsigned integers. */
        u16 u16[8];

        /** @brief An array of 16 8-bit signed integers. */
        i8 i8[16];
        /** @brief An array of 16 8-bit unsigned integers. */
        u8 u8[16];

        /** @brief An array of 16 characters. */
        char c[16];
    } data;
} event_context;

/** @brief System internal event codes. Application should use codes beyond 255. */
typedef enum system_event_code
{
    /** @brief Shuts the application down on the next frame. */
    FZY_EVENT_CODE_APPLICATION_QUIT = 1,

    /** @brief Keyboard key pressed.
     * Context usage:
     * u16 key_code = data.data.u16[0];
     */
    FZY_EVENT_CODE_KEY_PRESSED,

    /** @brief Keyboard key released.
     * Context usage:
     * u16 key_code = data.data.u16[0];
     */
    FZY_EVENT_CODE_KEY_RELEASED,

    /** @brief Mouse button pressed.
     * Context usage:
     * u16 button = data.data.u16[0];
     */
    FZY_EVENT_CODE_BUTTON_PRESSED,

    /** @brief Mouse button released.
     * Context usage:
     * u16 button = data.data.u16[0];
     */
    FZY_EVENT_CODE_BUTTON_RELEASED,

    /** @brief Mouse moved.
     * Context usage:
     * u16 x = data.data.u16[0];
     * u16 y = data.data.u16[1];
     */
    FZY_EVENT_CODE_MOUSE_MOVED,

    /** @brief Mouse moved.
     * Context usage:
     * ui z_delta = data.data.i8[0];
     */
    FZY_EVENT_CODE_MOUSE_WHEEL,

    /** @brief Resized/resolution changed from the OS.
     * Context usage:
     * u16 width = data.data.u16[0];
     * u16 height = data.data.u16[1];
     */
    FZY_EVENT_CODE_RESIZED,

    // Change the render mode for debugging purposes.
    /* Context usage:
     * i32 mode = context.data.i32[0];
     */
    FZY_EVENT_CODE_SET_RENDER_MODE,

    /** @brief Special-purpose debugging event. Context will vary over time. */
    FZY_EVENT_CODE_DEBUG0,
    /** @brief Special-purpose debugging event. Context will vary over time. */
    FZY_EVENT_CODE_DEBUG1,
    /** @brief Special-purpose debugging event. Context will vary over time. */
    FZY_EVENT_CODE_DEBUG2,
    /** @brief Special-purpose debugging event. Context will vary over time. */
    FZY_EVENT_CODE_DEBUG3,
    /** @brief Special-purpose debugging event. Context will vary over time. */
    FZY_EVENT_CODE_DEBUG4,

    /** @brief The maximum event code that can be used internally. */
    FZY_MAX_EVENT_CODE
} system_event_code;

/**
  @brief A function pointer typedef which is used for event subscriptions by the subscriber.
  @param code - The event code to be sent
  @param sender - A pointer to the sender of the event, can be 0
  @param listener_inst - A pointer to the listener of the event, can be 0
  @param context - The event context to be passed with the fired event
  @returns b8 - True if the message should be considered handled, which means that it will
    not be sent to any other consumers, otherwise false
*/
typedef b8 (*on_event)(u16 code, void* sender, void* listener_inst, event_context context );

/**
  @brief Initializes the event system
  @returns b8 - true if successful
*/
b8 fzy_event_system_initialize( void );

/**
  @brief Shutdown the event system, frees memory held by the system
  @returns b8 - true if successful
*/
b8 fzy_event_system_shutdown( void );

/**
  @brief Register to listen for when events are sent with the provided code. Events with duplicate
    listener/callback combos will not be registered again and will cause this to return false.

  @param code The event code to listen for.
  @param listener A pointer to a listener instance. Can be 0/NULL.
  @param on_event The callback function pointer to be invoked when the event code is fired.
  @returns True if the event is successfully registered; otherwise false.
*/
FZY_API b8 fzy_event_add_listener( u16 code, void *listener, on_event on_event );

/**
  @brief Unregister from listening when events are sent with the provided code.  If no matching
    registeration is found this will return false

  @param code The event code to listen for.
  @param listener A pointer to a listener instance. Can be 0/NULL.
  @param on_event The callback function pointer to be invoked when the event code is fired.
  @return b8 - true if successful
*/
FZY_API b8 fzy_event_remove_listener( u16 code, void* listener, on_event on_event );

/**
  @brief Fires an event to listeners of the given code. If an event handler returns
  true, the event is considered handled and is not passed on to any more listeners.
  @param code The event code to fire.
  @param sender A pointer to the sender. Can be 0/NULL.
  @param context The event data.
  @returns True if handled, otherwise false.
*/
 FZY_API b8 fzy_event_fire( u16 code, void *sender, event_context context );


#endif // FZY_EVENT_H
