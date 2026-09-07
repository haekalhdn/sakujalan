'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeRunwayHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xF3F6F3, 0.015);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.2, 8.2);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 4. Lighting setup (Gojek signature emerald + gold specular)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00AA13, 3.2); // Gojek Green
    dirLight1.position.set(6, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00DF82, 2.2); // Neon Mint
    dirLight2.position.set(-6, -4, 4);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xFFD700, 2.5, 18); // Gold coin specular
    pointLight.position.set(0, 2, 4);
    scene.add(pointLight);

    // 5. Build SAKUJALAN 3D FINANCIAL OBJECT: "Remaining Cashflow Vault & Coin Orbit"
    const vaultGroup = new THREE.Group();
    scene.add(vaultGroup);

    // Materials
    const titaniumMaterial = new THREE.MeshStandardMaterial({
      color: 0x1A2820,
      metalness: 0.88,
      roughness: 0.22,
      flatShading: true,
    });

    const gojekGreenEmissive = new THREE.MeshStandardMaterial({
      color: 0x00AA13,
      emissive: 0x00AA13,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.15,
    });

    const mintGlowMaterial = new THREE.MeshStandardMaterial({
      color: 0x00DF82,
      emissive: 0x00DF82,
      emissiveIntensity: 0.7,
      metalness: 0.7,
      roughness: 0.2,
    });

    const emeraldGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00AA13,
      transparent: true,
      opacity: 0.7,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.85,
      ior: 1.5,
    });

    const goldCoinMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFB800,
      emissive: 0x664400,
      emissiveIntensity: 0.3,
      metalness: 0.95,
      roughness: 0.15,
    });

    // 5a. Central Vault Body (Faceted Dodecahedron / Smart Money Safe)
    const vaultCoreGeom = new THREE.DodecahedronGeometry(1.4, 0);
    const vaultCore = new THREE.Mesh(vaultCoreGeom, emeraldGlassMaterial);
    vaultGroup.add(vaultCore);

    // Inner Glowing Core (Remaining Discretionary Balance Energy)
    const innerCoreGeom = new THREE.IcosahedronGeometry(0.85, 1);
    const innerCore = new THREE.Mesh(innerCoreGeom, gojekGreenEmissive);
    vaultGroup.add(innerCore);

    // Outer Cage Bevels (Titanium Protective Shield = Reserve R)
    const cageGeom = new THREE.DodecahedronGeometry(1.45, 0);
    const wireframeGeom = new THREE.WireframeGeometry(cageGeom);
    const cageWireframe = new THREE.LineSegments(
      wireframeGeom,
      new THREE.LineBasicMaterial({ color: 0x00DF82, linewidth: 2 })
    );
    vaultGroup.add(cageWireframe);

    // Front Vault Safe Lock Wheel (Embossed Dial)
    const dialGeom = new THREE.CylinderGeometry(0.55, 0.55, 0.12, 24);
    dialGeom.rotateX(Math.PI / 2);
    const dial = new THREE.Mesh(dialGeom, titaniumMaterial);
    dial.position.set(0, 0, 1.35);
    vaultGroup.add(dial);

    const dialRingGeom = new THREE.TorusGeometry(0.42, 0.05, 8, 24);
    const dialRing = new THREE.Mesh(dialRingGeom, mintGlowMaterial);
    dialRing.position.set(0, 0, 1.42);
    vaultGroup.add(dialRing);

    // 5b. Orbiting Coins / GoPay Currency Tokens
    const coinsGroup = new THREE.Group();
    scene.add(coinsGroup);

    interface CoinNode {
      mesh: THREE.Mesh;
      orbitRadius: number;
      orbitSpeed: number;
      orbitTilt: number;
      spinSpeed: number;
      initialAngle: number;
    }

    const coinNodes: CoinNode[] = [];
    const coinGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.06, 24);
    coinGeom.rotateX(Math.PI / 2);

    const coinConfigs = [
      { radius: 2.5, speed: 0.9, tilt: 0.35, spin: 1.5, angle: 0, mat: goldCoinMaterial },
      { radius: 2.7, speed: -0.75, tilt: -0.4, spin: -1.8, angle: 1.2, mat: gojekGreenEmissive },
      { radius: 3.2, speed: 0.6, tilt: 0.6, spin: 2.0, angle: 2.4, mat: goldCoinMaterial },
      { radius: 3.4, speed: -0.85, tilt: -0.2, spin: -1.2, angle: 3.8, mat: mintGlowMaterial },
      { radius: 3.8, speed: 0.5, tilt: 0.45, spin: 1.6, angle: 5.0, mat: goldCoinMaterial },
    ];

    coinConfigs.forEach((cfg) => {
      const coin = new THREE.Mesh(coinGeom, cfg.mat);
      coinsGroup.add(coin);
      coinNodes.push({
        mesh: coin,
        orbitRadius: cfg.radius,
        orbitSpeed: cfg.speed,
        orbitTilt: cfg.tilt,
        spinSpeed: cfg.spin,
        initialAngle: cfg.angle,
      });
    });

    // 5c. Holographic Discretionary Orbit Rings (Formulas & Trajectory)
    const ring1Geom = new THREE.RingGeometry(2.5, 2.54, 64);
    const ring1 = new THREE.Mesh(
      ring1Geom,
      new THREE.MeshBasicMaterial({ color: 0x00AA13, side: THREE.DoubleSide, transparent: true, opacity: 0.45 })
    );
    ring1.rotation.x = Math.PI / 2.2;
    scene.add(ring1);

    const ring2Geom = new THREE.RingGeometry(3.5, 3.55, 64);
    const ring2 = new THREE.Mesh(
      ring2Geom,
      new THREE.MeshBasicMaterial({ color: 0x00DF82, side: THREE.DoubleSide, transparent: true, opacity: 0.35 })
    );
    ring2.rotation.x = Math.PI / 2.6;
    ring2.rotation.y = 0.25;
    scene.add(ring2);

    const ring3Geom = new THREE.TorusGeometry(1.9, 0.025, 8, 48);
    const ring3 = new THREE.Mesh(
      ring3Geom,
      new THREE.MeshBasicMaterial({ color: 0xFFB800, transparent: true, opacity: 0.5 })
    );
    scene.add(ring3);

    // 5d. Particle Dust (Financial Telemetry Sparks)
    const particleCount = 140;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colGreen = new THREE.Color(0x00AA13);
    const colMint = new THREE.Color(0x00DF82);
    const colGold = new THREE.Color(0xFFD700);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 12;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 7;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;

      const r = Math.random();
      const c = r < 0.5 ? colGreen : r < 0.8 ? colMint : colGold;
      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });
    const particleSystem = new THREE.Points(particleGeom, particleMaterial);
    scene.add(particleSystem);

    // 5e. Financial Horizon Runway Grid (Receding into depth)
    const gridHelper = new THREE.GridHelper(24, 24, 0x00AA13, 0xD4DED6);
    gridHelper.position.set(0, -2.5, 0);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.45;
    scene.add(gridHelper);

    // 6. Interactive Mouse Motion & Dynamic Damping
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouse.targetX = (clientX / rect.width) * 2 - 1;
      mouse.targetY = -(clientY / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Vault floating and rotation
      const hoverY = Math.sin(elapsedTime * 1.5) * 0.15;
      vaultGroup.position.y = hoverY + mouse.y * 0.35;
      vaultGroup.position.x = mouse.x * 0.45 + 1.8; // Shifted cleanly to right column

      vaultGroup.rotation.y = elapsedTime * 0.4 + mouse.x * 0.3;
      vaultGroup.rotation.x = Math.sin(elapsedTime * 0.8) * 0.12 - mouse.y * 0.25;

      // Lock Dial rotation
      dial.rotation.z = -elapsedTime * 0.8;

      // Orbiting Coins animation
      coinNodes.forEach((cn) => {
        const theta = elapsedTime * cn.orbitSpeed + cn.initialAngle;
        const x = Math.cos(theta) * cn.orbitRadius;
        const z = Math.sin(theta) * cn.orbitRadius;
        const y = Math.sin(theta) * cn.orbitRadius * Math.sin(cn.orbitTilt);

        cn.mesh.position.set(vaultGroup.position.x + x, vaultGroup.position.y + y, z);
        cn.mesh.rotation.y = elapsedTime * cn.spinSpeed;
        cn.mesh.rotation.z = Math.cos(elapsedTime * 2) * 0.3;
      });

      // Horizon rings rotation & synced position
      ring1.position.set(vaultGroup.position.x, vaultGroup.position.y, 0);
      ring2.position.set(vaultGroup.position.x, vaultGroup.position.y, 0);
      ring3.position.set(vaultGroup.position.x, vaultGroup.position.y, 0);
      ring1.rotation.z = elapsedTime * 0.15;
      ring2.rotation.z = -elapsedTime * 0.25;
      ring3.rotation.x = Math.sin(elapsedTime * 0.5) * 0.3;
      ring3.rotation.y = elapsedTime * 0.3;

      // Grid slow horizon drift & center aligned
      gridHelper.position.x = 1.8;
      gridHelper.position.z = (elapsedTime * 0.8) % 1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      vaultCoreGeom.dispose();
      innerCoreGeom.dispose();
      cageGeom.dispose();
      wireframeGeom.dispose();
      dialGeom.dispose();
      dialRingGeom.dispose();
      coinGeom.dispose();
      ring1Geom.dispose();
      ring2Geom.dispose();
      ring3Geom.dispose();
      particleGeom.dispose();
      titaniumMaterial.dispose();
      gojekGreenEmissive.dispose();
      mintGlowMaterial.dispose();
      emeraldGlassMaterial.dispose();
      goldCoinMaterial.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="three-runway-container"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        overflow: 'hidden',
        zIndex: 2,
      }}
    >
    </div>
  );
}
