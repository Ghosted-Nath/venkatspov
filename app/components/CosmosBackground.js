import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function CosmosBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0520);
    scene.fog = new THREE.Fog(0x0a0520, 40, 120);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 10;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Create circular star texture
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    const starTexture = createCircleTexture();

    // Stars with varying brightness
    const starsGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    const starSizes = [];
    const starOpacities = [];
    
    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      starVertices.push(x, y, z);
      
      // Random sizes for bright and dim stars
      starSizes.push(Math.random() * 1.5 + 0.3);
      
      // Random opacity for brightness variation
      starOpacities.push(Math.random() * 0.6 + 0.4);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    starsGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
    starsGeometry.setAttribute('opacity', new THREE.Float32BufferAttribute(starOpacities, 1));
    
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      map: starTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Violet dust
    const violetDustGeo = new THREE.BufferGeometry();
    const violetVertices = [];
    for (let i = 0; i < 400; i++) {
      const x = (Math.random() - 0.5) * 80;
      const y = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;
      violetVertices.push(x, y, z);
    }
    violetDustGeo.setAttribute('position', new THREE.Float32BufferAttribute(violetVertices, 3));
    const violetMaterial = new THREE.PointsMaterial({
      color: 0x9333ea,
      size: 0.8,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      map: starTexture,
      depthWrite: false
    });
    const violetDust = new THREE.Points(violetDustGeo, violetMaterial);
    scene.add(violetDust);

    // Pink dust
    const pinkDustGeo = new THREE.BufferGeometry();
    const pinkVertices = [];
    for (let i = 0; i < 350; i++) {
      const x = (Math.random() - 0.5) * 70;
      const y = (Math.random() - 0.5) * 70;
      const z = (Math.random() - 0.5) * 70;
      pinkVertices.push(x, y, z);
    }
    pinkDustGeo.setAttribute('position', new THREE.Float32BufferAttribute(pinkVertices, 3));
    const pinkMaterial = new THREE.PointsMaterial({
      color: 0xec4899,
      size: 0.7,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      map: starTexture,
      depthWrite: false
    });
    const pinkDust = new THREE.Points(pinkDustGeo, pinkMaterial);
    scene.add(pinkDust);

    // Blue dust
    const blueDustGeo = new THREE.BufferGeometry();
    const blueVertices = [];
    for (let i = 0; i < 300; i++) {
      const x = (Math.random() - 0.5) * 60;
      const y = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 60;
      blueVertices.push(x, y, z);
    }
    blueDustGeo.setAttribute('position', new THREE.Float32BufferAttribute(blueVertices, 3));
    const blueMaterial = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 0.6,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      map: starTexture,
      depthWrite: false
    });
    const blueDust = new THREE.Points(blueDustGeo, blueMaterial);
    scene.add(blueDust);

    // Background sphere
    const bgGeometry = new THREE.SphereGeometry(60, 32, 32);
    const bgMaterial = new THREE.MeshBasicMaterial({
      color: 0x0f0728,
      transparent: true,
      opacity: 0.9,
      side: THREE.BackSide
    });
    const bgSphere = new THREE.Mesh(bgGeometry, bgMaterial);
    bgSphere.position.z = -60;
    scene.add(bgSphere);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Animation with smooth lerping
    const clock = new THREE.Clock();
    let animationId;
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const time = clock.getElapsedTime();

      // Smooth mouse parallax with lerp (removes jitter)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      // Smooth star rotation with parallax
      stars.rotation.y = time * 0.005;
      stars.rotation.x = mouseY * 0.03 + Math.sin(time * 0.05) * 0.01;
      stars.rotation.z = mouseX * 0.03;

      // Violet dust - slow drift
      violetDust.rotation.y = time * 0.01;
      violetDust.rotation.x = time * 0.005;
      violetDust.position.x = Math.sin(time * 0.15) * 2 + mouseX * 1.2;
      violetDust.position.y = Math.cos(time * 0.12) * 1.5 + mouseY * 1;

      // Pink dust - medium drift
      pinkDust.rotation.y = -time * 0.012;
      pinkDust.rotation.z = time * 0.006;
      pinkDust.position.x = Math.cos(time * 0.18) * 2.5 - mouseX * 1.1;
      pinkDust.position.y = Math.sin(time * 0.14) * 2 - mouseY * 1.2;

      // Blue dust - gentle drift
      blueDust.rotation.y = time * 0.008;
      blueDust.rotation.x = -time * 0.004;
      blueDust.position.x = Math.sin(time * 0.1) * 1.8 + mouseX * 0.8;
      blueDust.position.y = Math.cos(time * 0.16) * 1.2 - mouseY * 0.8;

      // Background sphere rotation
      bgSphere.rotation.y = time * 0.003;
      bgSphere.rotation.z = time * 0.002;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      violetDustGeo.dispose();
      violetMaterial.dispose();
      pinkDustGeo.dispose();
      pinkMaterial.dispose();
      blueDustGeo.dispose();
      blueMaterial.dispose();
      bgGeometry.dispose();
      bgMaterial.dispose();
      starTexture.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-screen -z-10 bg-gradient-to-b from-[#0a0520] via-[#1a0b3f] to-[#0f0728]">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-purple-950/20 via-transparent to-blue-950/10 pointer-events-none" />
    </div>
  );
}