    <input type="file" onChange={(e)=>{
      const file = e.target!.files![0];
 
      const reader = new FileReader();
      reader.addEventListener("load",function(res){
        const buff = res.target!.result as ArrayBuffer;
        const encodedBytes = huffman_encode(buff);
        // downloadFile(encodedBytes,`${file.name}.huff`);
        const orjSize = buff.byteLength;
        const compressedSize = encodedBytes.length;
        const compressionRatio = (100 - (100 * compressedSize / orjSize));
        console.log(`Orjinal Size        : ${orjSize.toLocaleString("de")}`);
        console.log(`Compressed Size     : ${compressedSize.toLocaleString("de")} `);
        console.log(`Compression Ratio   : %${compressionRatio.toLocaleString("de", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

        const decodedBytes = huffman_decode(Uint8Array.from(encodedBytes).buffer);
        downloadFile(decodedBytes,`decodedfile`);
      });
      reader.readAsArrayBuffer(file);

    }}/>