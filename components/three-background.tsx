"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import anime from 'animejs';

interface ThreeBackgroundProps {
  scrollProgress: number;
}

export default function ThreeBackground({ scrollProgress }: ThreeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const shapesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create shapes
    const shapes: THREE.Mesh[] = [];
    const colors = [
      new THREE.Color(0x9333EA), // purple-600
      new THREE.Color(0x7E22CE), // purple-700
      new THREE.Color(0x6B21A8), // purple-800
      new THREE.Color(0x581C87), // purple-900
      new THREE.Color(0x4C1D95)  // purple-950
    ];

    // Create 10 random geometric shapes (original background)
    for (let i = 0; i < 100; i++) {
      let geometry;
      const shapeType = Math.floor(Math.random() * 3);
      
      switch (shapeType) {
        case 0:
          geometry = new THREE.TetrahedronGeometry(Math.random() * 0.5 + 0.3);
          break;
        case 1:
          geometry = new THREE.OctahedronGeometry(Math.random() * 0.4 + 0.2);
          break;
        default:
          geometry = new THREE.IcosahedronGeometry(Math.random() * 0.4 + 0.2);
      }
      
      const material = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        wireframe: true,
        transparent: true,
        opacity: 0.3 + Math.random() * 0.2
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      
      // Position meshes randomly in a spherical volume
      const radius = 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
      mesh.position.y = radius * Math.sin(phi) * Math.sin(theta) - 2;
      mesh.position.z = radius * Math.cos(phi) - 5;
      
      // Random rotation
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      
      scene.add(mesh);
      shapes.push(mesh);
      
      // Add animation with anime.js
      anime({
        targets: mesh.rotation,
        x: mesh.rotation.x + Math.PI * 2,
        y: mesh.rotation.y + Math.PI * 2,
        duration: 10000 + Math.random() * 20000,
        easing: 'linear',
        loop: true
      });
      
      anime({
        targets: mesh.position,
        y: mesh.position.y + (Math.random() - 0.5) * 1.5,
        duration: 8000 + Math.random() * 10000,
        easing: 'easeInOutSine',
        direction: 'alternate',
        loop: true
      });
    }
    
    // Create additional right-side triangle cluster (new shapes)
    const createRightSideTriangles = () => {
      // Create more triangles specifically on the right side
      for (let i = 0; i < 15; i++) {
        // Create tetrahedrons (triangular pyramids) of varying sizes
        const geometry = new THREE.TetrahedronGeometry(Math.random() * 0.4 + 0.2);
        
        const material = new THREE.MeshBasicMaterial({
          color: colors[Math.floor(Math.random() * colors.length)],
          wireframe: true,
          transparent: true,
          opacity: 0.2 + Math.random() * 0.3
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        
        // Position right side cluster
        // X: positive values (right side of screen)
        // Y: distributed vertically
        // Z: varied depth
        mesh.position.x = 4 + Math.random() * 4; // Only on the right side
        mesh.position.y = -4 + Math.random() * 8; // Distributed vertically
        mesh.position.z = -6 + Math.random() * 4; // Varied depth
        
        // Random rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;
        
        scene.add(mesh);
        shapes.push(mesh);
        
        // Subtle floating animation
        anime({
          targets: mesh.rotation,
          x: mesh.rotation.x + Math.PI * 2,
          y: mesh.rotation.y + Math.PI * 2,
          z: mesh.rotation.z + Math.PI * 2,
          duration: 15000 + Math.random() * 20000,
          easing: 'linear',
          loop: true
        });
        
        // Subtle position animation
        anime({
          targets: mesh.position,
          y: mesh.position.y + (Math.random() - 0.5) * 1,
          x: mesh.position.x + (Math.random() - 0.5) * 0.5,
          duration: 10000 + Math.random() * 8000,
          easing: 'easeInOutSine',
          direction: 'alternate',
          loop: true
        });
      }
    };
    
    createRightSideTriangles();
    
    shapesRef.current = shapes;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      shapes.forEach((shape, i) => {
        // Additional subtle rotation
        shape.rotation.z += 0.001 * (i % 3 + 1);
      });
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      shapes.forEach(shape => {
        scene.remove(shape);
        shape.geometry.dispose();
        (shape.material as THREE.Material).dispose();
      });
    };
  }, []);

  // Update based on scroll progress
  useEffect(() => {
    if (!shapesRef.current.length) return;
    
    shapesRef.current.forEach((shape, i) => {
      // Parallax effect based on scroll
      const zOffset = (scrollProgress / 100) * 2 * ((i % 3) - 1);
      anime({
        targets: shape.position,
        z: shape.position.z + zOffset,
        duration: 800,
        easing: 'easeOutQuad'
      });
      
      // Increase opacity slightly on scroll
      const material = shape.material as THREE.MeshBasicMaterial;
      anime({
        targets: material,
        opacity: 0.3 + (scrollProgress / 100) * 0.2 * ((i % 5) / 5),
        duration: 800,
        easing: 'easeOutQuad'
      });
    });
  }, [scrollProgress]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}