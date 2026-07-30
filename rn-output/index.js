import React, { useState } from 'react'
import * as ReactNative from 'react-native'
import { registerRootComponent } from 'expo'
import App from './App'

// ─── Global TouchableOpacity Custom Override ─────────────────────────────────────
const OriginalTouchableOpacity = ReactNative.TouchableOpacity

const CustomTouchableOpacity = React.forwardRef((props, ref) => {
  const [isPressed, setIsPressed] = useState(false)

  const handlePressIn = (e) => {
    setIsPressed(true)
    props.onPressIn?.(e)
  }

  const handlePressOut = (e) => {
    setIsPressed(false)
    props.onPressOut?.(e)
  }

  const { style, children, ...rest } = props

  // Thin black border and soft black shadow/elevation when pressed
  const pressedStyle = isPressed
    ? {
        borderWidth: 1.5,
        borderColor: '#000000',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 2,
      }
    : null

  return (
    <OriginalTouchableOpacity
      ref={ref}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, pressedStyle]}
      {...rest}
    >
      {children}
    </OriginalTouchableOpacity>
  )
})

CustomTouchableOpacity.displayName = 'TouchableOpacity'

// Redefine TouchableOpacity on the react-native package exports object
Object.defineProperty(ReactNative, 'TouchableOpacity', {
  get() {
    return CustomTouchableOpacity
  },
  configurable: true,
  enumerable: true,
})

registerRootComponent(App)
