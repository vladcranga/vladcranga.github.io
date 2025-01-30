import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/controls/OrbitControls.js';

window.addEventListener('load', () => {
    const container = document.getElementById('phone-model');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.pointerEvents = 'none';  
    container.appendChild(renderer.domElement);
    container.style.position = 'relative';

    // Responsive handling
    const updateSize = () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        
        // Responsive scaling based on screen size
        let scale = 1;
        let cameraZ = 4;
        if (window.innerWidth <= 400) {  // Very small screens
            scale = 0.6;
            cameraZ = 6;
          // Medium phones or high pixel ratio devices
        } else if (window.innerWidth <= 440 || window.devicePixelRatio >= 3) {
            scale = 0.65;
            cameraZ = 5.5;
        } else if (window.innerWidth < 768) {  // Regular mobile
            scale = 0.7;
            cameraZ = 5;
        }
        
        camera.position.set(0, 0, cameraZ);
        frame.scale.set(scale, scale, scale);
        screen.scale.set(scale, scale, scale);
        camera.lookAt(0, 0, 0);
    };

    window.addEventListener('resize', updateSize);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false;
    camera.position.set(0, 0, 4);
    camera.lookAt(0, 0, 0);

    // Create phone frame with metallic material
    const frameGeometry = new THREE.BoxGeometry(8, 4, 0.2);
    const frameMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0x718096, 
        metalness: 0.7,
        roughness: 0.2,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    scene.add(frame);

    // Add home button
    const buttonGeometry = new THREE.CircleGeometry(0.15, 32);
    const buttonMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1f2937,
        metalness: 0.5,
        roughness: 0.3
    });
    const homeButton = new THREE.Mesh(buttonGeometry, buttonMaterial);
    homeButton.position.set(3.8, 0, 0.11); 
    frame.add(homeButton);

    // Add camera lens
    const cameraGeometry = new THREE.CircleGeometry(0.1, 32);
    const cameraMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        metalness: 0.9,
        roughness: 0.1
    });
    const cameraLens = new THREE.Mesh(cameraGeometry, cameraMaterial);
    cameraLens.position.set(-3.8, 0, 0.11); 
    frame.add(cameraLens);

    // Create screen
    const screenGeometry = new THREE.PlaneGeometry(7.2, 3.9); 
    const textureLoader = new THREE.TextureLoader();
    const screenTexture = textureLoader.load('attachments/linkedin_header.png', texture => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.colorSpace = 'srgb';
        
        const imageAspect = texture.image.width / texture.image.height;
        const screenAspect = 7.2 / 3.9; 
        
        if (imageAspect > screenAspect) {
            texture.repeat.set(1, screenAspect / imageAspect);
            texture.offset.set(0, (1 - screenAspect / imageAspect) / 2 - 0.05); 
        } else {
            texture.repeat.set(imageAspect / screenAspect, 1);
            texture.offset.set((1 - imageAspect / screenAspect) / 2, -0.05); 
        }
        
        updateSize();
    });
    
    const screenMaterial = new THREE.MeshBasicMaterial({
        map: screenTexture,
        side: THREE.FrontSide
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.101;
    scene.add(screen);

    // Add lighting
    const frontLight = new THREE.DirectionalLight(0xffffff, 1.5);
    frontLight.position.set(0, 0, 2);
    scene.add(frontLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(0, 0, -2);
    scene.add(backLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 0.8);
    topLight.position.set(0, 2, 1);
    scene.add(topLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Add floating animation
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;
        
        // Add floating movement
        frame.position.y = Math.sin(time) * 0.1;
        screen.position.y = frame.position.y;
        
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
});
