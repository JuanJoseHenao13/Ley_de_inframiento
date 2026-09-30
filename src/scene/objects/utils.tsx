import React from 'react';
import * as THREE from 'three';

export const getThermalColor = (temp: number) => {
  const t = Math.max(0, Math.min(1, (temp + 10) / 110)); 
  const blue = new THREE.Color('#0015ff');
  const cyan = new THREE.Color('#00ffff');
  const yellow = new THREE.Color('#ffff00');
  const red = new THREE.Color('#ff0000');
  const white = new THREE.Color('#ffffff');

  if (t < 0.25) return blue.clone().lerp(cyan, t / 0.25);
  if (t < 0.5) return cyan.clone().lerp(yellow, (t - 0.25) / 0.25);
  if (t < 0.75) return yellow.clone().lerp(red, (t - 0.5) / 0.25);
  return red.clone().lerp(white, (t - 0.75) / 0.25);
};

export const ThermalMaterial = ({ currentTemp, viewMode, fallbackColor, fallbackRoughness = 0.2, fallbackMetalness = 0.1, transparent = false, opacity = 1 }: any) => {
  if (viewMode === 'Thermal') {
    return (
      <meshBasicMaterial 
        color={getThermalColor(currentTemp)} 
        transparent={transparent}
        opacity={opacity}
      />
    );
  }
  return (
    <meshStandardMaterial 
      color={fallbackColor} 
      roughness={fallbackRoughness} 
      metalness={fallbackMetalness}
      transparent={transparent}
      opacity={opacity}
    />
  );
};
