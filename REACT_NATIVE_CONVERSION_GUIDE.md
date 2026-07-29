# React Native Conversion Guide

This document explains how to convert the FEAZTO Vendor web app to React Native while preserving the exact visual design.

## Project Overview

- **Original**: React + Vite + Tailwind CSS web app running in Figma Make
- **Target**: React Native app for Expo Go
- **Design System**: "Minimal Comic UI" with:
  - Yellow (#FFC50A), Cream (#FFF8E7), Black (#000)
  - Barlow Condensed Bold + Inter fonts
  - Hard offset shadows, comic-style borders
  - 375×812 mobile viewport

## Key Conversion Principles

### 1. Component Mapping

```
div → View
span/text → Text  
button → TouchableOpacity / Pressable
input → TextInput
img → Image
```

### 2. Styling Approach

- Convert inline `style` objects to StyleSheet.create()
- Replace CSS properties with React Native equivalents
- Preserve exact colors, spacing, borders, shadows

### 3. CSS → React Native Style Mappings

| CSS Property | React Native Equivalent |
|--------------|------------------------|
| `display: flex` | Default (all Views are flexbox) |
| `box-shadow` | `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius` (iOS) + `elevation` (Android) |
| `border-radius` | `borderRadius` |
| `font-family` | Custom fonts loaded via expo-font |
| `gap` | Use `margin` on children or `rowGap`/`columnGap` (RN 0.71+) |
| `cursor: pointer` | Not needed (TouchableOpacity handles this) |
| `overflow: hidden` | `overflow: 'hidden'` |
| `text-align` | `textAlign` |

### 4. Font Setup

Install custom fonts:
```bash
npx expo install expo-font @expo-google-fonts/inter @expo-google-fonts/barlow-condensed
```

### 5. Navigation

Replace screen state management with React Navigation:
```bash
npx expo install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
```

### 6. Hard Shadow Implementation

React Native doesn't support offset shadows natively. Create a shadow component:

```typescript
// ShadowBox.tsx
const ShadowBox = ({ children, shadowColor = '#000', offsetX = 4, offsetY = 4 }) => (
  <View style={{ position: 'relative' }}>
    <View style={{
      position: 'absolute',
      top: offsetY,
      left: offsetX,
      width: '100%',
      height: '100%',
      backgroundColor: shadowColor,
      borderRadius: 12
    }} />
    <View style={{ position: 'relative', zIndex: 1 }}>
      {children}
    </View>
  </View>
);
```

## Conversion Checklist by Screen

### Core Files
- [x] App.tsx - Main navigation
- [x] AppShell.tsx - Phone frame + bottom nav
- [ ] All 40+ screen files

### Authentication Flow
- [ ] SplashScreen.tsx
- [ ] OnboardingScreen.tsx  
- [ ] AuthScreen.tsx
- [ ] ForgotPasswordScreen.tsx
- [ ] Register screens (1-4)

### Main App Screens
- [ ] DashboardScreen.tsx
- [ ] OrdersScreen.tsx
- [ ] OrderDetailScreen.tsx
- [ ] MenuScreen.tsx
- [ ] CommunityScreen.tsx
- [ ] FezuScreen.tsx
- [ ] WalletScreen.tsx
- [ ] AnalyticsScreen.tsx
- [ ] SettingsScreen.tsx

## Common Gotchas

1. **No CSS Grid**: Use `flexWrap` + `width: '50%'` for 2-column grids
2. **ScrollView Required**: Replace `overflow-y: auto` with `<ScrollView>`
3. **Text Must Be in <Text>**: All strings must be wrapped in `<Text>` components
4. **Absolute Positioning**: Works the same but requires explicit `position: 'absolute'`
5. **Border Styles**: Use separate `borderWidth`, `borderColor`, `borderRadius`
6. **Images**: Use `<Image source={require('./path')}` or `{uri: 'url'}`
7. **Buttons**: Use `<TouchableOpacity>` or `<Pressable>` with visual feedback

## Next Steps

1. Set up new Expo project: `npx create-expo-app feazto-vendor-mobile`
2. Install dependencies (fonts, navigation, etc.)
3. Create shared StyleSheet with design tokens
4. Convert AppShell first (navigation + status bar)
5. Convert screens one-by-one, testing in Expo Go
6. Add platform-specific tweaks (iOS safe areas, Android shadows)
