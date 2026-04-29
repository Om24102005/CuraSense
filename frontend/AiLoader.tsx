import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface AiLoaderProps {
    isLoading: boolean;
}

export default function AiLoader({ isLoading }: AiLoaderProps) {
    const mountRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<{ scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, mesh: THREE.Mesh } | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // 1. Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Alpha: true makes the Three.js background transparent so our Tailwind overlay shows through
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);

        // 2. 3D Object (Neural/Medical AI vibe - Wireframe Icosahedron)
        const geometry = new THREE.IcosahedronGeometry(2, 2);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00f0ff, // Neon cyan
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        sceneRef.current = { scene, camera, renderer, mesh };

        // 3. Cursor Interaction Tracking
        let targetRotationX = 0;
        let targetRotationY = 0;

        const handleMouseMove = (event: MouseEvent) => {
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            targetRotationY = mouseX * 0.5;
            targetRotationX = mouseY * 0.5;
        };
        window.addEventListener('mousemove', handleMouseMove);

        // 4. Scroll Animation
        const handleScroll = () => {
            const scrollY = window.scrollY;
            gsap.to(mesh.position, {
                y: scrollY * 0.005,
                duration: 0.5,
                ease: "power2.out"
            });
        };
        window.addEventListener('scroll', handleScroll);

        // 5. GSAP Text Pulsate
        const textAnim = gsap.to(textRef.current, {
            opacity: 0.4,
            yoyo: true,
            repeat: -1,
            duration: 1.2,
            ease: "power1.inOut"
        });

        // Resize Handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // 6. Animation Loop
        let animationFrameId: number;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            // Base rotation
            mesh.rotation.y += 0.002;
            mesh.rotation.x += 0.001;

            // Smoothly interpolate current rotation to target rotation (cursor)
            mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.05;
            mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.05;

            renderer.render(scene, camera);
        };
        animate();

        // 7. Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            textAnim.kill();

            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    // GSAP Fade In/Out based on isLoading prop
    useEffect(() => {
        if (!wrapperRef.current) return;

        if (isLoading) {
            gsap.to(wrapperRef.current, {
                opacity: 1,
                pointerEvents: 'auto',
                duration: 0.5,
                ease: "power2.out"
            });
        } else {
            gsap.to(wrapperRef.current, {
                opacity: 0,
                pointerEvents: 'none',
                duration: 0.8,
                ease: "power2.inOut"
            });
        }
    }, [isLoading]);

    return (
        <div
            ref={wrapperRef}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm overflow-hidden opacity-0 pointer-events-none"
        >
            {/* 3D Canvas Background */}
            <div ref={mountRef} className="absolute inset-0 w-full h-full" />

            {/* Foreground Content */}
            <div ref={textRef} className="relative z-[10000] text-center pointer-events-none">
                <h2 className="text-[#00f0ff] font-['Sport_Future'] text-4xl md:text-6xl tracking-widest uppercase mb-4 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">
                    CuraSense AI
                </h2>
                <p className="text-gray-300 font-['Inter'] text-lg md:text-xl tracking-wide">
                    Analyzing God Level Diagnostics...
                </p>
            </div>
        </div>
    );
}