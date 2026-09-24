import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useHomesteadStore } from '../../store/useHomesteadStore';
import { useWeatherStore } from '../../store/useWeatherStore';
import { useTimelapseStore } from '../../store/useTimelapseStore';
import { PlacedStructure, WeatherType } from '../../types';

export const Viewport3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { structures, addStructure, removeStructure } = useHomesteadStore();
  const weather = useWeatherStore((s) => s.current);
  const windSpeed = useWeatherStore((s) => s.windSpeed);
  const {
    captureRequestSignal,
    isAutoCaptureEnabled,
    autoCaptureIntervalSec,
    addSnapshot,
  } = useTimelapseStore();

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const objectsGroupRef = useRef<THREE.Group | null>(null);
  const planeRef = useRef<THREE.Mesh | null>(null);

  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const particleCoordsRef = useRef<Float32Array | null>(null);
  const weatherRef = useRef<WeatherType>('CLEAR');
  const windSpeedRef = useRef<number>(6);

  useEffect(() => {
    weatherRef.current = weather;
  }, [weather]);

  useEffect(() => {
    windSpeedRef.current = windSpeed;
  }, [windSpeed]);

  // Procedural 3D Mesh Generator for each Homestead Object
  const createMeshForType = (structure: PlacedStructure): THREE.Group => {
    const group = new THREE.Group();
    group.position.set(structure.x * 2, 0, structure.z * 2);
    group.userData = { id: structure.id };

    switch (structure.type) {
      case 'CABIN': {
        const bodyGeo = new THREE.BoxGeometry(2.4, 1.8, 2.4);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x3d2314 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.9;
        group.add(body);

        const roofGeo = new THREE.ConeGeometry(2.0, 1.2, 4);
        const roofMat = new THREE.MeshStandardMaterial({ color: 0xFF003C });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.y = 2.4;
        roof.rotation.y = Math.PI / 4;
        group.add(roof);
        break;
      }
      case 'SOLAR-ARRAY': {
        const panelGeo = new THREE.BoxGeometry(1.6, 0.1, 1.2);
        const panelMat = new THREE.MeshStandardMaterial({ color: 0x00F3FF, emissive: 0x002244 });
        const panel = new THREE.Mesh(panelGeo, panelMat);
        panel.position.set(0, 0.8, 0);
        panel.rotation.x = -Math.PI / 6;
        group.add(panel);

        const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
        const legMat = new THREE.MeshBasicMaterial({ color: 0x666666 });
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.y = 0.4;
        group.add(leg);
        break;
      }
      case 'BATTERY-BANK': {
        const batGeo = new THREE.BoxGeometry(1.2, 1.4, 0.8);
        const batMat = new THREE.MeshStandardMaterial({ color: 0xE056FD, emissive: 0x330033 });
        const bat = new THREE.Mesh(batGeo, batMat);
        bat.position.y = 0.7;
        group.add(bat);
        break;
      }
      case 'RAIN-CISTERN': {
        const tankGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.6, 16);
        const tankMat = new THREE.MeshStandardMaterial({ color: 0x005588 });
        const tank = new THREE.Mesh(tankGeo, tankMat);
        tank.position.y = 0.8;
        group.add(tank);
        break;
      }
      case 'WELL-PUMP': {
        const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.8, 8);
        const pipeMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
        const pipe = new THREE.Mesh(pipeGeo, pipeMat);
        pipe.position.y = 0.9;
        group.add(pipe);
        break;
      }
      case 'RAISED-BED': {
        const bedGeo = new THREE.BoxGeometry(1.8, 0.4, 1.2);
        const bedMat = new THREE.MeshStandardMaterial({ color: 0x1b4d2e });
        const bed = new THREE.Mesh(bedGeo, bedMat);
        bed.position.y = 0.2;
        group.add(bed);

        const plantGeo = new THREE.SphereGeometry(0.25, 6, 6);
        const plantMat = new THREE.MeshBasicMaterial({ color: 0x39FF14 });
        const p1 = new THREE.Mesh(plantGeo, plantMat);
        p1.position.set(0.4, 0.5, 0);
        group.add(p1);
        break;
      }
      case 'GREENHOUSE': {
        const ghGeo = new THREE.BoxGeometry(2.0, 1.4, 1.6);
        const ghMat = new THREE.MeshStandardMaterial({ color: 0x00F3FF, transparent: true, opacity: 0.4 });
        const gh = new THREE.Mesh(ghGeo, ghMat);
        gh.position.y = 0.7;
        group.add(gh);
        break;
      }
      case 'COW-PASTURE': {
        const cowGeo = new THREE.BoxGeometry(1.4, 0.9, 0.7);
        const cowMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
        const cow = new THREE.Mesh(cowGeo, cowMat);
        cow.position.y = 0.5;
        group.add(cow);
        break;
      }
      case 'METHANE-DIGESTER': {
        const tankGeo = new THREE.SphereGeometry(0.9, 12, 12);
        const tankMat = new THREE.MeshStandardMaterial({ color: 0xFF003C });
        const tank = new THREE.Mesh(tankGeo, tankMat);
        tank.position.y = 0.9;
        group.add(tank);
        break;
      }
      case 'BIOCHAR-RETORT': {
        const drumGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 8);
        const drumMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
        const drum = new THREE.Mesh(drumGeo, drumMat);
        drum.position.y = 0.6;
        group.add(drum);
        break;
      }
    }

    return group;
  };

  // Snapshot capture routine
  const captureSnapshot = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    const dataUrl = rendererRef.current.domElement.toDataURL('image/jpeg', 0.85);
    const currentStructures = useHomesteadStore.getState().structures;
    const currentMetrics = useHomesteadStore.getState().metrics;
    const currentWeather = useWeatherStore.getState().current;

    addSnapshot({
      id: `snap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      dataUrl,
      structureCount: currentStructures.length,
      weather: currentWeather,
      sustainabilityScore: currentMetrics.sustainabilityScore,
      netPower: currentMetrics.netPower,
      netWater: currentMetrics.netWater,
      totalCalories: currentMetrics.totalCalories,
      note: `${currentStructures.length} Modules | ${currentWeather}`,
    });
  };

  // Scene initialization
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.02);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 22, 26);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // WebGL Renderer with preserveDrawingBuffer enabled for high-fidelity snapshots
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Environmental Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const dirLight = new THREE.DirectionalLight(0xE056FD, 1.2);
    dirLight.position.set(10, 30, 10);
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Interactive Ground Plane
    const planeGeo = new THREE.PlaneGeometry(60, 60);
    const planeMat = new THREE.MeshBasicMaterial({ visible: false });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);
    planeRef.current = plane;

    // Voxel Grid Visualizer
    const grid = new THREE.GridHelper(60, 30, 0xFF003C, 0x220033);
    scene.add(grid);

    // Weather Particle System (Rain, Snow, Acid Storm)
    const particleCount = 2400;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = Math.random() * 32;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleCoordsRef.current = positions;

    const particleMat = new THREE.PointsMaterial({
      color: 0x00F3FF,
      size: 0.22,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    particles.visible = false;
    scene.add(particles);
    particlesRef.current = particles;

    // Objects Container
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);
    objectsGroupRef.current = objectsGroup;

    // Render & Animation Loop
    let animId: number;
    let clock = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock += 0.02;

      // Particle physics simulation loop
      const curW = weatherRef.current;
      const curWind = windSpeedRef.current;

      if (particlesRef.current && particleCoordsRef.current) {
        if (curW === 'CLEAR') {
          particlesRef.current.visible = false;
        } else {
          particlesRef.current.visible = true;
          const pos = particleCoordsRef.current;
          const count = pos.length / 3;
          const windDrift = (curWind / 50) * 0.12;

          for (let i = 0; i < count; i++) {
            const idx = i * 3;

            if (curW === 'RAIN') {
              pos[idx + 1] -= 0.85; // Rapid vertical rain
              pos[idx + 0] += windDrift;
              if (pos[idx + 1] < 0) {
                pos[idx + 1] = 30 + Math.random() * 4;
                pos[idx + 0] = (Math.random() - 0.5) * 60;
                pos[idx + 2] = (Math.random() - 0.5) * 60;
              }
            } else if (curW === 'SNOW') {
              pos[idx + 1] -= 0.14; // Fluttering snow
              pos[idx + 0] += Math.sin(clock + i) * 0.04 + windDrift * 0.5;
              pos[idx + 2] += Math.cos(clock + i) * 0.03;
              if (pos[idx + 1] < 0) {
                pos[idx + 1] = 30;
                pos[idx + 0] = (Math.random() - 0.5) * 60;
                pos[idx + 2] = (Math.random() - 0.5) * 60;
              }
            } else if (curW === 'ACID_STORM') {
              pos[idx + 1] -= 1.15; // High velocity squall
              pos[idx + 0] += windDrift * 1.6;
              if (pos[idx + 1] < 0) {
                pos[idx + 1] = 30;
                pos[idx + 0] = (Math.random() - 0.5) * 60;
                pos[idx + 2] = (Math.random() - 0.5) * 60;
              }
            }
          }
          particlesRef.current.geometry.attributes.position.needsUpdate = true;

          // Subtle atmospheric lightning flicker in storms
          if ((curW === 'RAIN' || curW === 'ACID_STORM') && Math.random() < 0.004) {
            if (ambientLightRef.current) {
              ambientLightRef.current.intensity = 1.6;
              setTimeout(() => {
                if (ambientLightRef.current) {
                  ambientLightRef.current.intensity = curW === 'RAIN' ? 0.5 : 0.45;
                }
              }, 60);
            }
          }
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Initial baseline snapshot after 500ms
    const initialSnapTimer = setTimeout(() => {
      captureSnapshot();
    }, 500);

    return () => {
      clearTimeout(initialSnapTimer);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  // Synchronize environmental lighting with weather state
  useEffect(() => {
    if (!ambientLightRef.current || !dirLightRef.current || !sceneRef.current || !particlesRef.current) return;
    const mat = particlesRef.current.material as THREE.PointsMaterial;

    switch (weather) {
      case 'RAIN':
        ambientLightRef.current.color.setHex(0x335577);
        ambientLightRef.current.intensity = 0.5;
        dirLightRef.current.color.setHex(0x00F3FF);
        dirLightRef.current.intensity = 0.85;
        sceneRef.current.background = new THREE.Color(0x02070f);
        sceneRef.current.fog = new THREE.FogExp2(0x040d18, 0.03);
        mat.color.setHex(0x00F3FF);
        mat.size = 0.2;
        mat.opacity = 0.8;
        break;
      case 'SNOW':
        ambientLightRef.current.color.setHex(0x8899aa);
        ambientLightRef.current.intensity = 0.65;
        dirLightRef.current.color.setHex(0xddeeff);
        dirLightRef.current.intensity = 1.0;
        sceneRef.current.background = new THREE.Color(0x050a12);
        sceneRef.current.fog = new THREE.FogExp2(0x0a1424, 0.035);
        mat.color.setHex(0xffffff);
        mat.size = 0.32;
        mat.opacity = 0.9;
        break;
      case 'ACID_STORM':
        ambientLightRef.current.color.setHex(0x441122);
        ambientLightRef.current.intensity = 0.45;
        dirLightRef.current.color.setHex(0xFF003C);
        dirLightRef.current.intensity = 1.35;
        sceneRef.current.background = new THREE.Color(0x100206);
        sceneRef.current.fog = new THREE.FogExp2(0x1a0408, 0.038);
        mat.color.setHex(0xFF003C);
        mat.size = 0.26;
        mat.opacity = 0.85;
        break;
      case 'CLEAR':
      default:
        ambientLightRef.current.color.setHex(0xffffff);
        ambientLightRef.current.intensity = 0.8;
        dirLightRef.current.color.setHex(0xE056FD);
        dirLightRef.current.intensity = 1.2;
        sceneRef.current.background = new THREE.Color(0x000000);
        sceneRef.current.fog = new THREE.FogExp2(0x000000, 0.02);
        mat.color.setHex(0x00F3FF);
        mat.size = 0.22;
        mat.opacity = 0.0;
        break;
    }
  }, [weather]);

  // Periodic Snapshot Interval
  useEffect(() => {
    if (!isAutoCaptureEnabled) return;
    const interval = setInterval(() => {
      captureSnapshot();
    }, autoCaptureIntervalSec * 1000);
    return () => clearInterval(interval);
  }, [isAutoCaptureEnabled, autoCaptureIntervalSec]);

  // Manual Snapshot Capture Trigger
  useEffect(() => {
    if (captureRequestSignal > 0) {
      captureSnapshot();
    }
  }, [captureRequestSignal]);

  // Update Placed Structures
  useEffect(() => {
    if (!objectsGroupRef.current) return;
    // Clear old meshes
    while (objectsGroupRef.current.children.length > 0) {
      objectsGroupRef.current.remove(objectsGroupRef.current.children[0]);
    }

    structures.forEach((s) => {
      const mesh = createMeshForType(s);
      objectsGroupRef.current?.add(mesh);
    });
  }, [structures]);

  // Click Raycasting to Place / Remove
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !cameraRef.current || !sceneRef.current || !planeRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObject(planeRef.current);
    if (intersects.length > 0) {
      const pt = intersects[0].point;
      const gridX = Math.round(pt.x / 2);
      const gridZ = Math.round(pt.z / 2);

      if (e.button === 2) {
        // Right Click: Remove
        const match = structures.find((s) => s.x === gridX && s.z === gridZ);
        if (match) removeStructure(match.id);
      } else {
        // Left Click: Place
        addStructure(gridX, gridZ);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleClick}
      onContextMenu={(e) => e.preventDefault()}
      className="flex-1 w-full h-full bg-black cursor-crosshair relative"
    />
  );
};
