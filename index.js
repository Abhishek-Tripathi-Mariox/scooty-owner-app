import React from 'react';
import { AppRegistry, Text, TextInput } from 'react-native';
import App from './App';

// Keep the UI pixel-consistent on every phone regardless of the device's
// system "Font size" (accessibility) setting. Without this, a large system
// font enlarges every label, overflows fixed-height rows/buttons (letters get
// clipped and appear to vanish) and pushes screens like Login out of place.
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
Text.defaultProps.maxFontSizeMultiplier = 1;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
TextInput.defaultProps.maxFontSizeMultiplier = 1;

// Force the bundled Poppins family as the base font for every Text/TextInput.
// Phones with a custom system font (common on Unisoc/Tecno/Itel devices and
// OEM theme stores) draw glyphs wider than React Native measured them, which
// clips labels mid-word and shifts layouts vertically. A bundled font keeps
// measure and draw identical on every device. Styles that declare their own
// fontFamily still win because the default is prepended before the element's
// own style. The merge must happen BEFORE the component renders: Text wraps
// its output in a TextAncestor.Provider, so cloning the returned element
// cannot reach the native text node.
const DEFAULT_FONT = { fontFamily: 'Poppins' };
const patchRender = (Component) => {
  const originalRender = Component.render;
  if (typeof originalRender !== 'function') return;
  Component.render = function (props, ref) {
    return originalRender.call(
      this,
      { ...props, style: [DEFAULT_FONT, props.style] },
      ref,
    );
  };
};
patchRender(Text);
patchRender(TextInput);

AppRegistry.registerComponent('App', () => App);
