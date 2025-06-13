#ifndef FZY_INPUT_H
#define FZY_INPUT_H

#include "defines.h"

// adapted from SDL - see SDL_BUTTON_LEFT
typedef enum buttons
{
  FZY_MOUSE_FIRST = 1,
  FZY_MOUSE_LEFT = FZY_MOUSE_FIRST,
  FZY_MOUSE_MIDDLE = 2,
  FZY_MOUSE_RIGHT = 3,
  FZY_MOUSE_X1 = 4,
  FZY_MOUSE_X2 = 5,
  FZY_MOUSE_LAST = 5
} buttons;

// addapted from SDL - see SDL_NUM_SCANCODES
typedef enum keys
{
	FZY_KEY_FIRST = 4,
	FZY_KEY_A = FZY_KEY_FIRST,
	FZY_KEY_B = 5,
	FZY_KEY_C = 6,
	FZY_KEY_D = 7,
	FZY_KEY_E = 8,
	FZY_KEY_F = 9,
	FZY_KEY_G = 10,
	FZY_KEY_H = 11,
	FZY_KEY_I = 12,
	FZY_KEY_J = 13,
	FZY_KEY_K = 14,
	FZY_KEY_L = 15,
	FZY_KEY_M = 16,
	FZY_KEY_N = 17,
	FZY_KEY_O = 18,
	FZY_KEY_P = 19,
	FZY_KEY_Q = 20,
	FZY_KEY_R = 21,
	FZY_KEY_S = 22,
	FZY_KEY_T = 23,
	FZY_KEY_U = 24,
	FZY_KEY_V = 25,
	FZY_KEY_W = 26,
	FZY_KEY_X = 27,
	FZY_KEY_Y = 28,
	FZY_KEY_Z = 29,
	FZY_KEY_1 = 30,
	FZY_KEY_2 = 31,
	FZY_KEY_3 = 32,
	FZY_KEY_4 = 33,
	FZY_KEY_5 = 34,
	FZY_KEY_6 = 35,
	FZY_KEY_7 = 36,
	FZY_KEY_8 = 37,
	FZY_KEY_9 = 38,
	FZY_KEY_0 = 39,
	FZY_KEY_RETURN = 40,
	FZY_KEY_ESCAPE = 41,
	FZY_KEY_BACKSPACE = 42,
	FZY_KEY_TAB = 43,
	FZY_KEY_SPACE = 44,
	FZY_KEY_MINUS = 45,
	FZY_KEY_EQUALS = 46,
	FZY_KEY_LEFTBRACKET = 47,
	FZY_KEY_RIGHTBRACKET = 48,
	FZY_KEY_BACKSLASH = 49,
	FZY_KEY_NONUSHASH = 50,
	FZY_KEY_SEMICOLON = 51,
	FZY_KEY_APOSTROPHE = 52,
	FZY_KEY_GRAVE = 53,
	FZY_KEY_COMMA = 54,
	FZY_KEY_PERIOD = 55,
	FZY_KEY_SLASH = 56,
	FZY_KEY_CAPSLOCK = 57,
	FZY_KEY_F1 = 58,
	FZY_KEY_F2 = 59,
	FZY_KEY_F3 = 60,
	FZY_KEY_F4 = 61,
	FZY_KEY_F5 = 62,
	FZY_KEY_F6 = 63,
	FZY_KEY_F7 = 64,
	FZY_KEY_F8 = 65,
	FZY_KEY_F9 = 66,
	FZY_KEY_F10 = 67,
	FZY_KEY_F11 = 68,
	FZY_KEY_F12 = 69,
	FZY_KEY_PRINTSCREEN = 70,
	FZY_KEY_SCROLLLOCK = 71,
	FZY_KEY_PAUSE = 72,
	FZY_KEY_INSERT = 73,
	FZY_KEY_HOME = 74,
	FZY_KEY_PAGEUP = 75,
	FZY_KEY_DELETE = 76,
	FZY_KEY_END = 77,
	FZY_KEY_PAGEDOWN = 78,
	FZY_KEY_RIGHT = 79,
	FZY_KEY_LEFT = 80,
	FZY_KEY_DOWN = 81,
	FZY_KEY_UP = 82,
	FZY_KEY_NUMLOCKCLEAR = 83,
	FZY_KEY_KP_DIVIDE = 84,
	FZY_KEY_KP_MULTIPLY = 85,
	FZY_KEY_KP_MINUS = 86,
	FZY_KEY_KP_PLUS = 87,
	FZY_KEY_KP_ENTER = 88,
	FZY_KEY_KP_1 = 89,
	FZY_KEY_KP_2 = 90,
	FZY_KEY_KP_3 = 91,
	FZY_KEY_KP_4 = 92,
	FZY_KEY_KP_5 = 93,
	FZY_KEY_KP_6 = 94,
	FZY_KEY_KP_7 = 95,
	FZY_KEY_KP_8 = 96,
	FZY_KEY_KP_9 = 97,
	FZY_KEY_KP_0 = 98,
	FZY_KEY_KP_PERIOD = 99,
	FZY_KEY_NONUSBACKSLASH = 100,
	FZY_KEY_APPLICATION = 101,
	FZY_KEY_POWER = 102,
	FZY_KEY_KP_EQUALS = 103,
	FZY_KEY_F13 = 104,
	FZY_KEY_F14 = 105,
	FZY_KEY_F15 = 106,
	FZY_KEY_F16 = 107,
	FZY_KEY_F17 = 108,
	FZY_KEY_F18 = 109,
	FZY_KEY_F19 = 110,
	FZY_KEY_F20 = 111,
	FZY_KEY_F21 = 112,
	FZY_KEY_F22 = 113,
	FZY_KEY_F23 = 114,
	FZY_KEY_F24 = 115,
	FZY_KEY_EXECUTE = 116,
	FZY_KEY_HELP = 117,
	FZY_KEY_MENU = 118,
	FZY_KEY_SELECT = 119,
	FZY_KEY_STOP = 120,
	FZY_KEY_AGAIN = 121,
	FZY_KEY_UNDO = 122,
	FZY_KEY_CUT = 123,
	FZY_KEY_COPY = 124,
	FZY_KEY_PASTE = 125,
	FZY_KEY_FIND = 126,
	FZY_KEY_MUTE = 127,
	FZY_KEY_VOLUMEUP = 128,
	FZY_KEY_VOLUMEDOWN = 129,
	FZY_KEY_KP_COMMA = 133,
	FZY_KEY_KP_EQUALSAS400 = 134,
	FZY_KEY_INTERNATIONAL1 = 135,
	FZY_KEY_INTERNATIONAL2 = 136,
	FZY_KEY_INTERNATIONAL3 = 137,
	FZY_KEY_INTERNATIONAL4 = 138,
	FZY_KEY_INTERNATIONAL5 = 139,
	FZY_KEY_INTERNATIONAL6 = 140,
	FZY_KEY_INTERNATIONAL7 = 141,
	FZY_KEY_INTERNATIONAL8 = 142,
	FZY_KEY_INTERNATIONAL9 = 143,
	FZY_KEY_LANG1 = 144,
	FZY_KEY_LANG2 = 145,
	FZY_KEY_LANG3 = 146,
	FZY_KEY_LANG4 = 147,
	FZY_KEY_LANG5 = 148,
	FZY_KEY_LANG6 = 149,
	FZY_KEY_LANG7 = 150,
	FZY_KEY_LANG8 = 151,
	FZY_KEY_LANG9 = 152,
	FZY_KEY_ALTERASE = 153,
	FZY_KEY_SYSREQ = 154,
	FZY_KEY_CANCEL = 155,
	FZY_KEY_CLEAR = 156,
	FZY_KEY_PRIOR = 157,
	FZY_KEY_RETURN2 = 158,
	FZY_KEY_SEPARATOR = 159,
	FZY_KEY_OUT = 160,
	FZY_KEY_OPER = 161,
	FZY_KEY_CLEARAGAIN = 162,
	FZY_KEY_CRSEL = 163,
	FZY_KEY_EXSEL = 164,
	FZY_KEY_KP_00 = 176,
	FZY_KEY_KP_000 = 177,
	FZY_KEY_THOUSANDSSEPARATOR = 178,
	FZY_KEY_DECIMALSEPARATOR = 179,
	FZY_KEY_CURRENCYUNIT = 180,
	FZY_KEY_CURRENCYSUBUNIT = 181,
	FZY_KEY_KP_LEFTPAREN = 182,
	FZY_KEY_KP_RIGHTPAREN = 183,
	FZY_KEY_KP_LEFTBRACE = 184,
	FZY_KEY_KP_RIGHTBRACE = 185,
	FZY_KEY_KP_TAB = 186,
	FZY_KEY_KP_BACKSPACE = 187,
	FZY_KEY_KP_A = 188,
	FZY_KEY_KP_B = 189,
	FZY_KEY_KP_C = 190,
	FZY_KEY_KP_D = 191,
	FZY_KEY_KP_E = 192,
	FZY_KEY_KP_F = 193,
	FZY_KEY_KP_XOR = 194,
	FZY_KEY_KP_POWER = 195,
	FZY_KEY_KP_PERCENT = 196,
	FZY_KEY_KP_LESS = 197,
	FZY_KEY_KP_GREATER = 198,
	FZY_KEY_KP_AMPERSAND = 199,
	FZY_KEY_KP_DBLAMPERSAND = 200,
	FZY_KEY_KP_VERTICALBAR = 201,
	FZY_KEY_KP_DBLVERTICALBAR = 202,
	FZY_KEY_KP_COLON = 203,
	FZY_KEY_KP_HASH = 204,
	FZY_KEY_KP_SPACE = 205,
	FZY_KEY_KP_AT = 206,
	FZY_KEY_KP_EXCLAM = 207,
	FZY_KEY_KP_MEMSTORE = 208,
	FZY_KEY_KP_MEMRECALL = 209,
	FZY_KEY_KP_MEMCLEAR = 210,
	FZY_KEY_KP_MEMADD = 211,
	FZY_KEY_KP_MEMSUBTRACT = 212,
	FZY_KEY_KP_MEMMULTIPLY = 213,
	FZY_KEY_KP_MEMDIVIDE = 214,
	FZY_KEY_KP_PLUSMINUS = 215,
	FZY_KEY_KP_CLEAR = 216,
	FZY_KEY_KP_CLEARENTRY = 217,
	FZY_KEY_KP_BINARY = 218,
	FZY_KEY_KP_OCTAL = 219,
	FZY_KEY_KP_DECIMAL = 220,
	FZY_KEY_KP_HEXADECIMAL = 221,
	FZY_KEY_LCTRL = 224,
	FZY_KEY_LSHIFT = 225,
	FZY_KEY_LALT = 226,
	FZY_KEY_LGUI = 227,
	FZY_KEY_RCTRL = 228,
	FZY_KEY_RSHIFT = 229,
	FZY_KEY_RALT = 230,
	FZY_KEY_RGUI = 231,
	FZY_KEY_MODE = 257,
	FZY_KEY_AUDIONEXT = 258,
	FZY_KEY_AUDIOPREV = 259,
	FZY_KEY_AUDIOSTOP = 260,
	FZY_KEY_AUDIOPLAY = 261,
	FZY_KEY_AUDIOMUTE = 262,
	FZY_KEY_MEDIASELECT = 263,
	FZY_KEY_WWW = 264,
	FZY_KEY_MAIL = 265,
	FZY_KEY_CALCULATOR = 266,
	FZY_KEY_COMPUTER = 267,
	FZY_KEY_AC_SEARCH = 268,
	FZY_KEY_AC_HOME = 269,
	FZY_KEY_AC_BACK = 270,
	FZY_KEY_AC_FORWARD = 271,
	FZY_KEY_AC_STOP = 272,
	FZY_KEY_AC_REFRESH = 273,
	FZY_KEY_AC_BOOKMARKS = 274,
	FZY_KEY_BRIGHTNESSDOWN = 275,
	FZY_KEY_BRIGHTNESSUP = 276,
	FZY_KEY_DISPLAYSWITCH = 277,
	FZY_KEY_KBDILLUMTOGGLE = 278,
	FZY_KEY_KBDILLUMDOWN = 279,
	FZY_KEY_KBDILLUMUP = 280,
	FZY_KEY_EJECT = 281,
	FZY_KEY_SLEEP = 282,
	FZY_KEY_APP1 = 283,
	FZY_KEY_APP2 = 284,
	FZY_KEY_AUDIOREWIND = 285,
	FZY_KEY_AUDIOFASTFORWARD = 286

} keys;

/*
  @brief Initializes the input system
  @return b8 - true if successful
*/
b8 input_system_initialize( void );

/*
  @brief Shuts down the input system and frees memory held by it
  @return b8 - true if successful
*/
b8 input_system_shutdown( void );

/*
  @brief Updates the input system, process keys / other inputs
*/
void input_system_update( void );

/*
  @brief Indicates the press status of the key
  @param key - the key to check the status of
  @param b8 - the pressed status to update for the key
*/
FZY_API void input_process_key( keys key, b8 pressed );

/*
  @brief Indicates the press status of the key
  @param key - the key to check the status of
  @return b8 - true if key is down
*/
FZY_API b8 input_is_key_down( keys key );

/*
  @brief Indicates if the key is down
  @param key - the key to check
  @return b8 - true if key is up
*/
FZY_API b8 input_is_key_up( keys key );

/*
  @brief Checks the status of the mouse position
  @param x - the x position of the mouse
  @param y - the y position of the mouse
*/
FZY_API void input_mouse_move( i16 x, i16 y );

/*
  @brief Sets the pressed state of the given mouse button
  @param button - the button to set the state of
  @param pressed - the pressed state of the button
*/
FZY_API void input_process_button( buttons button, b8 pressed );

/*
  @brief Checks if the mouse button is down
  @param button - the button to check
  @return b8 - true if button is down
*/
FZY_API b8 input_is_button_down( buttons button );

/*
  @brief Checks if the mouse button is up
  @param button - the button to check
  @return b8 - true if button is up
*/
FZY_API b8 input_is_button_up( buttons button );

/*
  @brief Gets the mouse position
  @param x - variable to set to the x location of the mouse
  @param y - variable to set to the y location of the mouse
*/
FZY_API void input_get_mouse_position( i32 *x, i32 *y );

/*
  @brief Gets the change of the mouse position from last frame
  @param x - variable to set the delta x of the mouse to
  @param y - variable to set the delta y of the mouse to
*/
FZY_API void input_get_mouse_delta( i32 *x, i32 *y );

/*
    TODO: implement
*/
FZY_API void input_process_mouse_wheel( i8 z_delta );

/*
  @brief Determin if the mouse in in the given rectangle area
  @param x - the x position of the rectangle
  @param y - the y position of the rectangle
  @param width - the width of the rectangle
  @param height - the height of the rectangle
  @return b8 - true if mouse is in the area
*/
FZY_API b8 input_is_mouse_in_rectangle( u16 x, u16 y, u16 width, u16 height );

#endif // FZY_INPUT_H
