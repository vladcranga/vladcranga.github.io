import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'https://cdn.jsdelivr.net/npm/three@0.157.0/examples/jsm/renderers/CSS2DRenderer.js';

window.addEventListener('load', () => {
    const container = document.getElementById('skills-orbit');
    if (!container) {
        console.error('Container not found');
        throw new Error('Container not found');
    }

    const scene = new THREE.Scene();
    // Set field of view
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(container.clientWidth, container.clientHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(labelRenderer.domElement);

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    container.style.position = 'relative';

    // Handle window resize
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
        labelRenderer.setSize(width, height);
    });

    // Set camera viewing distance
    camera.position.z = 5;
    camera.position.y = 1;
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controls.enabled = false; // Disable all user interaction

    // Load profile picture
    const textureLoader = new THREE.TextureLoader();
    const profileTexture = textureLoader.load('attachments/me.png', (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.encoding = THREE.sRGBEncoding;
        texture.colorSpace = 'srgb';
    });

    const circleGeometry = new THREE.CircleGeometry(2.5, 32);  
    const circleMaterial = new THREE.MeshBasicMaterial({
        map: profileTexture,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false,
        depthTest: true
    });
    
    const ringGeometry = new THREE.RingGeometry(2.5, 2.65, 32);  
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x4B5563,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        depthWrite: false,
        depthTest: true
    });
    
    const centerCircle = new THREE.Mesh(circleGeometry, circleMaterial);
    const glowRing = new THREE.Mesh(ringGeometry, ringMaterial);
    
    centerCircle.lookAt(camera.position);
    glowRing.lookAt(camera.position);
    
    scene.add(centerCircle);
    scene.add(glowRing);

    const pointLight = new THREE.PointLight(0x4ade80, 1, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Create invisible orbits
    const orbits = [];
    const orbitGeometry = new THREE.TorusGeometry(3, 0.02, 16, 100);  
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x4ade80,
        transparent: true,
        opacity: 0,
    });

    for (let i = 0; i < 3; i++) {
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI * i / 3;
        orbit.rotation.y = Math.PI * i / 6;
        orbit.userData.initialRotationX = orbit.rotation.x;
        orbit.userData.initialRotationY = orbit.rotation.y;
        scene.add(orbit);
        orbits.push(orbit);
    }

    const skills = [];
    const skillsData = [
        { name: 'JavaScript', icon: 'devicon-javascript-plain colored', orbit: 0 },
        { name: 'Python', icon: 'devicon-python-plain colored', orbit: 0 },
        { name: 'React', icon: 'devicon-react-original colored', orbit: 1 },
        { name: 'Java', icon: 'devicon-java-plain colored', orbit: 1 },
        { name: 'HTML5', icon: 'devicon-html5-plain colored', orbit: 2 },
        { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-original colored', orbit: 2 },
        { name: 'Git', icon: 'devicon-git-plain colored', orbit: 0 },
        { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored', orbit: 1 },
        { name: 'C#', icon: 'devicon-csharp-line-wordmark', orbit: 2 },
        { name: 'Linux', icon: 'devicon-linux-plain', orbit: 0 },
        { name: 'Docker', icon: 'devicon-docker-plain colored', orbit: 1 },
    ];

    skillsData.forEach((skill, index) => {
        const orbitIndex = skill.orbit;
        const orbit = orbits[orbitIndex];
        const skillsInOrbit = skillsData.filter(s => s.orbit === orbitIndex).length;
        const skillIndexInOrbit = skillsData.slice(0, index).filter(s => s.orbit === orbitIndex).length;
        const angle = (skillIndexInOrbit * (2 * Math.PI)) / skillsInOrbit;
        const radius = 3;  

        const iconElement = document.createElement('i');
        iconElement.className = skill.icon;
        iconElement.style.fontSize = window.innerWidth < 768 ? '18px' : '22px';
        iconElement.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)';
        const skillLabel = new CSS2DObject(iconElement);

        // Calculate the position on the orbit
        const position = new THREE.Vector3(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
        );

        // Rotate the position according to the orbit's initial rotation
        position.applyAxisAngle(new THREE.Vector3(1, 0, 0), orbit.userData.initialRotationX);
        position.applyAxisAngle(new THREE.Vector3(0, 1, 0), orbit.userData.initialRotationY);

        skillLabel.position.copy(position);

        scene.add(skillLabel);
        skills.push({
            label: skillLabel,
            initialAngle: angle,
            orbitIndex: orbitIndex,
            orbit: orbit,
            speed: 0.0005
        });
    });

    function animate() {
        requestAnimationFrame(animate);
        controls.update();

        centerCircle.lookAt(camera.position);
        glowRing.lookAt(camera.position);

        orbits.forEach((orbit, index) => {
            orbit.rotation.y += 0.001 * (1 + index * 0.5);
        });

        skills.forEach(skill => {
            // Update the angle based on time and speed
            const time = Date.now() * skill.speed;
            const angle = skill.initialAngle + time;

            // Calculate the new position
            const position = new THREE.Vector3(
                Math.cos(angle) * 3,
                0,
                Math.sin(angle) * 3
            );

            // Apply the orbit's initial rotation
            position.applyAxisAngle(new THREE.Vector3(1, 0, 0), skill.orbit.userData.initialRotationX);
            position.applyAxisAngle(new THREE.Vector3(0, 1, 0), skill.orbit.userData.initialRotationY);

            // Apply the orbit's current rotation
            position.applyAxisAngle(
                new THREE.Vector3(0, 1, 0), skill.orbit.rotation.y - skill.orbit.userData.initialRotationY);

            skill.label.position.copy(position);
        });

        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
    }

    animate();
});