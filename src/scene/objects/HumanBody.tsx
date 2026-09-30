import React from 'react';
import { ThermalMaterial } from './utils';

const HumanBody = ({ currentTemp, viewMode }: any) => {
  return (
    <group position={[0, 0.1, 0]}>
      {/* Laying down body simulating a deceased person on the table */}
      
      {/* Head */}
      <mesh castShadow receiveShadow position={[1.2, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        {viewMode === 'Thermal' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshStandardMaterial color="#fcd34d" roughness={0.6} metalness={0.1} />
        )}
      </mesh>

      {/* Torso */}
      <mesh castShadow receiveShadow position={[0.2, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[1.2, 0.6, 0.4]} />
        {viewMode === 'Thermal' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshStandardMaterial color="#3b82f6" roughness={0.8} metalness={0.1} />
        )}
      </mesh>

      {/* Arms */}
      <mesh castShadow receiveShadow position={[0.3, 0.15, 0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 1.0, 16]} />
        {viewMode === 'Thermal' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshStandardMaterial color="#fcd34d" roughness={0.6} metalness={0.1} />
        )}
      </mesh>
      <mesh castShadow receiveShadow position={[0.3, 0.15, -0.35]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 1.0, 16]} />
        {viewMode === 'Thermal' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshStandardMaterial color="#fcd34d" roughness={0.6} metalness={0.1} />
        )}
      </mesh>

      {/* Legs */}
      <mesh castShadow receiveShadow position={[-0.9, 0.15, 0.15]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 1.2, 16]} />
        {viewMode === 'Thermal' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshStandardMaterial color="#1e293b" roughness={0.9} metalness={0.1} />
        )}
      </mesh>
      <mesh castShadow receiveShadow position={[-0.9, 0.15, -0.15]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 1.2, 16]} />
        {viewMode === 'Thermal' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshStandardMaterial color="#1e293b" roughness={0.9} metalness={0.1} />
        )}
      </mesh>
    </group>
  );
};

export default HumanBody;
