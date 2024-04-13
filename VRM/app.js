import * as THREE from '../jsm/build/three.module.js';
import { VRButton } from '../jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from '../jsm/webxr/XRControllerModelFactory.js';
import { Stats } from '../jsm/libs/stats.module.js';
import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { getSphere, getSide, getBox, getWall, getLogo, getFloor } from './js/sceneObjets.js';

const texture = new THREE.TextureLoader().load( '../Imagenes/textures/crate.gif' );
const suelo = new THREE.TextureLoader().load( '../Imagenes/textures/sueloblanco.jpg' );
const muro = new THREE.TextureLoader().load( '../Imagenes/textures/extura.jpg' );
const logoStart = new THREE.TextureLoader().load( '../Imagenes/parametros/start.png' );
const logoStop = new THREE.TextureLoader().load( '../Imagenes/parametros/stop.png' );

const pared = new THREE.TextureLoader().load( '../Imagenes/parametros/secuencia.png' );
const att_ua1= new THREE.TextureLoader().load( '../Imagenes/parametros/attua1.png' );
const att_ua2 = new THREE.TextureLoader().load( '../Imagenes/parametros/attua2.png' );
const att_proxy = new THREE.TextureLoader().load( '../Imagenes/parametros/attproxy.png' );

const register_ua1 = new THREE.TextureLoader().load( '../Imagenes/paquetes/Register1.png' );
const register_ua2 = new THREE.TextureLoader().load( '../Imagenes/paquetes/Register2.png' );
const unauthorized = new THREE.TextureLoader().load( '../Imagenes/paquetes/401unauthorized.png' );
const ok_proxy_reg_ua1 = new THREE.TextureLoader().load( '../Imagenes/paquetes/200okproxyua1.png' );
const ok_proxy_reg_ua2 = new THREE.TextureLoader().load( '../Imagenes/paquetes/200okproxyua2.png' );
const invite_ua1 = new THREE.TextureLoader().load( '../Imagenes/paquetes/invite+sdpua1.png' );
const invite_ua2 = new THREE.TextureLoader().load( '../Imagenes/paquetes/invite+sdpua2.png' );
const trying_ua1 = new THREE.TextureLoader().load( '../Imagenes/paquetes/tryingua1.png' );
const trying_ua2 = new THREE.TextureLoader().load( '../Imagenes/paquetes/tryingua2.png' );
const ringing_ua1 = new THREE.TextureLoader().load( '../Imagenes/paquetes/ringingua1.png' );
const ringing_ua2 = new THREE.TextureLoader().load( '../Imagenes/paquetes/ringingua2.png' );
const ok_status_ua1 = new THREE.TextureLoader().load( '../Imagenes/paquetes/200okua1.png' );
const ok_status_ua2 = new THREE.TextureLoader().load( '../Imagenes/paquetes/200okua2.png' );
const ack_ua1 = new THREE.TextureLoader().load( '../Imagenes/paquetes/ackua1.png' );
const ack_ua2 = new THREE.TextureLoader().load( '../Imagenes/paquetes/ackua2.png' );
const rtp = new THREE.TextureLoader().load( '../Imagenes/paquetes/rtp.png' );
const bye_ua1 = new THREE.TextureLoader().load( '../Imagenes/paquetes/byeua1.png' );
const bye_ua2 = new THREE.TextureLoader().load( '../Imagenes/paquetes/byeua2.png' );
const ok_bye_ua1 = new THREE.TextureLoader().load( '../Imagenes/paquetes/200okbyeua1.png' );
const ok_bye_ua2 = new THREE.TextureLoader().load( '../Imagenes/paquetes/200okbyeua2.png' );


// Secuencia
let start = false;
let estado;
let resultado = "Inicio";
let contador = 0;
let stepX = 0.08;
let stepZ = -0.16;

let handleControllerTimeout = null;

let wall1;
let wallLogo;
let sphere;
let box;
let box1;
let box2;
let side1;
let side2;
let side3;
let side4;

class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
        this.clock = new THREE.Clock();
        
		this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 200 );
		this.camera.position.set(0, 1.6, 0);
        
		this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x5E7E9F );

		this.scene.add( new THREE.HemisphereLight( 0xffffff, 0x404040 ) );

        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
		this.scene.add( light );
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
		container.appendChild( this.renderer.domElement );
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set(0, 1.6, 0);
        this.controls.update();
        
        this.stats = new Stats();
        document.body.appendChild( this.stats.dom );

        document.body.appendChild(VRButton.createButton(this.renderer));
        
        this.raycaster = new THREE.Raycaster();
        this.workingMatrix = new THREE.Matrix4();
        this.workingVector = new THREE.Vector3();
        this.origin = new THREE.Vector3();
        
        this.initScene();
        this.setupXR();
        
        window.addEventListener('resize', this.resize.bind(this) );
        
        this.renderer.setAnimationLoop( this.render.bind(this) );
	}	
    
    random( min, max ){
        return Math.random() * (max-min) + min;
    }
    
    initScene(){

		this.scene.background = new THREE.Color( 0x5E7E9F );
		this.scene.fog = new THREE.Fog( 0x5E7E9F, 50, 100 );

        // Objetos Escena
        const floor = getFloor(suelo);
        floor.rotateX( Math.PI / -2 );
        floor.name = "suelo";
        this.scene.add( floor );
        // Pared
        wall1 = getWall(pared);
        wall1.position.set( 0, 4, -4.5);
        this.scene.add( wall1 );

        wallLogo = getLogo(logoStart);
        wallLogo.position.set( 0, 1, -4.5);
        wallLogo.name = "estadoInicio";
        this.scene.add( wallLogo );

        side1 = getSide(muro);
        side1.position.set (5, 4, 0);
        side1.rotateX (Math.PI / 2);
        this.scene.add( side1 );

        side2 = getSide(muro);
        side2.position.set (-5, 4, 0);
        side2.rotateX (Math.PI / 2);
        this.scene.add( side2 );

        side3 = getSide(muro);
        side3.position.set (0, 4, -5);
        side3.rotateY (Math.PI / 2);
        side3.rotateX (Math.PI / 2);
        this.scene.add( side3 );

        side4 = getSide(muro);
        side4.position.set (0, 4, 5);
        side4.rotateY (Math.PI / 2);
        side4.rotateX (Math.PI / 2);
        this.scene.add( side4 );

        box = getBox(texture);
        box.position.set (0, 0.3, -1);
        box.rotateX (Math.PI / 2);
        box.name = "proxy";
        this.scene.add( box );

        box1 = getBox(texture);
        box1.position.set (-1, 0.3, 1);
        box1.rotateX (Math.PI / 2);
        box1.name = "UA1";
        this.scene.add( box1 );

        box2 = getBox(texture);
        box2.position.set (1, 0.3, 1);
        box2.rotateX (Math.PI / 2);
        box2.name = "UA2";
        this.scene.add( box2 );

        sphere = getSphere();
        sphere.position.set (-1, 0.3, 1);
        sphere.rotateX (Math.PI/2);
        sphere.rotateY (Math.PI/-2);
        sphere.name = "sphere";
        this.scene.add(sphere);
        
        this.dolly = new THREE.Object3D();
        this.dolly.position.z = 5;
        this.dolly.add (this.camera);
        this.scene.add (this.dolly);

        this.dummyCam = new THREE.Object3D();
        this.camera.add (this.dummyCam);
        
    } 
    
    setupXR(){
        this.renderer.xr.enabled = true;
        
        const self = this;
        
        function onSelectStart() {
            
            this.userData.selectPressed = true;
            this.userData.isSelecting = true;
            console.log ("PASAMOS");
        }

        function onSelectEnd() {

            this.userData.selectPressed = false;
            this.userData.isSelecting = false;
        }

        // LINEAS "GUIA" CONTROLADORES
        const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)]);

        const line = new THREE.Line(geometry);
        line.name = 'line';
        line.scale.z = 5;
        
        // Controlador Izquierdo
        this.controllerLeft = this.renderer.xr.getController( 0 );
        this.controllerLeft.add(line.clone());
        
        this.dolly.add( this.controllerLeft );
        this.controllerLeft.addEventListener( 'selectstart', onSelectStart );
        this.controllerLeft.addEventListener( 'selectend', onSelectEnd );
        this.controllerLeft.addEventListener( 'connected', function ( event ) {

            const mesh = self.buildController.call(self, event.data );
            mesh.scale.z = 0;
            this.add( mesh );

        } );
        this.controllerLeft.addEventListener( 'disconnected', function () {

            this.remove( this.children[ 0 ] );
            self.controllerLeft = null;
            self.controllerLeftGrip = null;

        } );
        this.scene.add(this.controllerLeft);

        const controllerModelFactory = new XRControllerModelFactory();

        this.controllerLeftGrip = this.renderer.xr.getControllerGrip( 0 );
        this.controllerLeftGrip.add( controllerModelFactory.createControllerModel( this.controllerLeftGrip ) );
        this.dolly.add( this.controllerLeftGrip );
        this.scene.add( this.controllerLeftGrip );

        // Controlador Derecho
        this.controllerRight = this.renderer.xr.getController( 1 );
        this.controllerRight.add(line.clone());
        this.controllerRight.position.set(0.5, 1.5, 3);
        
        this.dolly.add( this.controllerRight );
        this.controllerRight.addEventListener( 'selectstart', onSelectStart );
        this.controllerRight.addEventListener( 'selectend', onSelectEnd );
        this.controllerRight.addEventListener( 'connected', function ( event ) {

            const mesh = self.buildController.call(self, event.data );
            mesh.scale.z = 0;
            this.add( mesh );

        } );
        this.controllerRight.addEventListener( 'disconnected', function () {

            this.remove( this.children[ 0 ] );
            self.controllerRight = null;
            self.controllerRightGrip = null;

        } );
        this.scene.add( this.controllerRight );

        this.controllerRightGrip = this.renderer.xr.getControllerGrip( 1 );
        this.controllerRightGrip.add( controllerModelFactory.createControllerModel( this.controllerRightGrip ) );
        this.dolly.add( this.controllerRightGrip );
        this.scene.add( this.controllerRightGrip );

    }
    
    buildController( data ) {
        let geometry;
        let material;
        
        switch ( data.targetRayMode ) {
            
            case 'tracked-pointer':

                geometry = new THREE.BufferGeometry();
                geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
                geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );

                material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );

                return new THREE.Line( geometry, material );

            case 'gaze':

                geometry = new THREE.RingBufferGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
                material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
                return new THREE.Mesh( geometry, material );

        }

    }

    handleController( controllerLeft, controllerRight, dt ){
        if (controllerLeft.userData.selectPressed ){
            const speed = 1;
            const quaternion = this.dolly.quaternion.clone();
            const globalQuaternion = new THREE.Quaternion(); 
            this.dummyCam.getWorldQuaternion(globalQuaternion); // Obtiene la orientación global de dummyCam
            this.dolly.quaternion.copy(globalQuaternion);
            this.dolly.translateZ(-dt*speed);
            this.dolly.position.y = 0;
            this.dolly.quaternion.copy(quaternion);
        }
        console.log (controllerRight.userData.isSelecting);
        if (controllerRight.userData.isSelecting ){
            this.raycaster.ray.origin.setFromMatrixPosition(controllerRight.matrixWorld);
        
            const controllerRightDirection = new THREE.Vector3();
            controllerRight.getWorldDirection(controllerRightDirection);
            const invertedDirection = controllerRightDirection.clone().multiplyScalar(-1);
            this.raycaster.ray.direction.copy(invertedDirection);
        
            const intersects = this.raycaster.intersectObject(this.scene);
        
            for (const intersect of intersects) {
                switch (intersect.object.name) {
                    case "UA1":
                        if (intersect.object.material.color.getHex() === 0xff0000) {
                            intersect.object.material.color.set(0xffffff);
                            wall1.material.map = pared;
                        } else {
                            intersect.object.material.color.set(0xff0000);
                            box.material.color.set(0xffffff);
                            box2.material.color.set(0xffffff);
                            wall1.material.map = att_ua1;
                        }
                        wallLogo.material.map = logoStart;
                        start = false;
                        break;
                    case "UA2":
                        if (intersect.object.material.color.getHex() === 0xff0000) {
                            intersect.object.material.color.set(0xffffff);
                            wall1.material.map = pared;
                        } else {
                            intersect.object.material.color.set(0xff0000);
                            box.material.color.set(0xffffff);
                            box1.material.color.set(0xffffff);
                            wall1.material.map = att_ua2;
                        }
                        start = false;
                        wallLogo.material.map = logoStart;
                        break;
                    case "proxy":
                        if (intersect.object.material.color.getHex() === 0xff0000) {
                            intersect.object.material.color.set(0xffffff);
                            wall1.material.map = pared;
                        } else {
                            intersect.object.material.color.set(0xff0000);
                            box1.material.color.set(0xffffff);
                            box2.material.color.set(0xffffff);
                            wall1.material.map = att_proxy;
                        }
                        start = false;
                        wallLogo.material.map = logoStart;
                        break;
                    case "estadoInicio":
                        if (contador == 0 && wallLogo.material.map === logoStart) {
                            start = true;
                            wallLogo.material.map = logoStop;
                            sphere.geometry = new THREE.SphereGeometry(0.075, 4.8, 3, 0, Math.PI*2, 0, Math.PI);                       
                            resultado = "Register";      
                            estado = "Register UA1"; 
                        }else if (contador != 0 && wallLogo.material.map === logoStart){
                            start = true;
                            wallLogo.material.map = logoStop;
                        }else{
                            start = false;
                            wallLogo.material.map = logoStart;
                        }
                        wall1.material.map = pared;
                        box.material.color.set(0xffffff);
                        box1.material.color.set(0xffffff);
                        box2.material.color.set(0xffffff);
                        break;
                    case "sphere":
                        intersect.object.geometry = new THREE.SphereGeometry(0.075, 4.8, 3, 0, 5.8, 0, Math.PI);
                        start = false;
                        wallLogo.material.map = logoStart;
                        switch (estado) {
                            case "Register UA1":
                                wall1.material.map = register_ua1;
                                break;
                            case "Register UA2":
                                wall1.material.map = register_ua2;
                                break;
                            case "Unauthorized":
                                wall1.material.map = unauthorized;
                                break;
                            case "200 OK Register UA1":
                                wall1.material.map = ok_proxy_reg_ua1;
                                break;
                            case "OK Register Proxy-UA2":
                                wall1.material.map = ok_proxy_reg_ua2;
                                break;
                            case "INVITE UA1":
                                wall1.material.map = invite_ua1;
                                break;
                            case "INVITE Proxy-UA2":
                                wall1.material.map = invite_ua2;
                                break;
                            case "Trying UA1":
                                wall1.material.map = trying_ua1;
                                break;
                            case "Trying UA2":
                                wall1.material.map = trying_ua2;
                                break;
                            case "Ringing UA1":
                                wall1.material.map = ringing_ua1;
                                break;
                            case "Ringing UA2":
                                wall1.material.map = ringing_ua2;
                                break;
                            case "OK STATUS UA1":
                                wall1.material.map = ok_status_ua1;
                                break;
                            case "OK STATUS UA2":
                                wall1.material.map = ok_status_ua2;
                                break;
                            case "ACK UA1":
                                wall1.material.map = ack_ua1;
                                break;
                            case "ACK UA2":
                                wall1.material.map = ack_ua2;
                                break;
                            case "RTP":
                                wall1.material.map = rtp;
                                break;
                            case "BYE UA1":
                                wall1.material.map = bye_ua1;
                                break;
                            case "BYE UA2":
                                wall1.material.map = bye_ua2;
                                break;
                            case "OK BYE UA1":
                                wall1.material.map = ok_bye_ua1;
                                break;
                            case "OK BYE UA2":
                                wall1.material.map = ok_bye_ua2;
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render( ) {  
        const dt = this.clock.getDelta();
        this.stats.update();
        if (this.controllerLeft || this.controllerRight) {
            this.handleController(this.controllerLeft, this.controllerRight, dt);
            //this.controllerRight.addEventListener('selectstart', () => {
            //    this.handleControllerRight(this.controllerRight);
            //});
        }
        if (start){
            this.animacion(sphere);
        }
        this.renderer.render( this.scene, this.camera );
    }

    animacion(sphere){
        if (sphere.position.z < -1){ // Proxy
            if (contador == 0 || contador == 2 || contador == 10 || contador == 19){
                sphere.position.set (0, 0.3, -1);
                stepX = -0.025;
                stepZ = 0.05;
                switch (contador) {
                    case 0:
                        resultado = ("401 Unauthorized");
                        estado = ("Unauthorized");
                        sphere.material.color = new THREE.Color("red");
                        break;
                    case 2:
                        resultado = ("200 OK");
                        estado = ("200 OK Register UA1");
                        break;
                    case 10:
                        resultado = ("100 Trying");
                        estado = ("Trying UA1");
                        sphere.material.color = new THREE.Color("green");
                        break;
                    case 19:
                        resultado = ("200 OK");
                        sphere.material.color = new THREE.Color("maroon");
                        estado = ("OK BYE UA1");
                        break;
                    default:
                        break;
                }
                
            }else if (contador == 4 || contador == 6 || contador == 14 || contador == 17) {
                sphere.position.set (0, 0.3, -1);
                stepX = 0.025;
                stepZ = 0.05;
                switch (contador) {
                    case 4:
                        resultado = ("200 OK");
                        estado = ("OK Register Proxy-UA2");
                        sphere.material.color = new THREE.Color("red");
                        break;
                    case 6:
                        resultado = ("INVITE + SDP");
                        estado = ("INVITE Proxy-UA2");
                        sphere.material.color = new THREE.Color("green");   
                        break;
                    case 14:
                        resultado = ("ACK");
                        estado = ("ACK UA2");
                        sphere.material.color = new THREE.Color("green");
                        break;
                    case 17:
                        resultado = ("BYE");
                        estado = ("BYE UA2");
                        sphere.material.color = new THREE.Color("maroon");
                        break;
                    default:
                        break;
                }
            }else if (contador == 8 || contador == 9) {
                sphere.position.set (1, 0.3, 1);
                stepX = -0.025;
                stepZ = -0.05;
                sphere.material.color = new THREE.Color("green");
                if (contador == 8) {
                    resultado = ("180 Ringing");
                    estado = ("Ringing UA2");
                }else{
                    resultado = ("200 OK + SDP");
                    estado = ("OK STATUS UA2");
                }
            }
            contador++;
        }

        if (sphere.position.z > 1 & sphere.position.x < -0.5){ // Cliente
            if (contador == 3){
                sphere.position.set (1, 0.3, 1);
                stepX = -0.025;
                stepZ = -0.05;
                resultado = ("Register");
                estado = ("Register UA2");
                sphere.material.color = new THREE.Color("red");
                
            }else if (contador == 11 || contador == 12) {
                sphere.position.set (0, 0.3, -1);
                stepX = -0.025;
                stepZ = 0.05;
                if (contador == 11) {
                    resultado = ("180 Ringing");
                    estado = ("Ringing UA1");
                }else{
                    resultado = ("200 OK + SDP");
                    estado = ("OK STATUS UA1");
                }
                sphere.material.color = new THREE.Color("green");

            }else if (contador == 20) {
                contador = 0;
                start = false;
                resultado = ("Intercambio de paquetes");
                sphere.material.color = new THREE.Color("red");
                wallLogo.material.map = logoStart;

            }else{
                sphere.position.set (-1, 0.3, 1);
                stepX = 0.025;
                stepZ = -0.05;
                
                if (contador == 1) {
                    resultado = ("Register");
                    estado = ("Register UA1");
                    sphere.material.color = new THREE.Color("red");
                }else if (contador == 13) {
                    resultado = ("ACK");
                    estado = ("ACK UA1");
                    sphere.material.color = new THREE.Color("green");
                }
            }
            contador++;
        }

        if (sphere.position.z > 1 & sphere.position.x > 0.5){ // Servidor
            if (contador == 7 || contador == 18) { // Servidor-Proxy
                stepX = -0.025;
                stepZ = -0.05;
                sphere.position.set (1, 0.3, 1);
                if (contador == 7) {
                    resultado = ("100 Trying");
                    estado = ("Trying UA2");
                    sphere.material.color = new THREE.Color("green");
                }else{
                    resultado = ("200 OK");
                    estado = ("OK BYE UA2");
                    sphere.material.color = new THREE.Color("maroon");
                }

            } else if (contador == 5) { // Cliente-Servidor
                stepX = 0.025;
                stepZ = -0.05;
                sphere.position.set (-1, 0.3, 1);
                resultado = ("INVITE + SDP");
                estado = ("INVITE UA1");
                sphere.material.color = new THREE.Color("green");
                
            } else if (contador == 15) {
                sphere.position.set (1, 0.3, 1);
                stepX = -0.0125;
                stepZ = 0;
                resultado = ("RTP");
                estado = ("RTP");
                sphere.material.color = new THREE.Color("blue");    
            }
            contador++;   
        }

        if (sphere.position.x < -1 && contador == 16){
            stepX = 0.025;
            stepZ = -0.05;
            sphere.position.set (-1, 0.3, 1);
            resultado = ("BYE");
            estado = ("BYE UA1");
            sphere.material.color = new THREE.Color("maroon");
            contador++;
        }
        sphere.position.x += stepX;
        sphere.position.z += stepZ;
    }
}

export { App };