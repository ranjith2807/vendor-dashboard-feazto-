import React from 'react'
import { TouchableOpacity as RNTouchableOpacity, TouchableOpacityProps } from 'react-native'

export default function TouchableOpacity(props: TouchableOpacityProps) {
  return <RNTouchableOpacity activeOpacity={0.8} {...props} />
}
