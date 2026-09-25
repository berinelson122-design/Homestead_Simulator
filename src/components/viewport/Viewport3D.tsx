import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useHomesteadStore } from '../../store/useHomesteadStore';
import { useWeatherStore } from '../../store/useWeatherStore';
import { useTimelapseStore } from '../../store/useTimelapseStore';
import { useSeasonStore, SEASONAL_CONFIGS } from '../../store/useSeasonStore';
import { PlacedStructure, WeatherType } from '../../types';

export const Viewport3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const {
    structures,
    addStructure,
    removeStructureAtGrid,
    interactionMode,
    cameraResetCounter,
    isBlueprintMode,
    isEnergyOverlayMode,
  } = useHomesteadStore();

  const weather = useWeatherStore((s) => s.current);
  const windSpeed = useWeatherStore((s) => s.windSpeed);
  const {
    captureRequestSignal,
    isAutoCaptureEnabled,
    autoCaptureIntervalSec,
    addSnapshot,
  } = useTimelapseStore();

  const currentSeason = useSeasonStore((s) => s.currentSeason);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const objectsGroupRef = useRef<THREE.Group | null>(null);
  const energyOverlayGroupRef = useRef<THREE.Group | null>(null);
  const planeRef = useRef<THREE.Mesh | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);
  const terrainMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const cursorMeshRef = useRef<THREE.Mesh | null>(null);

  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const particleCoordsRef = useRef<Float32Array | null>(null);
  const weatherRef = useRef<WeatherType>('CLEAR');
  const windSpeedRef = useRef<number>(6);

  // Power Conduit Energy Pulses Animation Ref
  const energyPulsesRef = useRef<Array<{ line: THREE.Line; points: THREE.Vector3[]; progress: number; pulseMesh: THREE.Mesh }>>([]);

  // Camera Orbit & Touch State Refs
  const sphericalRef = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 34,
    theta: 0,
    phi: Math.PI / 4,
  });

  const touchPointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const dragStartRef = useRef<{ x: number; y: number; moved: boolean }>({ x: 0, y: 0, moved: false });
  const pinchStartDistRef = useRef<number | null>(null);
  const lastTapTimeRef = useRef<number>(0);

  useEffect(() => {
    weatherRef.current = weather;
  }, [weather]);

  useEffect(() => {
    windSpeedRef.current = windSpeed;
  }, [windSpeed]);

  // Update camera position from spherical coordinates
  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = sphericalRef.current;
    cameraRef.current.position.x = radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = radius * Math.cos(phi);
    cameraRef.current.position.z = radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(0, 0, 0);
  };

  // Reset Camera to default isometric angle
  useEffect(() => {
    if (cameraResetCounter > 0) {
      sphericalRef.current = {
        radius: 34,
        theta: 0,
        phi: Math.PI / 4,
      };
      updateCameraPosition();
    }
  }, [cameraResetCounter]);

  // Procedural 3D Mesh Generator with Blueprint Support
  const createMeshForType = (structure: PlacedStructure, blueprint: boolean): THREE.Group => {
    const group = new THREE.Group();
    group.position.set(structure.x * 2, 0, structure.z * 2);
    group.userData = { id: structure.id };

    const getMat = (baseColor: number, emissiveColor: number = 0x000000, opacity: number = 1.0) => {
      if (blueprint) {
        return new THREE.MeshBasicMaterial({
          color: 0x00F3FF,
          wireframe: true,
          transparent: true,
          opacity: 0.75,
        });
      }
      return new THREE.MeshStandardMaterial({
        color: baseColor,
        emissive: emissiveColor,
        transparent: opacity < 1.0,
        opacity,
      });
    };

    switch (structure.type) {
      case 'CABIN': {
        const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 2.4), getMat(0x3d2314));
        body.position.y = 0.9;
        group.add(body);

        const roof = new THREE.Mesh(
          new THREE.ConeGeometry(2.0, 1.2, 4),
          blueprint ? getMat(0x00F3FF) : getMat(0xFF003C)
        );
        roof.position.y = 2.4;
        roof.rotation.y = Math.PI / 4;
        group.add(roof);
        break;
      }
      case 'SOLAR-ARRAY': {
        const panel = new THREE.Mesh(
          new THREE.BoxGeometry(1.6, 0.1, 1.2),
          blueprint ? getMat(0x00F3FF) : getMat(0x00F3FF, 0x002244)
        );
        panel.position.set(0, 0.8, 0);
        panel.rotation.x = -Math.PI / 6;
        group.add(panel);

        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8), getMat(0x666666));
        leg.position.y = 0.4;
        group.add(leg);
        break;
      }
      case 'BATTERY-BANK': {
        const bat = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 1.4, 0.8),
          blueprint ? getMat(0xE056FD) : getMat(0xE056FD, 0x330033)
        );
        bat.position.y = 0.7;
        group.add(bat);
        break;
      }
      case 'RAIN-CISTERN': {
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.6, 16), getMat(0x005588));
        tank.position.y = 0.8;
        group.add(tank);
        break;
      }
      case 'WELL-PUMP': {
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.8, 8), getMat(0x888888));
        pipe.position.y = 0.9;
        group.add(pipe);
        break;
      }
      case 'RAISED-BED': {
        const bed = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.4, 1.2), getMat(0x1b4d2e));
        bed.position.y = 0.2;
        group.add(bed);

        const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.25, 6, 6), getMat(0x39FF14));
        p1.position.set(0.4, 0.5, 0);
        group.add(p1);
        break;
      }
      case 'GREENHOUSE': {
        const gh = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.4, 1.6), getMat(0x00F3FF, 0x000000, 0.4));
        gh.position.y = 0.7;
        group.add(gh);
        break;
      }
      case 'COW-PASTURE': {
        const cow = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 0.7), getMat(0xdddddd));
        cow.position.y = 0.5;
        group.add(cow);
        break;
      }
      case 'METHANE-DIGESTER': {
        const tank = new THREE.Mesh(
          new THREE.SphereGeometry(0.9, 12, 12),
          blueprint ? getMat(0x00F3FF) : getMat(0xFF003C)
        );
        tank.position.y = 0.9;
        group.add(tank);
        break;
      }
      case 'BIOCHAR-RETORT': {
        const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.2, 8), getMat(0x111111));
        drum.position.y = 0.6;
        group.add(drum);
        break;
      }
    }

    // Blueprint dimensional boundary
    if (blueprint) {
      const boundGeo = new THREE.BoxGeometry(2.5, 0.05, 2.5);
      const boundMat = new THREE.MeshBasicMaterial({
        color: 0x00F3FF,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
      });
      const boundMesh = new THREE.Mesh(boundGeo, boundMat);
      boundMesh.position.y = 0.02;
      group.add(boundMesh);

      const circleGeo = new THREE.RingGeometry(1.5, 1.55, 24);
      const circleMat = new THREE.MeshBasicMaterial({
        color: 0xE056FD,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      });
      const circleMesh = new THREE.Mesh(circleGeo, circleMat);
      circleMesh.rotation.x = -Math.PI / 2;
      circleMesh.position.y = 0.03;
      group.add(circleMesh);
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
      note: `${currentStructures.length} Modules | ${currentWeather} | ${currentSeason}`,
    });
  };

  // Scene initialization
  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x01140a);
    scene.fog = new THREE.FogExp2(0x021c0e, 0.02);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      200
    );
    cameraRef.current = camera;
    updateCameraPosition();

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Environmental Lighting
    const ambientLight = new THREE.AmbientLight(0xd6fbe8, 0.8);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const dirLight = new THREE.DirectionalLight(0x66ffaa, 1.2);
    dirLight.position.set(10, 30, 10);
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Seasonal Terrain Ground Mesh
    const terrainGeo = new THREE.PlaneGeometry(60, 60, 16, 16);
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x0a2615,
      roughness: 0.85,
      metalness: 0.1,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.rotation.x = -Math.PI / 2;
    terrainMesh.position.y = -0.01;
    scene.add(terrainMesh);
    terrainMeshRef.current = terrainMesh;
    terrainMatRef.current = terrainMat;

    // Interactive Ground Raycast Plane
    const planeGeo = new THREE.PlaneGeometry(60, 60);
    const planeMat = new THREE.MeshBasicMaterial({ visible: false });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);
    planeRef.current = plane;

    // Voxel Grid Visualizer
    const grid = new THREE.GridHelper(60, 30, 0x39FF14, 0x113322);
    scene.add(grid);
    gridHelperRef.current = grid;

    // Interactive Cursor Voxel Reticle
    const cursorGeo = new THREE.RingGeometry(0.6, 0.9, 4);
    const cursorMat = new THREE.MeshBasicMaterial({
      color: 0x00F3FF,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const cursorMesh = new THREE.Mesh(cursorGeo, cursorMat);
    cursorMesh.rotation.x = -Math.PI / 2;
    cursorMesh.rotation.z = Math.PI / 4;
    cursorMesh.position.set(0, 0.05, 0);
    cursorMesh.visible = false;
    scene.add(cursorMesh);
    cursorMeshRef.current = cursorMesh;

    // Energy Overlay Container
    const energyOverlayGroup = new THREE.Group();
    scene.add(energyOverlayGroup);
    energyOverlayGroupRef.current = energyOverlayGroup;

    // Weather Particle System
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

      // Advance seasonal cycle progress tick (0.02 sec per frame)
      useSeasonStore.getState().advanceSeasonTick(0.02);

      // Dynamic Seasonal Color Interpolation (Gradual Transition)
      const curSeason = useSeasonStore.getState().currentSeason;
      const sCfg = SEASONAL_CONFIGS[curSeason];

      if (!isBlueprintMode) {
        if (terrainMatRef.current) {
          terrainMatRef.current.color.lerp(new THREE.Color(sCfg.terrainColor), 0.03);
        }
        if (sceneRef.current) {
          sceneRef.current.background = (sceneRef.current.background as THREE.Color).lerp(
            new THREE.Color(sCfg.skyColor),
            0.03
          );
          if (sceneRef.current.fog) {
            (sceneRef.current.fog as THREE.FogExp2).color.lerp(new THREE.Color(sCfg.fogColor), 0.03);
          }
        }
        if (ambientLightRef.current) {
          ambientLightRef.current.color.lerp(new THREE.Color(sCfg.ambientColor), 0.03);
        }
        if (dirLightRef.current) {
          dirLightRef.current.color.lerp(new THREE.Color(sCfg.sunColor), 0.03);
        }
      }

      // Animate Energy Overlay Power Pulses
      if (energyPulsesRef.current.length > 0) {
        energyPulsesRef.current.forEach((pulse) => {
          pulse.progress = (pulse.progress + 0.015) % 1.0;
          if (pulse.points.length >= 2) {
            const p1 = pulse.points[0];
            const p2 = pulse.points[1];
            pulse.pulseMesh.position.lerpVectors(p1, p2, pulse.progress);
            pulse.pulseMesh.position.y = 0.2 + Math.sin(clock * 5) * 0.05;
          }
        });
      }

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
              pos[idx + 1] -= 0.85;
              pos[idx + 0] += windDrift;
              if (pos[idx + 1] < 0) {
                pos[idx + 1] = 30 + Math.random() * 4;
                pos[idx + 0] = (Math.random() - 0.5) * 60;
                pos[idx + 2] = (Math.random() - 0.5) * 60;
              }
            } else if (curW === 'SNOW') {
              pos[idx + 1] -= 0.14;
              pos[idx + 0] += Math.sin(clock + i) * 0.04 + windDrift * 0.5;
              pos[idx + 2] += Math.cos(clock + i) * 0.03;
              if (pos[idx + 1] < 0) {
                pos[idx + 1] = 30;
                pos[idx + 0] = (Math.random() - 0.5) * 60;
                pos[idx + 2] = (Math.random() - 0.5) * 60;
              }
            } else if (curW === 'ACID_STORM') {
              pos[idx + 1] -= 1.15;
              pos[idx + 0] += windDrift * 1.6;
              if (pos[idx + 1] < 0) {
                pos[idx + 1] = 30;
                pos[idx + 0] = (Math.random() - 0.5) * 60;
                pos[idx + 2] = (Math.random() - 0.5) * 60;
              }
            }
          }
          particlesRef.current.geometry.attributes.position.needsUpdate = true;

          // Atmospheric lightning flicker in storms
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

    const initialSnapTimer = setTimeout(() => {
      captureSnapshot();
    }, 500);

    return () => {
      clearTimeout(initialSnapTimer);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      particleGeo.dispose();
      particleMat.dispose();
      cursorGeo.dispose();
      cursorMat.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      renderer.dispose();
    };
  }, []);

  // Synchronize Blueprint Mode
  useEffect(() => {
    if (!ambientLightRef.current || !dirLightRef.current || !sceneRef.current) return;

    if (isBlueprintMode) {
      sceneRef.current.background = new THREE.Color(0x010814);
      sceneRef.current.fog = new THREE.FogExp2(0x020d20, 0.025);
      ambientLightRef.current.color.setHex(0x00F3FF);
      ambientLightRef.current.intensity = 0.9;
      dirLightRef.current.color.setHex(0x00F3FF);
      dirLightRef.current.intensity = 1.0;
    }
  }, [isBlueprintMode]);

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

  // Update Placed Structures & Blueprint Wireframes
  useEffect(() => {
    if (!objectsGroupRef.current) return;
    while (objectsGroupRef.current.children.length > 0) {
      objectsGroupRef.current.remove(objectsGroupRef.current.children[0]);
    }

    structures.forEach((s) => {
      const mesh = createMeshForType(s, isBlueprintMode);
      objectsGroupRef.current?.add(mesh);
    });
  }, [structures, isBlueprintMode]);

  // Update Visual Energy Overlay & Animated Conduits
  useEffect(() => {
    if (!energyOverlayGroupRef.current) return;
    while (energyOverlayGroupRef.current.children.length > 0) {
      energyOverlayGroupRef.current.remove(energyOverlayGroupRef.current.children[0]);
    }
    energyPulsesRef.current = [];

    if (!isEnergyOverlayMode) return;

    const generators = structures.filter((s) => s.type === 'SOLAR-ARRAY' || s.type === 'METHANE-DIGESTER');
    const batteries = structures.filter((s) => s.type === 'BATTERY-BANK');
    const consumers = structures.filter(
      (s) => s.type === 'CABIN' || s.type === 'WELL-PUMP' || s.type === 'GREENHOUSE'
    );

    // 1. Ground Power Heatmap Tiles
    structures.forEach((s) => {
      const isGen = s.type === 'SOLAR-ARRAY' || s.type === 'METHANE-DIGESTER';
      const isBat = s.type === 'BATTERY-BANK';
      const isCon = s.type === 'CABIN' || s.type === 'WELL-PUMP' || s.type === 'GREENHOUSE';

      const tileColor = isGen ? 0x39FF14 : isBat ? 0xE056FD : isCon ? 0xFF9900 : 0x00F3FF;
      const tileRadius = isGen ? 2.4 : isBat ? 2.0 : 1.8;

      const tileGeo = new THREE.RingGeometry(0.2, tileRadius, 16);
      const tileMat = new THREE.MeshBasicMaterial({
        color: tileColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
      });
      const tileMesh = new THREE.Mesh(tileGeo, tileMat);
      tileMesh.rotation.x = -Math.PI / 2;
      tileMesh.position.set(s.x * 2, 0.04, s.z * 2);
      energyOverlayGroupRef.current?.add(tileMesh);
    });

    // 2. Power Flow Conduits & Pulse Packets
    const addConduit = (from: PlacedStructure, to: PlacedStructure, color: number) => {
      const p1 = new THREE.Vector3(from.x * 2, 0.15, from.z * 2);
      const p2 = new THREE.Vector3(to.x * 2, 0.15, to.z * 2);

      const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const lineMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.7,
        linewidth: 2,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      energyOverlayGroupRef.current?.add(line);

      const pulseGeo = new THREE.SphereGeometry(0.18, 8, 8);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      pulseMesh.position.copy(p1);
      energyOverlayGroupRef.current?.add(pulseMesh);

      energyPulsesRef.current.push({
        line,
        points: [p1, p2],
        progress: Math.random(),
        pulseMesh,
      });
    };

    // Link Generators -> Batteries
    generators.forEach((gen) => {
      if (batteries.length > 0) {
        let closest = batteries[0];
        let minDist = Infinity;
        batteries.forEach((bat) => {
          const d = Math.hypot(gen.x - bat.x, gen.z - bat.z);
          if (d < minDist) {
            minDist = d;
            closest = bat;
          }
        });
        addConduit(gen, closest, 0x39FF14);
      }
    });

    // Link Batteries -> Consumers
    const powerSources = batteries.length > 0 ? batteries : generators;
    consumers.forEach((con) => {
      if (powerSources.length > 0) {
        let closest = powerSources[0];
        let minDist = Infinity;
        powerSources.forEach((src) => {
          const d = Math.hypot(con.x - src.x, con.z - src.z);
          if (d < minDist) {
            minDist = d;
            closest = src;
          }
        });
        addConduit(closest, con, 0x00F3FF);
      }
    });
  }, [structures, isEnergyOverlayMode]);

  // Raycasting helper
  const getGridFromPointer = (clientX: number, clientY: number): { gridX: number; gridZ: number } | null => {
    if (!containerRef.current || !cameraRef.current || !planeRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);

    const intersects = raycaster.intersectObject(planeRef.current);
    if (intersects.length > 0) {
      const pt = intersects[0].point;
      return {
        gridX: Math.round(pt.x / 2),
        gridZ: Math.round(pt.z / 2),
      };
    }
    return null;
  };

  // Pointer Down
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    touchPointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    dragStartRef.current = { x: e.clientX, y: e.clientY, moved: false };

    if (touchPointersRef.current.size === 2) {
      const pts = Array.from(touchPointersRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStartDistRef.current = dist;
    }
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const coords = getGridFromPointer(e.clientX, e.clientY);
    if (coords && cursorMeshRef.current) {
      cursorMeshRef.current.visible = true;
      cursorMeshRef.current.position.set(coords.gridX * 2, 0.05, coords.gridZ * 2);
      const isDemolish = interactionMode === 'DEMOLISH';
      const mat = cursorMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.color.setHex(isDemolish ? 0xFF003C : isBlueprintMode ? 0x00F3FF : 0x00F3FF);
    }

    if (!touchPointersRef.current.has(e.pointerId)) return;
    touchPointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.hypot(dx, dy) > 8) {
      dragStartRef.current.moved = true;
    }

    // 2-Finger Pinch Zoom
    if (touchPointersRef.current.size === 2) {
      const pts = Array.from(touchPointersRef.current.values());
      const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (pinchStartDistRef.current !== null) {
        const delta = pinchStartDistRef.current - currentDist;
        sphericalRef.current.radius = Math.max(12, Math.min(55, sphericalRef.current.radius + delta * 0.08));
        pinchStartDistRef.current = currentDist;
        updateCameraPosition();
      }
      return;
    }

    // 1-Finger Orbit Drag
    if (touchPointersRef.current.size === 1 && (dragStartRef.current.moved || interactionMode === 'ORBIT')) {
      const sensitivity = 0.006;
      sphericalRef.current.theta -= e.movementX ? e.movementX * sensitivity : dx * 0.003;
      sphericalRef.current.phi = Math.max(
        0.15,
        Math.min(1.45, sphericalRef.current.phi - (e.movementY ? e.movementY * sensitivity : dy * 0.003))
      );
      updateCameraPosition();
    }
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const wasMoved = dragStartRef.current.moved;
    touchPointersRef.current.delete(e.pointerId);
    if (touchPointersRef.current.size < 2) {
      pinchStartDistRef.current = null;
    }

    const now = Date.now();
    if (now - lastTapTimeRef.current < 280 && !wasMoved) {
      sphericalRef.current = { radius: 34, theta: 0, phi: Math.PI / 4 };
      updateCameraPosition();
      lastTapTimeRef.current = 0;
      return;
    }
    lastTapTimeRef.current = now;

    if (!wasMoved && interactionMode !== 'ORBIT') {
      const coords = getGridFromPointer(e.clientX, e.clientY);
      if (coords) {
        if (e.button === 2 || interactionMode === 'DEMOLISH') {
          removeStructureAtGrid(coords.gridX, coords.gridZ);
        } else {
          addStructure(coords.gridX, coords.gridZ);
        }
      }
    }
  };

  // Wheel Zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    sphericalRef.current.radius = Math.max(12, Math.min(55, sphericalRef.current.radius + e.deltaY * 0.03));
    updateCameraPosition();
  };

  const seasonCfg = SEASONAL_CONFIGS[currentSeason];

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        if (cursorMeshRef.current) cursorMeshRef.current.visible = false;
        touchPointersRef.current.clear();
      }}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
      className="flex-1 w-full h-full bg-black cursor-crosshair relative touch-none select-none"
    >
      {/* Active Badges */}
      <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5 pointer-events-none font-mono text-[10px]">
        {/* Active Season Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/85 border border-[#E056FD] text-[#E056FD] shadow-[0_0_10px_rgba(224,86,253,0.3)] backdrop-blur-sm">
          <span className="w-1.5 h-1.5 bg-[#E056FD] animate-pulse" />
          <span className="font-bold">{seasonCfg.label} // CYCLE</span>
        </div>

        {isBlueprintMode && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/85 border border-[#00F3FF] text-[#00F3FF] shadow-[0_0_12px_rgba(0,243,255,0.4)] backdrop-blur-sm animate-pulse">
            <span className="w-1.5 h-1.5 bg-[#00F3FF]" />
            <span className="font-bold">BLUEPRINT DRAFTING MODE ACTIVE</span>
          </div>
        )}
        {isEnergyOverlayMode && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/85 border border-[#39FF14] text-[#39FF14] shadow-[0_0_12px_rgba(57,255,20,0.4)] backdrop-blur-sm animate-pulse">
            <span className="w-1.5 h-1.5 bg-[#39FF14]" />
            <span className="font-bold">ENERGY GRID OVERLAY &amp; CONDUITS ACTIVE</span>
          </div>
        )}
      </div>
    </div>
  );
};
