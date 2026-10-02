import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

// ─── Paleta FLIR / Ironbow REAL (idéntica a las imágenes de referencia) ───────
// black → purple → blue → cyan → green → yellow → orange → red → white
export const getThermalColor = (temp: number) => {
  const t = Math.max(0, Math.min(1, (temp + 10) / 110));

  const stops = [
    { at: 0.00, c: new THREE.Color('#000000') }, // Frio extremo: Negro
    { at: 0.10, c: new THREE.Color('#1a0033') }, // Violeta muy oscuro
    { at: 0.22, c: new THREE.Color('#6600aa') }, // Morado
    { at: 0.35, c: new THREE.Color('#cc0066') }, // Fucsia/Magenta
    { at: 0.48, c: new THREE.Color('#ff2200') }, // Rojo vivo
    { at: 0.60, c: new THREE.Color('#ff8800') }, // Naranja
    { at: 0.72, c: new THREE.Color('#ffee00') }, // Amarillo
    { at: 0.85, c: new THREE.Color('#ffffff') }, // Blanco caliente
    { at: 1.00, c: new THREE.Color('#ffffff') },
  ];

  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].at && t <= stops[i + 1].at) {
      const localT = (t - stops[i].at) / (stops[i + 1].at - stops[i].at);
      return stops[i].c.clone().lerp(stops[i + 1].c, localT);
    }
  }
  return stops[stops.length - 1].c.clone();
};

// ─── Shader de Fluido Simplex (Mapa de calor + Transferencia) ─────────────────
const FluidAuraMaterialImpl = shaderMaterial(
  {
    time: 0,
    color1: new THREE.Color('#ff0000'),
    color2: new THREE.Color('#220033'),
    intensity: 1.0,
    isTransfer: false,
  },
  /* vertex */ `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* fragment */ `
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float intensity;
    uniform bool isTransfer;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
    vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
    vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

    float snoise(vec3 v){
      const vec2 C=vec2(1./6.,1./3.);
      const vec4 D=vec4(0.,.5,1.,2.);
      vec3 i=floor(v+dot(v,C.yyy));
      vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz);
      vec3 l=1.-g;
      vec3 i1=min(g.xyz,l.zxy);
      vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx;
      vec3 x2=x0-i2+C.yyy;
      vec3 x3=x0-D.yyy;
      i=mod289(i);
      vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
      float n_=0.142857142857;
      vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.*floor(p*ns.z*ns.z);
      vec4 x_=floor(j*ns.z);
      vec4 y_=floor(j-7.*x_);
      vec4 x=x_*ns.x+ns.yyyy;
      vec4 y=y_*ns.x+ns.yyyy;
      vec4 h=1.-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy);
      vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.+1.;
      vec4 s1=floor(b1)*2.+1.;
      vec4 sh=-step(h,vec4(0.));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
      vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x);
      vec3 p1=vec3(a0.zw,h.y);
      vec3 p2=vec3(a1.xy,h.z);
      vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
      vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
      m=m*m;
      return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }

    void main(){
      vec3 np=vPosition*2.;
      if(isTransfer) np.y-=time*2.5;
      else           np+=time*.6;

      float n=snoise(np);
      float n2=snoise(np*2.+3.7);

      vec3 vd=normalize(cameraPosition-vPosition);
      float fr=clamp(1.-dot(vd,normalize(vNormal)),0.,1.);

      float alpha=(n*.5+.5)*intensity;
      alpha*=(1.-pow(fr,2.));
      alpha=clamp(alpha,0.,1.);

      vec3 fc=mix(color2,color1,n*.5+.5);
      // Add contour lines for heatmap
      if(!isTransfer){
        float contour=fract((n2+n)*.5*8.);
        if(contour<0.08||contour>0.92) fc=mix(fc,vec3(1.),0.5);
      }

      if(alpha<0.04) discard;
      gl_FragColor=vec4(fc,alpha);
    }
  `
);
extend({ FluidAuraMaterialImpl });

// ─── Componente FluidAura ──────────────────────────────────────────────────────
export const FluidAura = ({ currentTemp, deltaT, isTransfer = false }: any) => {
  const matRef = useRef<any>(null);
  const color1 = useMemo(() => getThermalColor(currentTemp), [currentTemp]);
  const color2 = useMemo(() => getThermalColor(Math.max(-10, currentTemp - 40)), [currentTemp]);
  const intensity = Math.min(1.0, Math.abs(deltaT) / 25);

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.time = clock.elapsedTime;
  });

  return (
    <mesh>
      <sphereGeometry args={[1.6, 64, 64]} />
      {/* @ts-ignore */}
      <fluidAuraMaterialImpl
        ref={matRef}
        color1={color1}
        color2={color2}
        intensity={intensity * 0.9}
        isTransfer={isTransfer}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// ─── ThermalMaterial (Ironbow aplicado a geometría) ───────────────────────────
// Para vista Térmica: usa el shader Ironbow en el material del mesh directamente.
// Para Heatmap/Transfer: material emissivo + el FluidAura lo envuelve.
export const ThermalMaterial = ({
  currentTemp,
  viewMode,
  fallbackColor,
  fallbackRoughness = 0.2,
  fallbackMetalness = 0.1,
  transparent = false,
  opacity = 1,
}: any) => {
  const color = useMemo(() => getThermalColor(currentTemp), [currentTemp]);

  if (viewMode === 'Thermal' || viewMode === 'Heatmap' || viewMode === 'Transfer') {
    return (
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={viewMode === 'Thermal' ? 0.9 : 0.5}
        roughness={1}
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
