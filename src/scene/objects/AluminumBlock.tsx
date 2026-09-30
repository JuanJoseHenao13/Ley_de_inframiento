import React from 'react';
import { ThermalMaterial } from './utils';

const AluminumBlock = ({ currentTemp, viewMode }: any) => {
  return (
    <group position={[0, 0.5, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 1, 1.5]} />
        {viewMode === 'Thermal' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.8} />
        )}
      </mesh>
    </group>
  );
};

export default AluminumBlock;
