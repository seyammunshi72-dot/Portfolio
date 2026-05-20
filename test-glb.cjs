import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const fileData = fs.readFileSync('public/ibm_5150.glb');
// We need global window or similar for loaders in node? GLTFLoader might not work out of the box in Node without polyfills.
