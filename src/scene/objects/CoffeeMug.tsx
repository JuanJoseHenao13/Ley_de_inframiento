import React from 'react';
import { DoubleSide } from 'three';
import { ThermalMaterial } from './utils';

const CoffeeMug = ({ currentTemp, viewMode }: any) => {
  return (
    <group position={[0, 0.6, 0]}>
      {/* Mug Body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 1.2, 32, 1, true]} />
        {viewMode === 'Thermal' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} side={DoubleSide} />
        )}
      </mesh>
      
      {/* Mug Bottom */}
      <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.1, 32]} />
        <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} fallbackColor="#f8fafc" />
      </mesh>

      {/* Mug Handle */}
      <mesh position={[0.65, 0, 0]} castShadow>
        <torusGeometry args={[0.3, 0.08, 16, 32]} />
        <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} fallbackColor="#f8fafc" />
      </mesh>

      {/* Coffee Liquid Volume */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 1.0, 32]} />
        <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} fallbackColor="#1c0f04" fallbackRoughness={0.1} fallbackMetalness={0.0} />
      </mesh>
      
      {/* Coffee Top Surface */}
      <mesh position={[0, 0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.58, 32]} />
        {viewMode === 'Thermal' ? (
           <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
           <meshPhysicalMaterial color="#2a1608" roughness={0.05} clearcoat={1} clearcoatRoughness={0.1} />
        )}
      </mesh>
    </group>
  );
};

export default CoffeeMug;
