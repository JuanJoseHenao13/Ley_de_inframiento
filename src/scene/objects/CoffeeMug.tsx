import React from 'react';
import * as THREE from 'three';
import { ThermalMaterial } from './utils';

const CoffeeMug = ({ currentTemp, viewMode }: any) => {
  const isThermal = viewMode === 'Thermal' || viewMode === 'Heatmap' || viewMode === 'Transfer';

  return (
    <group position={[0, 0.15, 0]}>

      {/* ── Plato base ── */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.95, 0.85, 0.08, 64]} />
        <ThermalMaterial
          currentTemp={currentTemp - 5}
          viewMode={viewMode}
          fallbackColor="#e8e8e8"
          fallbackRoughness={0.15}
          fallbackMetalness={0.05}
        />
      </mesh>

      {/* ── Cuerpo de la taza (cilindro abierto arriba) ── */}
      <mesh castShadow receiveShadow position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.55, 0.48, 1.15, 64, 1, false]} />
        <ThermalMaterial
          currentTemp={currentTemp}
          viewMode={viewMode}
          fallbackColor="#ffffff"
          fallbackRoughness={0.08}
          fallbackMetalness={0.08}
        />
      </mesh>

      {/* ── Fondo de la taza ── */}
      <mesh castShadow receiveShadow position={[0, 0.155, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.48, 64]} />
        <ThermalMaterial
          currentTemp={currentTemp}
          viewMode={viewMode}
          fallbackColor="#ffffff"
          fallbackRoughness={0.08}
          fallbackMetalness={0.08}
        />
      </mesh>

      {/* ── Asa ── */}
      <mesh castShadow position={[0.68, 0.72, 0]}>
        <torusGeometry args={[0.28, 0.07, 32, 64, Math.PI]} />
        <ThermalMaterial
          currentTemp={currentTemp}
          viewMode={viewMode}
          fallbackColor="#ffffff"
          fallbackRoughness={0.08}
          fallbackMetalness={0.08}
        />
      </mesh>

      {/* ── Café líquido (volumen interior) ── */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.46, 0.40, 0.95, 64]} />
        {isThermal ? (
          <ThermalMaterial
            currentTemp={currentTemp + 5} // El líquido es el punto más caliente
            viewMode={viewMode}
          />
        ) : (
          <meshStandardMaterial color="#1a0a02" roughness={0.1} metalness={0.0} />
        )}
      </mesh>

      {/* ── Superficie del café (espejo brillante) ── */}
      <mesh position={[0, 1.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.46, 64]} />
        {isThermal ? (
          <ThermalMaterial
            currentTemp={currentTemp + 8} // La superficie es el punto de más emisión
            viewMode={viewMode}
          />
        ) : (
          <meshPhysicalMaterial
            color="#2a0f02"
            roughness={0.0}
            metalness={0.0}
            clearcoat={1.0}
            clearcoatRoughness={0.0}
            reflectivity={0.8}
          />
        )}
      </mesh>

      {/* ── Vapor condensado en el borde interior (sutil) ── */}
      {!isThermal && currentTemp > 50 && (
        <mesh position={[0, 1.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.44, 0.54, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={Math.min(0.3, (currentTemp - 50) / 100)}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

export default CoffeeMug;
