import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import type { IconProps } from './types';

function base({ size = 22, color = '#f0f4e8', strokeWidth = 2.75 }: IconProps) {
  return { size, color, strokeWidth };
}

export function HomeIcon(props: IconProps) {
  const { size, color, strokeWidth } = base(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function AreasIcon(props: IconProps) {
  const { size, color, strokeWidth } = base(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={3} width={7} height={7} rx={2} stroke={color} strokeWidth={strokeWidth} />
      <Rect x={14} y={3} width={7} height={7} rx={2} stroke={color} strokeWidth={strokeWidth} />
      <Rect x={3} y={14} width={7} height={7} rx={2} stroke={color} strokeWidth={strokeWidth} />
      <Rect x={14} y={14} width={7} height={7} rx={2} stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

export function HistoryIcon(props: IconProps) {
  const { size, color, strokeWidth } = base(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={5} width={18} height={16} rx={3} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M8 3v4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M16 3v4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M3 11h18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function ReportsIcon(props: IconProps) {
  const { size, color, strokeWidth } = base(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 20V10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M12 20V4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M19 20v-6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function PlusIcon(props: IconProps) {
  const { size, color, strokeWidth } = base(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M5 12h14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function ClockIcon(props: IconProps) {
  const { size, color, strokeWidth } = base(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={strokeWidth} />
      <Path d="M12 7v5l3 2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function DueTodayIcon(props: IconProps) {
  const { size, color, strokeWidth } = base(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 18V7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M10 18V4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M16 18v-9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M22 18H2" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function BackIcon(props: IconProps) {
  const { size, color, strokeWidth } = base(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="m14 6-6 6 6 6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SearchIcon(props: IconProps) {
  const { size, color, strokeWidth } = base(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={11} cy={11} r={7} stroke={color} strokeWidth={strokeWidth} />
      <Path d="m20 20-3.5-3.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  const { size, color, strokeWidth } = base(props);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="m10 6 6 6-6 6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
