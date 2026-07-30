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
