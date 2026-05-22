import { Document, NodeIO } from '@gltf-transform/core';

async function verify() {
  const io = new NodeIO();
  const document = await io.read('public/ibm_5150.glb');
  const nodes = document.getRoot().listNodes();
  for (const node of nodes) {
    if (node.getName().includes('Pantalla')) {
      console.log('Found screen mesh:', node.getName());
    }
  }
}

verify();
