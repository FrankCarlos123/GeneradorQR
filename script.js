document.getElementById('imageInput').addEventListener('change', handleImageUpload);

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Mostrar vista previa
    const preview = document.getElementById('preview');
    preview.innerHTML = '';
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    preview.appendChild(img);

    // Realizar OCR
    try {
        const result = await Tesseract.recognize(
            file,
            'spa',
            { logger: m => console.log(m) }
        );

        // Mostrar texto detectado
        document.getElementById('textResult').innerText = result.data.text;

        // Buscar códigos de barras en el texto
        const barcodeRegex = /\d{8,}/g;
        const barcodes = result.data.text.match(barcodeRegex) || [];

        // Mostrar códigos de barras encontrados
        const barcodeList = document.getElementById('barcodeList');
        barcodeList.innerHTML = '';
        barcodes.forEach(code => {
            const p = document.createElement('p');
            p.textContent = code;
            barcodeList.appendChild(p);
        });

        // Generar códigos QR
        const qrCodesContainer = document.getElementById('qrCodes');
        qrCodesContainer.innerHTML = '';
        
        barcodes.forEach(code => {
            const qrContainer = document.createElement('div');
            qrContainer.className = 'qr-code-container';
            
            // Crear elemento para el código QR
            const qrElement = document.createElement('div');
            qrContainer.appendChild(qrElement);
            
            // Añadir texto del código
            const codeText = document.createElement('p');
            codeText.textContent = code;
            qrContainer.appendChild(codeText);
            
            // Generar código QR
            new QRCode(qrElement, {
                text: code,
                width: 128,
                height: 128
            });
            
            qrCodesContainer.appendChild(qrContainer);
        });

    } catch (error) {
        console.error('Error en el procesamiento OCR:', error);
        alert('Error al procesar la imagen');
    }
}