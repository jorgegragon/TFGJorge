import * as THREE from '../jsm/build/three.module.js';
import { VRButton } from '../jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from '../jsm/webxr/XRControllerModelFactory.js';
import { Stats } from '../jsm/libs/stats.module.js';
import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { getSphere, getSide, getBox, getWall, getFloor } from './js/sceneObjets.js';

const texture = new THREE.TextureLoader().load( '../Imagenes/textures/crate.gif' );
const suelo = new THREE.TextureLoader().load( '../Imagenes/textures/sueloblanco.jpg' );
const muro = new THREE.TextureLoader().load( '../Imagenes/textures/extura.jpg' );
const pared = new THREE.TextureLoader().load( '../Imagenes/parametros/secuencia.png' );

let wall1;
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
        }

        function onSelectEnd() {

            this.userData.selectPressed = false;
            
        }
        
        // Controlador Izquierdo
        this.controllerLeft = this.renderer.xr.getController( 0 );
        
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

        this.scene.add( this.controllerLeft );

        const controllerModelFactory = new XRControllerModelFactory();

        this.controllerLeftGrip = this.renderer.xr.getControllerGrip( 0 );
        this.controllerLeftGrip.add( controllerModelFactory.createControllerModel( this.controllerLeftGrip ) );
        this.scene.add( this.controllerLeftGrip );

        // Controlador Derecho
        this.controllerRight = this.renderer.xr.getController( 1 );
        
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

        this.controllerRightGrip = this.renderer.xr.getControllerGrip( 0 );
        this.controllerRightGrip.add( controllerModelFactory.createControllerModel( this.controllerRightGrip ) );
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
    
    handleController( controller, dt ){
        if (controller.userData.selectPressed ){
            const speed = 0.5;
            const quaternion = this.dolly.quaternion.clone();
            const globalQuaternion = new THREE.Quaternion(); 
            this.dummyCam.getWorldQuaternion(globalQuaternion); // Obtiene la orientación global de dummyCam
            this.dolly.quaternion.copy(globalQuaternion);
            this.dolly.translateZ(-dt*speed);
            this.dolly.position.y = 0;
            this.dolly.quaternion.copy(quaternion);
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
        if (this.controllerLeft) {
            this.handleController(this.controllerLeft, dt);
        }
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };