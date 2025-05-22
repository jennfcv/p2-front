<script setup>
import { onMounted, ref } from 'vue'
import DrawingCanvas from './CanvasDrawer.vue' // Componente de dibujo
import { marked } from 'marked';


const editor = ref(null)
const contenidoHtml = ref('')
const showCanvas = ref(false)



let quill

onMounted(async () => {
    if (!window.Quill) {
        await cargarScript('https://cdn.quilljs.com/1.3.6/quill.min.js')
        await cargarEstilos('https://cdn.quilljs.com/1.3.6/quill.snow.css')
    }

    quill = new Quill(editor.value, {
        modules: {
            toolbar: {
                container: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'image', 'code-block'],
                    [{ header: 1 }, { header: 2 }],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ script: 'sub' }, { script: 'super' }],
                    [{ indent: '-1' }, { indent: '+1' }],
                    [{ direction: 'rtl' }],
                    [{ size: ['small', false, 'large', 'huge'] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ color: [] }, { background: [] }],
                    [{ font: [] }],
                    [{ align: [] }],
                    ['clean'],
                    [{ custom: 'draw' }]
                ],
                handlers: {
                    draw: () => {
                        showCanvas.value = true
                    }
                }
            }
        },
        theme: 'snow'
    })

    // Agregar botón personalizado al toolbar
    const button = document.createElement('button')
    //   button.innerHTML = '🖊️'
    button.innerHTML = `<img src="./draw-svgrepo-com.svg" alt="Dibujo" style="width: 20px; height: 20px;" />`

    button.title = 'Insertar dibujo'
    button.onclick = () => showCanvas.value = true

    const customGroup = document.createElement('span')
    customGroup.classList.add('ql-formats')
    customGroup.appendChild(button)
    editor.value.previousSibling.appendChild(customGroup)
})

const insertText = async () => {
  const markdownText = `
  # Resumen de las Guerras del Opio

Las Guerras del Opio, también conocidas como las guerras anglo-chinas, fueron dos conflictos bélicos ocurridos en el siglo XIX entre el Imperio Chino y el Imperio Británico. Estas guerras se libraron principalmente por intereses comerciales, relacionados con el contrabando de opio. La primera guerra tuvo lugar entre 1839 y 1842, mientras que la segunda se extendió desde 1856 hasta 1860, con la intervención de Francia aliada con los británicos.

## **Causas de las Guerras del Opio**
Las principales causas de estas guerras fueron los intereses comerciales británicos y la resistencia china al comercio del opio:

- **Comercio de opio**: Durante el siglo XVIII, el Reino Unido enfrentaba un gran déficit comercial con China debido a la alta demanda de productos chinos como el té, la seda y la porcelana, pero con baja demanda de productos británicos. Para contrarrestar este desequilibrio, Gran Bretaña comenzó a exportar opio ilegalmente a China desde la India, donde la Compañía Británica de las Indias Orientales tenía el monopolio de este comercio.
- **Prohibición del opio**: En 1829, el emperador Daoguang de China prohibió la venta y consumo de opio debido a los graves problemas de adicción entre la población.

## **Desarrollo de las Guerras**
### **Primera Guerra del Opio (1839-1842)**
La primera guerra fue un enfrentamiento directo entre el Imperio Británico y el Imperio Chino debido a la negativa de China a permitir el comercio de opio. La guerra culminó con la derrota de China, lo que obligó al gobierno chino a tolerar el comercio del opio y a abrir varios puertos al comercio exterior.

### **Segunda Guerra del Opio (1856-1860)**
La segunda guerra comenzó con la intervención de Francia, que se unió a Gran Bretaña en la lucha contra China. Durante este conflicto, se firmaron varios tratados que favorecían a las potencias extranjeras y daban como resultado la cesión de territorios y la apertura de puertos chinos al comercio exterior.

## **Consecuencias**
Las derrotas chinas en ambas guerras llevaron a la firma de los **Tratados Desiguales**, que resultaron en:

- **Apertura de puertos**: Varios puertos chinos fueron abiertos al comercio con potencias extranjeras.
- **Cesión de Hong Kong**: Hong Kong fue cedido al Reino Unido como parte de los acuerdos del **Tratado de Nankín**.
- **Rebeliones**: Las Guerras del Opio contribuyeron a la inestabilidad interna de China, lo que dio lugar a eventos como la **Rebelión Taiping** (1850-1864) y la **Rebelión de los Bóxers** (1899-1901).
 
 `;

  const htmlContent = marked(markdownText);
  const range = quill.getSelection();
  const insertAt = range ? range.index : quill.getLength();

  // Crear un contenedor temporal para dividir el HTML por bloques
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  const elements = Array.from(tempDiv.childNodes);

  // Insertar cada bloque con una pausa
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    await new Promise(resolve => setTimeout(resolve, 500)); // Velocidad (en ms)

    // Insertar cada nodo como HTML 
    quill.clipboard.dangerouslyPasteHTML(quill.getLength(), el.outerHTML || el.textContent);
  }
};


// const insertText = () => {
//     const markdownText = `
// # Guerras del Opio: Un Conflicto Anglog-Chino en el Siglo XIX

// Las **Guerras del Opio** fueron dos conflictos bélicos importantes que ocurrieron en el siglo XIX entre el **Imperio Chino** y el **Imperio Británico**. La primera guerra tuvo lugar entre 1839 y 1842, y la segunda, con la participación de Francia, entre 1856 y 1860. Estas guerras estuvieron profundamente marcadas por intereses comerciales, principalmente el **comercio del opio**, que fue el centro de la disputa.

//     `;

//     const htmlContent = marked(markdownText);
//     const range = quill.getSelection();
//     console.log(htmlContent);

//   if (range) {
//     // Si hay una selección, inserta el contenido HTML
//     quill.clipboard.dangerouslyPasteHTML(range.index, htmlContent);
//   } else {
//     // Si no hay una selección, inserta el contenido al final del editor
//     const currentContent = quill.root.innerHTML;
//     quill.root.innerHTML = currentContent + htmlContent;
//   }
// };

const insertarImagenDibujo = (dataUrl) => {
    const range = quill.getSelection(true)
    quill.insertEmbed(range.index, 'image', dataUrl)
    showCanvas.value = false
}

function cargarScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = resolve
        document.head.appendChild(script)
    })
}

function cargarEstilos(href) {
    return new Promise((resolve) => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        link.onload = resolve
        document.head.appendChild(link)
    })
}
</script>

<template>
    
    <div class="editor-container">
        <div ref="editor" class="quill-editor"></div>

        <button @click="() => console.log(quill.root.innerHTML)">Ver contenido HTML</button>
        <button @click="insertText">Insertar texto Delta</button>

        <DrawingCanvas v-if="showCanvas" class="drawing-canvas" @done="insertarImagenDibujo" @cancel="() => showCanvas.value = false" />
    </div>
</template>

<style scoped>
.editor-container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
}

.quill-editor {
    height: 600px;
}

.drawing-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Fondo oscuro semi-transparente */
  z-index: 9999; /* Asegúrate de que se sobreponga al editor */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>