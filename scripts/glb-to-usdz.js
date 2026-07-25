// @ts-check
/**
 * GLB to USDZ converter
 * Converts GLB files to USDZ format for iOS AR support
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

/**
 * Parse GLB file structure
 * @param {Buffer} glbBuffer - GLB file buffer
 * @returns {Object} Parsed GLB data
 */
function parseGLB(glbBuffer) {
  const view = new DataView(glbBuffer.buffer, glbBuffer.byteOffset, glbBuffer.length);
  
  // Read header
  const magic = view.getUint32(0, true);
  const version = view.getUint32(4, true);
  const length = view.getUint32(8, true);
  
  if (magic !== 0x46546C67) { // 'glTF'
    throw new Error('Invalid GLB file');
  }
  
  if (version !== 2) {
    throw new Error('Only GLB version 2 is supported');
  }
  
  // Read chunks
  let offset = 12;
  let jsonChunk = null;
  let binChunk = null;
  
  while (offset < length) {
    const chunkLength = view.getUint32(offset, true);
    const chunkType = view.getUint32(offset + 4, true);
    offset += 8;
    
    const chunkData = glbBuffer.slice(offset, offset + chunkLength);
    
    if (chunkType === 0x4E4F534A) { // 'JSON'
      jsonChunk = JSON.parse(chunkData.toString('utf8'));
    } else if (chunkType === 0x004E4942) { // 'BIN\0'
      binChunk = chunkData;
    }
    
    offset += chunkLength;
  }
  
  return { json: jsonChunk, bin: binChunk };
}

/**
 * Create a simple USD file from glTF JSON
 * @param {Object} gltf - glTF JSON structure
 * @param {Buffer} binBuffer - Binary data
 * @returns {string} USD file content
 */
function createUSD(gltf, binBuffer) {
  let usd = `#usda 1.0
(
    defaultPrim = "root"
)

def Xform "root"
{
`;

  // Add meshes
  if (gltf.meshes && gltf.meshes.length > 0) {
    gltf.meshes.forEach((mesh, meshIdx) => {
      usd += `    def Mesh "mesh_${meshIdx}"\n    {\n`;
      usd += `        uniform token[] xformOpOrder = ["xformOp:transform"]\n`;
      usd += `        rel material:binding = </Materials/Material_0>\n`;
      
      if (mesh.primitives && mesh.primitives.length > 0) {
        const primitive = mesh.primitives[0];
        const posAccessor = gltf.accessors[primitive.attributes.POSITION];
        
        if (posAccessor) {
          const bufferView = gltf.bufferViews[posAccessor.bufferView];
          const offset = (bufferView.byteOffset || 0) + (posAccessor.byteOffset || 0);
          
          // Read positions
          const positions = [];
          const count = posAccessor.count;
          const componentType = posAccessor.componentType;
          
          for (let i = 0; i < count; i++) {
            const idx = offset + i * 12; // 3 floats * 4 bytes
            const x = binBuffer.readFloatLE(idx);
            const y = binBuffer.readFloatLE(idx + 4);
            const z = binBuffer.readFloatLE(idx + 8);
            positions.push([x, y, z]);
          }
          
          // Write points
          usd += `        point3f[] points = [`;
          positions.forEach((pos, i) => {
            usd += `(${pos[0]}, ${pos[1]}, ${pos[2]})`;
            if (i < positions.length - 1) usd += ', ';
          });
          usd += `]\n`;
          
          // Write point count
          usd += `        int[] pointCounts = [${count}]\n`;
        }
      }
      
      usd += `    }\n\n`;
    });
  }
  
  // Add materials
  usd += `    def "Materials"\n    {\n`;
  usd += `        def Material "Material_0"\n        {\n`;
  usd += `            token outputs:surface.connect = </Materials/Material_0/PreviewSurface.outputs:surface>\n`;
  usd += `            def Shader "PreviewSurface"\n            {\n`;
  usd += `                uniform token info:id = "UsdPreviewSurface"\n`;
  usd += `                color3f inputs:diffuseColor = (0.8, 0.8, 0.8)\n`;
  usd += `                float inputs:roughness = 0.4\n`;
  usd += `                token outputs:surface\n`;
  usd += `            }\n`;
  usd += `        }\n`;
  usd += `    }\n`;
  
  usd += `}\n`;
  
  return usd;
}

/**
 * Convert GLB to USDZ
 * @param {Buffer} glbBuffer - GLB file buffer
 * @returns {Buffer} USDZ file buffer
 */
function glbToUsdz(glbBuffer) {
  const { json: gltf, bin: binBuffer } = parseGLB(glbBuffer);
  
  const usdContent = createUSD(gltf, binBuffer);
  
  // Create a simple ZIP structure manually
  // USDZ is a ZIP file with a .usd file inside
  const usdFileName = 'model.usd';
  const usdBuffer = Buffer.from(usdContent, 'utf8');
  
  // Create ZIP file manually (simplified)
  // For production, should use proper ZIP library
  const zip = createSimpleZip([
    {
      filename: usdFileName,
      content: usdBuffer,
      isDirectory: false
    }
  ]);
  
  return zip;
}

/**
 * Create a simple ZIP archive
 * @param {Array} files - Files to include {filename, content, isDirectory}
 * @returns {Buffer} ZIP file buffer
 */
function createSimpleZip(files) {
  const localHeaders = [];
  const centralDir = [];
  let offset = 0;
  
  files.forEach((file, idx) => {
    const filename = file.filename;
    const content = file.content || Buffer.alloc(0);
    const filenameBuffer = Buffer.from(filename, 'utf8');
    
    // Local file header
    const localHeader = Buffer.alloc(30 + filenameBuffer.length);
    const view = new DataView(localHeader.buffer, localHeader.byteOffset, localHeader.length);
    
    view.setUint32(0, 0x04034b50, true); // Local file header signature
    view.setUint16(4, 20, true); // Version needed to extract
    view.setUint16(6, 0, true); // General purpose bit flag
    view.setUint16(8, 0, true); // Compression method (0 = no compression)
    view.setUint16(10, 0, true); // File modification time
    view.setUint16(12, 0, true); // File modification date
    view.setUint32(14, 0, true); // CRC-32
    view.setUint32(18, content.length, true); // Compressed size
    view.setUint32(22, content.length, true); // Uncompressed size
    view.setUint16(26, filenameBuffer.length, true); // Filename length
    view.setUint16(28, 0, true); // Extra field length
    
    filenameBuffer.copy(localHeader, 30);
    localHeaders.push(localHeader);
    
    // Central directory entry
    const centralEntry = Buffer.alloc(46 + filenameBuffer.length);
    const centralView = new DataView(centralEntry.buffer, centralEntry.byteOffset, centralEntry.length);
    
    centralView.setUint32(0, 0x02014b50, true); // Central directory header signature
    centralView.setUint16(4, 20, true); // Version made by
    centralView.setUint16(6, 20, true); // Version needed to extract
    centralView.setUint16(8, 0, true); // General purpose bit flag
    centralView.setUint16(10, 0, true); // Compression method
    centralView.setUint16(12, 0, true); // File modification time
    centralView.setUint16(14, 0, true); // File modification date
    centralView.setUint32(16, 0, true); // CRC-32
    centralView.setUint32(20, content.length, true); // Compressed size
    centralView.setUint32(24, content.length, true); // Uncompressed size
    centralView.setUint16(28, filenameBuffer.length, true); // Filename length
    centralView.setUint16(30, 0, true); // Extra field length
    centralView.setUint16(32, 0, true); // File comment length
    centralView.setUint16(34, 0, true); // Disk number start
    centralView.setUint16(36, 0, true); // Internal file attributes
    centralView.setUint32(38, 0, true); // External file attributes
    centralView.setUint32(42, offset, true); // Relative offset of local header
    
    filenameBuffer.copy(centralEntry, 46);
    centralDir.push(centralEntry);
    
    offset += localHeader.length + content.length;
  });
  
  // End of central directory
  const eofCentral = centralDir.reduce((sum, buf) => sum + buf.length, 0);
  const eofRecord = Buffer.alloc(22);
  const eofView = new DataView(eofRecord.buffer, eofRecord.byteOffset, eofRecord.length);
  
  eofView.setUint32(0, 0x06054b50, true); // End of central dir signature
  eofView.setUint16(4, 0, true); // Disk number
  eofView.setUint16(6, 0, true); // Disk with central dir
  eofView.setUint16(8, files.length, true); // Number of central dir records on disk
  eofView.setUint16(10, files.length, true); // Total number of central dir records
  eofView.setUint32(12, eofCentral, true); // Size of central directory
  eofView.setUint32(16, offset, true); // Offset of start of central directory
  eofView.setUint16(20, 0, true); // Comment length
  
  // Combine all buffers
  const allParts = [];
  localHeaders.forEach((h, i) => {
    allParts.push(h);
    allParts.push(files[i].content || Buffer.alloc(0));
  });
  centralDir.forEach(cd => allParts.push(cd));
  allParts.push(eofRecord);
  
  return Buffer.concat(allParts);
}

/**
 * Main conversion function
 */
function main() {
  const modelsDir = path.join(__dirname, '../src/assets/models');
  
  if (!fs.existsSync(modelsDir)) {
    console.error(`Models directory not found: ${modelsDir}`);
    process.exit(1);
  }
  
  const glbFiles = fs.readdirSync(modelsDir).filter(f => f.endsWith('.glb'));
  
  console.log(`Found ${glbFiles.length} GLB files to convert`);
  
  glbFiles.forEach(file => {
    try {
      const glbPath = path.join(modelsDir, file);
      const usdzPath = path.join(modelsDir, file.replace('.glb', '.usdz'));
      
      const glbBuffer = fs.readFileSync(glbPath);
      const usdzBuffer = glbToUsdz(glbBuffer);
      
      fs.writeFileSync(usdzPath, usdzBuffer);
      console.log(`✓ ${file} → ${file.replace('.glb', '.usdz')}`);
    } catch (err) {
      console.error(`✗ ${file}: ${err.message}`);
    }
  });
}

main();
