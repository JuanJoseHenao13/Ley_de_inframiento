import { DoubleSide } from 'three';
import { ThermalMaterial } from './utils';

const TeaCup = ({ currentTemp, viewMode }: any) => {
  return (
    <group position={[0, 0.4, 0]}>
      {/* Cup Body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.4, 0.8, 32, 1, true]} />
        {viewMode === 'Thermal' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshStandardMaterial color="#fdfbf7" roughness={0.15} metalness={0.1} side={DoubleSide} />
        )}
      </mesh>
      
      {/* Cup Bottom */}
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
        <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} fallbackColor="#fdfbf7" fallbackRoughness={0.15} />
      </mesh>

      {/* Handle */}
      <mesh position={[0.6, 0.1, 0]} castShadow>
        <torusGeometry args={[0.25, 0.06, 16, 32]} />
        <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} fallbackColor="#fdfbf7" fallbackRoughness={0.15} />
      </mesh>

      {/* Tea Volume */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.6, 0.38, 0.65, 32]} />
        {viewMode === 'Thermal' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshPhysicalMaterial color="#c24a00" transmission={0.8} opacity={1} roughness={0} ior={1.33} transparent />
        )}
      </mesh>
      
      {/* Saucer */}
      <mesh position={[0, -0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 0.8, 0.05, 32]} />
        <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} fallbackColor="#fdfbf7" fallbackRoughness={0.15} />
      </mesh>
    </group>
  );
};

export default TeaCup;
