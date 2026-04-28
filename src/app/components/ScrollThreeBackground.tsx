import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    while (mountRef.current.firstChild) {
      mountRef.current.removeChild(mountRef.current.firstChild);
    }

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020205, 0.005);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 85;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';

    mountRef.current.appendChild(renderer.domElement);

    // ==========================================
    // 1. CENTRAL ANIMATION (Untouched)
    // ==========================================
    const NODE_COUNT = 450; 
    const MAX_LINES = NODE_COUNT * 12; 
    const CONNECTION_DISTANCE = 16; 

    const currentPos = new Float32Array(NODE_COUNT * 3);
    const velocities = new Float32Array(NODE_COUNT * 3);
    
    const shapeDNA = new Float32Array(NODE_COUNT * 3);
    const shapeBrain = new Float32Array(NODE_COUNT * 3);
    const shapeHeart = new Float32Array(NODE_COUNT * 3);
    const shapeLungs = new Float32Array(NODE_COUNT * 3);

    for (let i = 0; i < NODE_COUNT; i++) {
      const i3 = i * 3;
      const t = i / NODE_COUNT;

      // DNA
      const dy = (t - 0.5) * 140; 
      const dAngle = dy * 0.12;
      const dRad = 16; 
      const isStrand2 = i % 2 === 0;
      shapeDNA[i3] = Math.cos(dAngle + (isStrand2 ? Math.PI : 0)) * dRad; 
      shapeDNA[i3 + 1] = dy;
      shapeDNA[i3 + 2] = Math.sin(dAngle + (isStrand2 ? Math.PI : 0)) * dRad;

      // BRAIN
      const bPhi = Math.acos(1 - 2 * t);
      const bTheta = Math.PI * 2 * i / ((1 + Math.sqrt(5)) / 2); 
      const bRad = 28 + Math.sin(bTheta * 4) * 3; 
      shapeBrain[i3] = bRad * Math.sin(bPhi) * Math.cos(bTheta);
      shapeBrain[i3 + 1] = bRad * Math.cos(bPhi);
      shapeBrain[i3 + 2] = bRad * Math.sin(bPhi) * Math.sin(bTheta);

      // HEART
      const hTheta = Math.random() * Math.PI * 2;
      const hPhi = Math.acos(2 * Math.random() - 1);
      const hMathX = 16 * Math.pow(Math.sin(hTheta), 3) * Math.sin(hPhi);
      const hMathY = 13 * Math.cos(hTheta) - 5 * Math.cos(2*hTheta) - 2 * Math.cos(3*hTheta) - Math.cos(4*hTheta);
      shapeHeart[i3] = (hMathX * 1.8);
      shapeHeart[i3 + 1] = (hMathY * 1.8);
      shapeHeart[i3 + 2] = (Math.sin(hPhi) * Math.sin(hTheta)) * 12; 

      // LUNGS
      const lIsLeft = i % 2 === 0;
      const lPhi = Math.acos(1 - 2 * Math.random());
      const lTheta = Math.random() * Math.PI * 2;
      const lRad = 18; 
      let lx = lRad * Math.sin(lPhi) * Math.cos(lTheta);
      let ly = lRad * Math.cos(lPhi) * 2.0; 
      let lz = lRad * Math.sin(lPhi) * Math.sin(lTheta);
      lx += (lIsLeft ? -16 : 16); 
      shapeLungs[i3] = lx;
      shapeLungs[i3 + 1] = ly - 8;
      shapeLungs[i3 + 2] = lz * 0.8;

      currentPos[i3] = shapeDNA[i3] + (Math.random() - 0.5) * 8;
      currentPos[i3 + 1] = shapeDNA[i3 + 1] + (Math.random() - 0.5) * 8;
      currentPos[i3 + 2] = shapeDNA[i3 + 2] + (Math.random() - 0.5) * 8;
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(currentPos, 3));
    const nodeMaterial = new THREE.PointsMaterial({
      size: 0.9,
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(nodes);

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(MAX_LINES * 3);
    const lineColors = new Float32Array(MAX_LINES * 3);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35, 
      blending: THREE.AdditiveBlending
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);


    // ==========================================
    // 2. PERIPHERAL MACRO-EDGES
    // ==========================================
    const EDGE_COUNT = 200; 
    const EDGE_MAX_LINES = EDGE_COUNT * 6;
    const EDGE_CONN_DIST = 25; 

    const edgePos = new Float32Array(EDGE_COUNT * 3);
    const edgeBase = new Float32Array(EDGE_COUNT * 3);
    const edgeVel = new Float32Array(EDGE_COUNT * 3);

    for (let i = 0; i < EDGE_COUNT; i++) {
      const i3 = i * 3;
      const isLeft = i % 2 === 0;
      
      const ex = (isLeft ? -1 : 1) * (65 + Math.random() * 40);
      const ey = (Math.random() - 0.5) * 200; 
      const ez = (Math.random() - 0.5) * 60; 

      edgeBase[i3] = ex;
      edgeBase[i3 + 1] = ey;
      edgeBase[i3 + 2] = ez;

      edgePos[i3] = ex;
      edgePos[i3 + 1] = ey;
      edgePos[i3 + 2] = ez;
    }

    // Custom Shader for Edge Nodes (Massively boosted brightness)
    const edgeNodeGeometry = new THREE.BufferGeometry();
    edgeNodeGeometry.setAttribute('position', new THREE.BufferAttribute(edgePos, 3));
    const edgeNodeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0x00f0ff) },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        uniform float uPixelRatio;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = (120.0 * uPixelRatio) / max(1.0, -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        void main() {
          vec2 xy = gl_PointCoord.xy - vec2(0.5);
          float ll = length(xy);
          if(ll > 0.5) discard; 
          // Widened decay (12.0) and boosted alpha multiplier (0.95) for brilliant glow
          float alpha = exp(-ll * ll * 12.0) * 0.95;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const edgeNodes = new THREE.Points(edgeNodeGeometry, edgeNodeMaterial);
    scene.add(edgeNodes);

    const edgeLineGeometry = new THREE.BufferGeometry();
    const edgeLinePos = new Float32Array(EDGE_MAX_LINES * 3);
    const edgeLineCol = new Float32Array(EDGE_MAX_LINES * 3);
    edgeLineGeometry.setAttribute('position', new THREE.BufferAttribute(edgeLinePos, 3));
    edgeLineGeometry.setAttribute('color', new THREE.BufferAttribute(edgeLineCol, 3));
    
    const edgeLineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      // Opacity boosted to match central lines
      opacity: 0.45, 
      blending: THREE.AdditiveBlending
    });
    const edgeLines = new THREE.LineSegments(edgeLineGeometry, edgeLineMaterial);
    scene.add(edgeLines);


    // ==========================================
    // 3. GLOBAL STATE & PHYSICS TRACKING
    // ==========================================
    const state = {
      scrollVal: 0,
      color1: new THREE.Color(0x00f0ff), 
      color2: new THREE.Color(0xff00aa), 
      color3: new THREE.Color(0xff1133), 
      color4: new THREE.Color(0x00ffa8), 
      currentColor: new THREE.Color()
    };

    const mouse3D = new THREE.Vector3(9999, 9999, 0); 
    const handleMouseMove = (e: MouseEvent) => {
      mouse3D.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse3D.y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse3D.unproject(camera);
      const dir = mouse3D.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      mouse3D.copy(camera.position).add(dir.multiplyScalar(distance));
    };
    window.addEventListener('mousemove', handleMouseMove);

    const scrollTrigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.0, 
      onUpdate: (self) => {
        state.scrollVal = self.progress * 3.0;
      }
    });


    // ==========================================
    // 4. MAIN RENDER ENGINE
    // ==========================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const render = () => {
      const time = clock.getElapsedTime();
      
      const p1 = Math.max(0, Math.min(1, state.scrollVal));
      const p2 = Math.max(0, Math.min(1, state.scrollVal - 1.0));
      const p3 = Math.max(0, Math.min(1, state.scrollVal - 2.0));

      state.currentColor.copy(state.color1);
      state.currentColor.lerp(state.color2, p1);
      state.currentColor.lerp(state.color3, p2);
      state.currentColor.lerp(state.color4, p3);
      
      nodeMaterial.color.copy(state.currentColor);
      edgeNodeMaterial.uniforms.uColor.value.copy(state.currentColor);

      // --- A. CENTRAL PHYSICS LOOP ---
      let vertexIndex = 0;
      let lineCount = 0;

      for (let i = 0; i < NODE_COUNT; i++) {
        const i3 = i * 3;

        let tx = shapeDNA[i3];
        let ty = shapeDNA[i3 + 1];
        let tz = shapeDNA[i3 + 2];

        tx += (shapeBrain[i3] - tx) * p1;
        ty += (shapeBrain[i3 + 1] - ty) * p1;
        tz += (shapeBrain[i3 + 2] - tz) * p1;

        tx += (shapeHeart[i3] - tx) * p2;
        ty += (shapeHeart[i3 + 1] - ty) * p2;
        tz += (shapeHeart[i3 + 2] - tz) * p2;

        tx += (shapeLungs[i3] - tx) * p3;
        ty += (shapeLungs[i3 + 1] - ty) * p3;
        tz += (shapeLungs[i3 + 2] - tz) * p3;

        tx += Math.sin(time * 0.5 + i) * 2.0;
        ty += Math.cos(time * 0.4 + i) * 2.0;
        tz += Math.sin(time * 0.6 + i) * 2.0;

        const dxMouse = currentPos[i3] - mouse3D.x;
        const dyMouse = currentPos[i3 + 1] - mouse3D.y;
        const dzMouse = currentPos[i3 + 2] - mouse3D.z;
        const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse + dzMouse * dzMouse;
        
        if (distMouseSq < 600) { 
          const force = (600 - distMouseSq) * 0.005;
          velocities[i3] += dxMouse * force;
          velocities[i3 + 1] += dyMouse * force;
          velocities[i3 + 2] += dzMouse * force;
        }

        const springTension = 0.05;
        const dampening = 0.85;

        velocities[i3] += (tx - currentPos[i3]) * springTension;
        velocities[i3 + 1] += (ty - currentPos[i3 + 1]) * springTension;
        velocities[i3 + 2] += (tz - currentPos[i3 + 2]) * springTension;

        velocities[i3] *= dampening;
        velocities[i3 + 1] *= dampening;
        velocities[i3 + 2] *= dampening;

        currentPos[i3] += velocities[i3];
        currentPos[i3 + 1] += velocities[i3 + 1];
        currentPos[i3 + 2] += velocities[i3 + 2];
      }

      nodes.geometry.attributes.position.needsUpdate = true;

      // Central Lines
      for (let i = 0; i < NODE_COUNT; i++) {
        const i3 = i * 3;
        const px = currentPos[i3];
        const py = currentPos[i3 + 1];
        const pz = currentPos[i3 + 2];

        for (let j = i + 1; j < NODE_COUNT; j++) {
          const j3 = j * 3;
          const dx = px - currentPos[j3];
          const dy = py - currentPos[j3 + 1];
          const dz = pz - currentPos[j3 + 2];
          
          if (dx * dx + dy * dy + dz * dz < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
            linePositions[vertexIndex++] = px;
            linePositions[vertexIndex++] = py;
            linePositions[vertexIndex++] = pz;
            linePositions[vertexIndex++] = currentPos[j3];
            linePositions[vertexIndex++] = currentPos[j3 + 1];
            linePositions[vertexIndex++] = currentPos[j3 + 2];

            const cR = state.currentColor.r, cG = state.currentColor.g, cB = state.currentColor.b;
            lineColors[vertexIndex - 6] = cR; lineColors[vertexIndex - 5] = cG; lineColors[vertexIndex - 4] = cB;
            lineColors[vertexIndex - 3] = cR; lineColors[vertexIndex - 2] = cG; lineColors[vertexIndex - 1] = cB;

            lineCount++;
            if (lineCount >= MAX_LINES / 2) break; 
          }
        }
      }
      lines.geometry.setDrawRange(0, lineCount * 2);
      lines.geometry.attributes.position.needsUpdate = true;
      lines.geometry.attributes.color.needsUpdate = true;


      // --- B. PERIPHERAL EDGE PHYSICS LOOP ---
      let edgeVertexIndex = 0;
      let edgeLineCount = 0;

      for (let i = 0; i < EDGE_COUNT; i++) {
        const i3 = i * 3;
        
        let tx = edgeBase[i3] + Math.sin(time * 0.2 + i) * 8.0;
        let ty = edgeBase[i3 + 1] + Math.sin(time * 0.1 + i) * 35.0; 
        let tz = edgeBase[i3 + 2] + Math.cos(time * 0.15 + i) * 10.0;

        const dxMouse = edgePos[i3] - mouse3D.x;
        const dyMouse = edgePos[i3 + 1] - mouse3D.y;
        const dzMouse = edgePos[i3 + 2] - mouse3D.z;
        const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse + dzMouse * dzMouse;
        
        if (distMouseSq < 800) { 
          const force = (800 - distMouseSq) * 0.003;
          edgeVel[i3] += dxMouse * force;
          edgeVel[i3 + 1] += dyMouse * force;
          edgeVel[i3 + 2] += dzMouse * force;
        }

        edgeVel[i3] += (tx - edgePos[i3]) * 0.015;
        edgeVel[i3 + 1] += (ty - edgePos[i3 + 1]) * 0.015;
        edgeVel[i3 + 2] += (tz - edgePos[i3 + 2]) * 0.015;

        edgeVel[i3] *= 0.92;
        edgeVel[i3 + 1] *= 0.92;
        edgeVel[i3 + 2] *= 0.92;

        edgePos[i3] += edgeVel[i3];
        edgePos[i3 + 1] += edgeVel[i3 + 1];
        edgePos[i3 + 2] += edgeVel[i3 + 2];
      }
      
      edgeNodes.geometry.attributes.position.needsUpdate = true;

      // Edge Lines
      for (let i = 0; i < EDGE_COUNT; i++) {
        const i3 = i * 3;
        const px = edgePos[i3];
        const py = edgePos[i3 + 1];
        const pz = edgePos[i3 + 2];

        const isLeft1 = edgeBase[i3] < 0;

        for (let j = i + 1; j < EDGE_COUNT; j++) {
          const j3 = j * 3;
          const isLeft2 = edgeBase[j3] < 0;
          if(isLeft1 !== isLeft2) continue; 

          const dx = px - edgePos[j3];
          const dy = py - edgePos[j3 + 1];
          const dz = pz - edgePos[j3 + 2];
          
          if (dx * dx + dy * dy + dz * dz < EDGE_CONN_DIST * EDGE_CONN_DIST) {
            edgeLinePos[edgeVertexIndex++] = px;
            edgeLinePos[edgeVertexIndex++] = py;
            edgeLinePos[edgeVertexIndex++] = pz;
            edgeLinePos[edgeVertexIndex++] = edgePos[j3];
            edgeLinePos[edgeVertexIndex++] = edgePos[j3 + 1];
            edgeLinePos[edgeVertexIndex++] = edgePos[j3 + 2];

            const cR = state.currentColor.r, cG = state.currentColor.g, cB = state.currentColor.b;
            edgeLineCol[edgeVertexIndex - 6] = cR; edgeLineCol[edgeVertexIndex - 5] = cG; edgeLineCol[edgeVertexIndex - 4] = cB;
            edgeLineCol[edgeVertexIndex - 3] = cR; edgeLineCol[edgeVertexIndex - 2] = cG; edgeLineCol[edgeVertexIndex - 1] = cB;

            edgeLineCount++;
            if (edgeLineCount >= EDGE_MAX_LINES / 2) break; 
          }
        }
      }
      edgeLines.geometry.setDrawRange(0, edgeLineCount * 2);
      edgeLines.geometry.attributes.position.needsUpdate = true;
      edgeLines.geometry.attributes.color.needsUpdate = true;
      
      scene.rotation.y = Math.sin(time * 0.1) * 0.25;
      scene.rotation.x = Math.cos(time * 0.1) * 0.15;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      
      edgeNodeMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
      ScrollTrigger.refresh();
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      scrollTrigger.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      
      edgeNodeGeometry.dispose();
      edgeNodeMaterial.dispose();
      edgeLineGeometry.dispose();
      edgeLineMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0, 
        pointerEvents: 'none',
        background: 'transparent',
        overflow: 'hidden'
      }}
    />
  );
};

export default ScrollThreeBackground;