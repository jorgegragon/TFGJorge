import * as THREE from 'three';

export function getSphere() {
    var geometry = new THREE.SphereGeometry(0.075, 4.8, 3);
    var material = new THREE.MeshBasicMaterial({color: "red"});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = 0.5;
    mesh.castShadow = true;
    mesh.name = "sphere";
    return mesh;
}

export function getSide(texture) {
    //var geometry = new THREE.BoxGeometry(0.2, 10, 8);
    var geometry = new THREE.BoxGeometry(3, 100, 25);
    var material = new THREE.MeshBasicMaterial({ map: texture });
    material.map.wrapS = THREE.RepeatWrapping;
    material.map.wrapT = THREE.RepeatWrapping;
    material.map.anisotropy = 1;
    material.map.repeat.set(4, 8);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = 2;
    return mesh;
}

export function getBox(texture) {
    //var geometry = new THREE.BoxGeometry(0.45, 0.3, 0.6);
    var geometry = new THREE.BoxGeometry(3, 2, 4);
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = 2;
    return mesh;
}

export function getWall(texture) {
    //var geometry = new THREE.PlaneGeometry(5, 5);
    var geometry = new THREE.PlaneGeometry(20, 20);
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

export function getFloor(texture) {
    var geometry = new THREE.PlaneGeometry(100, 100);
    var material = new THREE.MeshBasicMaterial({ map: texture });
    material.map.wrapS = THREE.RepeatWrapping;
    material.map.wrapT = THREE.RepeatWrapping;
    material.map.anisotropy = 4;
    material.map.repeat.set(4, 4);
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
}
