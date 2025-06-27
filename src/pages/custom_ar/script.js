let currentGlbUrl = null;
const LOCAL_STORAGE_KEY = 'custom_ar/savedModel';

function imageToGlb(imageDataUrl, width, height) {
  const aspectRatio = width / height;
  const planeWidth = aspectRatio > 1 ? 1 : aspectRatio;
  const planeHeight = aspectRatio > 1 ? 1 / aspectRatio : 1;
  
  const positions = new Float32Array([
    -planeWidth/2, -planeHeight/2, 0,
     planeWidth/2, -planeHeight/2, 0,
     planeWidth/2,  planeHeight/2, 0,
    -planeWidth/2,  planeHeight/2, 0
  ]);
  
  const normals = new Float32Array([
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1
  ]);
  
  const texcoords = new Float32Array([
    0, 1,
    1, 1,
    1, 0,
    0, 0
  ]);
  
  const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);
  
  const positionBuffer = positions.buffer;
  const normalBuffer = normals.buffer;
  const texcoordBuffer = texcoords.buffer;
  const indexBuffer = indices.buffer;
  
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  return new Promise((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        const blobReader = new FileReader();
        blobReader.onload = () => {
          const imageBuffer = blobReader.result;
          
          const buffers = [
            positionBuffer,
            normalBuffer,
            texcoordBuffer,
            indexBuffer,
            imageBuffer
          ];
          
          let totalByteLength = 0;
          buffers.forEach(buffer => {
            totalByteLength += buffer.byteLength;
            totalByteLength += totalByteLength % 4 ? 4 - totalByteLength % 4 : 0;
          });
          
          const gltf = {
            asset: { version: "2.0" },
            scene: 0,
            scenes: [{ nodes: [0] }],
            nodes: [{ mesh: 0 }],
            meshes: [{
              primitives: [{
                attributes: {
                  POSITION: 0,
                  NORMAL: 1,
                  TEXCOORD_0: 2
                },
                indices: 3,
                material: 0
              }]
            }],
            materials: [{
              pbrMetallicRoughness: {
                baseColorTexture: { index: 0 },
                metallicFactor: 0,
                roughnessFactor: 1
              },
              alphaMode: "BLEND",
              doubleSided: true
            }],
            textures: [{ source: 0 }],
            images: [{
              bufferView: 4,
              mimeType: "image/png"
            }],
            bufferViews: [
              {
                buffer: 0,
                byteOffset: 0,
                byteLength: positionBuffer.byteLength,
                target: 34962
              },
              {
                buffer: 0,
                byteOffset: positionBuffer.byteLength,
                byteLength: normalBuffer.byteLength,
                target: 34962
              },
              {
                buffer: 0,
                byteOffset: positionBuffer.byteLength + normalBuffer.byteLength,
                byteLength: texcoordBuffer.byteLength,
                target: 34962
              },
              {
                buffer: 0,
                byteOffset: positionBuffer.byteLength + normalBuffer.byteLength + texcoordBuffer.byteLength,
                byteLength: indexBuffer.byteLength,
                target: 34963
              },
              {
                buffer: 0,
                byteOffset: positionBuffer.byteLength + normalBuffer.byteLength + texcoordBuffer.byteLength + indexBuffer.byteLength,
                byteLength: imageBuffer.byteLength
              }
            ],
            accessors: [
              {
                bufferView: 0,
                byteOffset: 0,
                componentType: 5126,
                count: 4,
                type: "VEC3",
                min: [-planeWidth/2, -planeHeight/2, 0],
                max: [planeWidth/2, planeHeight/2, 0]
              },
              {
                bufferView: 1,
                byteOffset: 0,
                componentType: 5126,
                count: 4,
                type: "VEC3"
              },
              {
                bufferView: 2,
                byteOffset: 0,
                componentType: 5126,
                count: 4,
                type: "VEC2"
              },
              {
                bufferView: 3,
                byteOffset: 0,
                componentType: 5123,
                count: 6,
                type: "SCALAR"
              }
            ],
            buffers: [{
              byteLength: totalByteLength
            }]
          };
          
          const gltfString = JSON.stringify(gltf);
          let gltfBuffer = new TextEncoder().encode(gltfString);
          
          const padding = (4 - (gltfBuffer.byteLength % 4)) % 4;
          if (padding > 0) {
            const paddedBuffer = new Uint8Array(gltfBuffer.byteLength + padding);
            paddedBuffer.set(gltfBuffer);
            for (let i = 0; i < padding; i++) {
              paddedBuffer[gltfBuffer.byteLength + i] = 0x20;
            }
            gltfBuffer = paddedBuffer;
          }
          
          const glbByteLength = 12 + 8 + gltfBuffer.byteLength + 8 + totalByteLength;
          const glb = new ArrayBuffer(glbByteLength);
          const view = new DataView(glb);
          
          view.setUint32(0, 0x46546C67, true);
          view.setUint32(4, 2, true);
          view.setUint32(8, glbByteLength, true);
          
          view.setUint32(12, gltfBuffer.byteLength, true);
          view.setUint32(16, 0x4E4F534A, true);
          
          let offset = 20;
          new Uint8Array(glb).set(new Uint8Array(gltfBuffer), offset);
          offset += gltfBuffer.byteLength;
          
          view.setUint32(offset, totalByteLength, true);
          view.setUint32(offset + 4, 0x004E4942, true);
          offset += 8;
          
          buffers.forEach(buffer => {
            new Uint8Array(glb).set(new Uint8Array(buffer), offset);
            offset += buffer.byteLength;
            while (offset % 4 !== 0) {
              view.setUint8(offset, 0);
              offset++;
            }
          });
          
          const glbBlob = new Blob([glb], { type: 'model/gltf-binary' });
          const glbUrl = URL.createObjectURL(glbBlob);
          
          // Convert blob to base64 for localStorage
          const storageReader = new FileReader();
          storageReader.onloadend = () => {
            const base64data = storageReader.result;
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, base64data);
            } catch (e) {
              console.warn('Failed to save model to localStorage:', e);
            }
          };
          storageReader.readAsDataURL(glbBlob);
          
          resolve(glbUrl);
        };
        blobReader.readAsArrayBuffer(blob);
      }, 'image/png');
    };
    img.src = imageDataUrl;
  });
}

function handleFileUpload(event) {
  if (!event.target.files || !event.target.files[0]) return;

  const file = event.target.files[0];
  const reader = new FileReader();
  const uploadContainer = document.getElementById('upload-container');
  const viewerContainer = document.getElementById('viewer-container');
  const modelViewer = document.getElementById('model-viewer');
  
  uploadContainer.innerHTML = '<div class="loading"></div>';
  
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      imageToGlb(e.target.result, img.width, img.height).then((glbUrl) => {
        if (currentGlbUrl) {
          URL.revokeObjectURL(currentGlbUrl);
        }
        currentGlbUrl = glbUrl;
        
        modelViewer.src = glbUrl;
        uploadContainer.style.display = 'none';
        viewerContainer.style.display = 'block';
      });
    };
    img.src = e.target.result;
  };
  
  reader.readAsDataURL(file);
}

function loadSavedModel() {
  try {
    const savedModel = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedModel) {
      const uploadContainer = document.getElementById('upload-container');
      const viewerContainer = document.getElementById('viewer-container');
      const modelViewer = document.getElementById('model-viewer');
      
      // Convert base64 back to blob
      fetch(savedModel)
        .then(res => res.blob())
        .then(blob => {
          const glbUrl = URL.createObjectURL(blob);
          if (currentGlbUrl) {
            URL.revokeObjectURL(currentGlbUrl);
          }
          currentGlbUrl = glbUrl;
          
          modelViewer.src = glbUrl;
          uploadContainer.style.display = 'none';
          viewerContainer.style.display = 'block';
        });
    }
  } catch (e) {
    console.warn('Failed to load saved model:', e);
  }
}

function changeModel() {
  const uploadContainer = document.getElementById('upload-container');
  const viewerContainer = document.getElementById('viewer-container');
  
  // Reset upload container
  uploadContainer.innerHTML = `
    <label for="image-upload-change" class="upload-label">
      <div class="upload-area">
        <svg class="upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM155.3 182.6c-3.1-8.8-3.7-18.4-.9-27.8s8.8-17.1 17.6-21.9l104-56c8.4-4.5 18.7-4.2 26.9 .9s13.7 14.3 14.5 23.5l24 272c.8 9.4-3.1 18.7-10.4 24.4s-17 7.2-25.8 4.1l-104-36c-8.8-3.1-16.4-9.1-21.2-17s-6.4-17.3-4.4-26.1l16.4-72L119.7 303l-16.4 72c-2.1 9.1-8.2 16.9-16.4 21s-17.9 4.7-26.5 1.6l-80-28c-8.6-3-15.6-9.3-19.3-17.5s-3.5-17.6 .4-25.6l152-312zm28.2 67.9c.8 1 1.3 2.1 1.6 3.3l7.5 33.1L248.5 256l25.3-4.2 18.2-3-13.6-154.3L199 144.5l15.1 65.6 1.4 6.2zM48 360l30.2 10.6L96 288 48 360z"/></svg>
        <p>画像をアップロード</p>
        <p class="upload-hint">クリックして選択</p>
      </div>
      <input
        id="image-upload-change"
        type="file"
        accept="image/*"
        style="display: none;"
        onchange="handleFileUpload(event)"
      >
    </label>
  `;
  
  uploadContainer.style.display = 'block';
  viewerContainer.style.display = 'none';
  
  // Clean up old blob URL
  if (currentGlbUrl) {
    URL.revokeObjectURL(currentGlbUrl);
    currentGlbUrl = null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadSavedModel();
});
