import { DoubleSide } from 'three';
import { ThermalMaterial } from './utils';

const WaterGlass = ({ currentTemp, viewMode }: any) => {
  return (
    <group position={[0, 0.7, 0]}>
      {/* Glass Body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.4, 1.4, 32, 1, true]} />
        {viewMode === 'Thermal' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={1} metalness={0} roughness={0} ior={1.5} thickness={0.05} side={DoubleSide} transparent />
        )}
      </mesh>
      
      {/* Glass Bottom */}
      <mesh position={[0, -0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
        {viewMode === 'Thermal' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshPhysicalMaterial color="#ffffff" transmission={0.9} metalness={0} roughness={0} ior={1.5} thickness={0.1} transparent />
        )}
      </mesh>

      {/* Water Volume */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.45, 0.38, 1.1, 32]} />
        {viewMode === 'Thermal' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshPhysicalMaterial color="#e0f7fa" transmission={0.95} opacity={1} metalness={0} roughness={0} ior={1.33} transparent />
        )}
      </mesh>
    </group>
  );
};

export default WaterGlass;
