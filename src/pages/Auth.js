import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three';
import '../styles/loader.css';

function Auth(props) {
    const refContainer = useRef(null);
    const register = ()=>{
        let id = document.querySelector("input[name='uname']").value;
        props.reqid(id);
    };
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(115, window.innerWidth / window.innerHeight, 0.5, 100);

        let canv = document.querySelector(".loader");
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(canv.offsetWidth, canv.offsetHeight);
        canv.appendChild(renderer.domElement);

        const geometry = new THREE.TorusGeometry(3, 0.15);
        const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
        const cube1 = new THREE.Mesh(geometry, material);
        const cube2 = new THREE.Mesh(geometry, material);

        cube2.rotation.x += 80; cube2.scale.x = 1.3; cube2.scale.y = 1.3;
        const cube3 = new THREE.Mesh(geometry, material);
        cube3.rotation.z += 80; cube3.scale.x = 1.5; cube3.scale.y = 1.5;
        var dlight = new THREE.AmbientLight(0xffffff, 5);
        /* 
        dlight.position.set(0.25,0.25,0.5);
        dlight.target.position.set(1,1,1); */
        scene.background = new THREE.Color(0x272727);
        scene.add(cube1); scene.add(cube2);
        scene.add(cube3); scene.add(dlight);
        camera.position.z = 7;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        function animate() {

                requestAnimationFrame(animate);

                cube1.rotation.z += 0.05;
                /* cube2.rotation.x -= 0.045; */
                cube2.rotation.x -= 0.05;
                cube3.rotation.y += 0.05;
                /* cube3.rotation.x -= 0.045 */;
                /*   camera.fov--; */
                // camera.updateProjectionMatrix();
                renderer.render(scene, camera);

        }

        animate();
    }, []);
    return (
        <>
            <div ref={refContainer} className='loader' />
            <fieldset className='userform'>
                <input placeholder= "Username " type="text" name='uname'></input>
                <input placeholder= "Email id " type="text" name='umail'></input>
                <button onClick={register}>Submit</button>
            </fieldset>
        </>
    )
}

export default Auth;