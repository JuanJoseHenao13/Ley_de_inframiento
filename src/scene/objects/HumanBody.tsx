import { ThermalMaterial } from './utils';

const HumanBody = ({ currentTemp, viewMode }: any) => {
  return (
    <group position={[0, 0.4, 0]} scale={0.8} rotation={[Math.PI / 2, 0, 0]}>
      {/* Head */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        {viewMode === 'Thermal' || viewMode === 'Heatmap' || viewMode === 'Transfer' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshStandardMaterial color="#ffccaa" roughness={0.4} metalness={0.1} />
        )}
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.25, 0.6, 16, 32]} />
        {viewMode === 'Thermal' || viewMode === 'Heatmap' || viewMode === 'Transfer' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshStandardMaterial color="#3b82f6" roughness={0.8} metalness={0.1} />
        )}
      </mesh>

      {/* Arms */}
      <mesh position={[0.4, 0.5, 0]} rotation={[0, 0, -Math.PI / 8]} castShadow receiveShadow>
        <capsuleGeometry args={[0.1, 0.5, 16, 16]} />
        {viewMode === 'Thermal' || viewMode === 'Heatmap' || viewMode === 'Transfer' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshStandardMaterial color="#ffccaa" roughness={0.4} />
        )}
      </mesh>
      <mesh position={[-0.4, 0.5, 0]} rotation={[0, 0, Math.PI / 8]} castShadow receiveShadow>
        <capsuleGeometry args={[0.1, 0.5, 16, 16]} />
        {viewMode === 'Thermal' || viewMode === 'Heatmap' || viewMode === 'Transfer' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshStandardMaterial color="#ffccaa" roughness={0.4} />
        )}
      </mesh>

      {/* Legs */}
      <mesh position={[0.15, -0.4, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.12, 0.6, 16, 16]} />
        {viewMode === 'Thermal' || viewMode === 'Heatmap' || viewMode === 'Transfer' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        )}
      </mesh>
      <mesh position={[-0.15, -0.4, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.12, 0.6, 16, 16]} />
        {viewMode === 'Thermal' || viewMode === 'Heatmap' || viewMode === 'Transfer' ? (
          <ThermalMaterial currentTemp={currentTemp} viewMode={viewMode} />
        ) : (
          <meshStandardMaterial color="#1e293b" roughness={0.9} />
        )}
      </mesh>
    </group>
  );
};

export default HumanBody;
