import * as THREE from 'three';

import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

let camera, scene, renderer;

const frustumSize = 500;
const CAMERA_DISTANCE = 100;

window.onload = function() {
  console.log('onload')

  init();
  animate();

}

function init() {

  const aspect = window.innerWidth / window.innerHeight;

  camera = new THREE.PerspectiveCamera( 60, aspect, 1, 1000 );
  
  camera.position.set( - 200, 200, 200 );
  camera.target = new THREE.Vector3( 0, 0, 0 )

  scene = new THREE.Scene();

  // left
  const leftPlane = createPlane(
    100, 100,
    'chocolate',
    new THREE.Vector3( - 50, 0, 0 ),
    new THREE.Euler( 0, - 90 * THREE.MathUtils.DEG2RAD, 0 )
  );
  // front
  const frontPlane = createPlane(
    100, 100,
    'blue',
    new THREE.Vector3( 0, 0, 50 ),
    new THREE.Euler( 0, 0, 0 )
  );
  // top
  const topPlane = createPlane(
    100, 100,
    'yellowgreen',
    new THREE.Vector3( 0, 50, 0 ),
    new THREE.Euler( - 90 * THREE.MathUtils.DEG2RAD, 0, 0 )
  );
  // bottom
  const bottomPlane = createPlane(
    300, 300,
    'seagreen',
    new THREE.Vector3( 0, - 50, 0 ),
    new THREE.Euler( - 90 * THREE.MathUtils.DEG2RAD, 0, 0 )
  );

  //

  renderer = new CSS3DRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = 20;
  document.body.appendChild( renderer.domElement );


  document.getElementById('focusLeftButton').onclick = function() {
    focusCamera(leftPlane)
  }

  document.getElementById('focusFrontButton').onclick = function() {
    focusCamera(frontPlane)
  }

  document.getElementById('focusTopButton').onclick = function() {
    focusCamera(topPlane)
  }

  document.getElementById('focusBottomButton').onclick = function() {
    focusCamera(bottomPlane)
  }

  function createPlane( width, height, cssColor, pos, rot ) {

    const element = document.createElement( 'div' );
    element.style.width = width + 'px';
    element.style.height = height + 'px';
    element.style.opacity = 0.75;
    element.style.background = cssColor;

    element.innerHTML = 'HELLO'

    const button = document.createElement( 'button' );
    button.innerHTML = 'BUTTON'

    element.appendChild(button)

    const object = new CSS3DObject( element );
    object.position.copy( pos );
    object.rotation.copy( rot );
    scene.add( object );

    const buttonObject = new CSS3DObject( button )
    buttonObject.position.copy(new THREE.Vector3(0, 0, 5 ))
    object.add(buttonObject)

    return buttonObject

  }

  function focusCamera(targetObject) {
  
    const targetObjectPosition = new THREE.Vector3(0,0,0)
    const targetObjectRotationQuaternion = new THREE.Quaternion()
    targetObject.getWorldPosition(targetObjectPosition)
    targetObject.getWorldQuaternion(targetObjectRotationQuaternion)
    
    const normal = new THREE.Vector3(0,0,CAMERA_DISTANCE).applyQuaternion(targetObjectRotationQuaternion)

    const toCameraPosition = targetObjectPosition.clone().add(normal)
    const toCameraRotation = new THREE.Euler().setFromQuaternion( targetObjectRotationQuaternion, 'XYZ' )
    const toCameraTargetPosition = targetObjectPosition

    new TWEEN.Tween( camera.position )
        .to( {
            x: toCameraPosition.x,
            y: toCameraPosition.y,
            z: toCameraPosition.z
        }, 3000 )
        .easing( TWEEN.Easing.Linear.None ).onUpdate( function () {

            camera.lookAt( camera.target );

        } )
        .onComplete( function () {

            // camera.lookAt( target );
            // controls.enabled = true;
            
        } )
        .start();



        new TWEEN.Tween( camera.rotation )
        .to(
          // rotation
          {
            x: toCameraRotation.x,
            y: toCameraRotation.y,
            z: toCameraRotation.z,
        }
        , 3000 )
        .easing( TWEEN.Easing.Linear.None ).onUpdate( function () {
          
        } )
        .onComplete( function () {

            // camera.lookAt( target );
            // controls.enabled = true;
        } )
        .start();

    new TWEEN.Tween( camera.target )
        .to( {
            x: toCameraTargetPosition.x,
            y: toCameraTargetPosition.y,
            z: toCameraTargetPosition.z
        } , 3000)
        .easing( TWEEN.Easing.Linear.None )
        .onUpdate( function () {

        } )
        .onComplete( function () {

            // camera.lookAt( target );
            camera.rotation.set(toCameraRotation)

        } )
        .start();

      window.addEventListener( 'resize', onWindowResize );

    }
  }



function onWindowResize() {

  const aspect = window.innerWidth / window.innerHeight;

  camera.left = - frustumSize * aspect / 2;
  camera.right = frustumSize * aspect / 2;
  camera.top = frustumSize / 2;
  camera.bottom = - frustumSize / 2;

  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  requestAnimationFrame( animate );
  
  TWEEN.update()

  renderer.render( scene, camera );


}