import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useHomesteadStore } from '../../store/useHomesteadStore';
import { PlacedStructure } from '../../types';

export const Viewport3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { structures, addStructure, removeStructure } = useHomesteadStore();

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const objectsGroupRef = useRef<THREE.Group | null>(null);
  const planeRef = useRef<THREE.Mesh | null>(null);

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

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xE056FD, 1.2);
    dirLight.position.set(10, 30, 10);
    scene.add(dirLight);

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

    // Objects Container
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);
    objectsGroupRef.current = objectsGroup;

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
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

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

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