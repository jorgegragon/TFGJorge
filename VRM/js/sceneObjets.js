import * as THREE from 'three';

export function getSphere() {
    const geometry = new THREE.SphereGeometry(0.075, 4.8, 3);
    const material = new THREE.MeshBasicMaterial({color: "red"});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = 0.5;
    mesh.castShadow = true;
    mesh.name = "sphere";
    return mesh;
}

export function getSide(texture) {
    const geometry = new THREE.BoxGeometry(0.2, 10, 8);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    material.map.wrapS = THREE.RepeatWrapping;
    material.map.wrapT = THREE.RepeatWrapping;
    material.map.anisotropy = 1;
    material.map.repeat.set(4, 8);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = 2;
    return mesh;
}

export function getBox(texture) {
    const geometry = new THREE.BoxGeometry(0.45, 0.3, 0.6);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = 2;
    mesh.layers.enable(1);
    return mesh;
}

export function getWall(texture) {
    const geometry = new THREE.PlaneGeometry(5, 5);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    return new THREE.Mesh(geometry, material);
}

export function getLogo(texture) {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    return new THREE.Mesh(geometry, material);
}

export function getFloor(texture) {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    material.map.wrapS = THREE.RepeatWrapping;
    material.map.wrapT = THREE.RepeatWrapping;
    material.map.anisotropy = 4;
    material.map.repeat.set(4, 4);
    return new THREE.Mesh(geometry, material);
}
