import React from 'react';
import { DoubleSide } from 'three';
import { ThermalMaterial } from './utils';

const SoupBowl = ({ currentTemp, viewMode }: any) => {
  return (
    <group position={[0, 0.4, 0]}>
      {/* Bowl Body */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        {viewMode === 'Thermal' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.1} side={DoubleSide} />
        )}
      </mesh>
      
      {/* Soup Liquid */}
      <mesh position={[0, 0.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.95, 32]} />
        {viewMode === 'Thermal' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshStandardMaterial color="#d97706" roughness={0.2} metalness={0.1} />
        )}
      </mesh>
    </group>
  );
};

export default SoupBowl;
