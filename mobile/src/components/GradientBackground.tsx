import React from 'react';
import { Image, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, Rect, RadialGradient, Stop } from 'react-native-svg';

const GRASS_BG = require('../assets/images/grass-bg.png');

/**
 * Full-bleed grass photo with a dark vignette on top (per the design's
 * `.dv-grass` layer: photo background + radial darkening for text contrast).
 *
 * Explicit pixel width/height (not just inset:0) because Android can size an
 * absolutely-positioned <Image> to its own intrinsic aspect ratio instead of
 * stretching to fill the parent when only top/left/right/bottom are set.
 */
export function GradientBackground() {
  const { width, height } = useWindowDimensions();
  return (
    <>
      <Image
        source={GRASS_BG}
        style={[StyleSheet.absoluteFill, { width, height }]}
        resizeMode="cover"
      />
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id="top" cx="50%" cy="0%" r="85%">
            <Stop offset="0%" stopColor="#000000" stopOpacity={0.62} />
            <Stop offset="100%" stopColor="#000000" stopOpacity={0.2} />
          </RadialGradient>
          <RadialGradient id="bottom" cx="50%" cy="100%" r="80%">
            <Stop offset="0%" stopColor="#000000" stopOpacity={0.68} />
            <Stop offset="100%" stopColor="#000000" stopOpacity={0.2} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#top)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#bottom)" />
      </Svg>
    </>
  );
}
