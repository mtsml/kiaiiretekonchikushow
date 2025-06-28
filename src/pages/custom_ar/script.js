let currentGlbUrl = null;
const LOCAL_STORAGE_KEY = 'custom_ar/savedModel';

function imageToGlb(imageDataUrl, width, height) {
  const aspectRatio = width / height;
  const scale = 0.1;
  const planeWidth = (aspectRatio > 1 ? 1 : aspectRatio) * scale;
  const planeHeight = (aspectRatio > 1 ? 1 / aspectRatio : 1) * scale;
  
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
      
      return;
    }
  } catch (e) {
    console.warn('Failed to load saved model:', e);
  }

  const uploadContainer = document.getElementById('upload-container');
  uploadContainer.style.display = 'block';
}

function changeModel() {
  const uploadContainer = document.getElementById('upload-container');
  const viewerContainer = document.getElementById('viewer-container');
  
  // Reset upload container
  uploadContainer.innerHTML = `
    <label for="image-upload-change" class="upload-label">
      <div class="upload-area">
        <svg class="upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M448 80c8.8 0 16 7.2 16 16l0 319.8-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3L48 96c0-8.8 7.2-16 16-16l384 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>
        <p>タップして画像を選択</p>
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
