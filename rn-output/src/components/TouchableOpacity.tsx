import React, { useState } from 'react'
import { TouchableOpacity as RNTouchableOpacity, TouchableOpacityProps } from 'react-native'

export function TouchableOpacity({ style, onPressIn, onPressOut, children, ...props }: TouchableOpacityProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handlePressIn = (e: any) => {
    setIsPressed(true)
    onPressIn?.(e)
  }

  const handlePressOut = (e: any) => {
    setIsPressed(false)
    onPressOut?.(e)
  }

  // Dark 3D bottom-right border & solid shadow on press
  const pressedStyle = isPressed
    ? {
        borderBottomWidth: 3,
        borderRightWidth: 3,
        borderBottomColor: '#000000',
        borderRightColor: '#000000',
        shadowColor: '#000000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 5,
      }
    : null

  return (
    <RNTouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, pressedStyle]}
      {...props}
    >
      {children}
    </RNTouchableOpacity>
  )
}

export default TouchableOpacity
