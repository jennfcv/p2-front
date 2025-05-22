<!-- <template>
  <div class="editor-preview p-1">
    <div>
      <button @click="toggleEditor" class="toggle-button">
        {{ isEditorVisible ? '<' : '>' }} </button>
      <button @click="exportCanvasJson" class="toggle-button">guardar </button>

    </div>

    <textarea v-if="isEditorVisible" class="p-3" v-model="markdown" @input="autoResize" ref="editor"
      style="overflow:hidden" />
    <div class="preview" v-html="convertedHtml" ref="preview" :style="{ width: isEditorVisible ? '50%' : '100%' }" />
  </div>
</template>


<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import showdown from 'showdown'
import mermaid from 'mermaid'
// import debounce from 'lodash/debounce'



const isEditorVisible = ref(true)
const canvasStrokes = {}


const toggleEditor = () => {
  isEditorVisible.value = !isEditorVisible.value
  nextTick(() => {
    autoResize()
    mermaid.run()
  })
}

// REGISTRAR EXTENSIÓN MERMAID EN SHOWDOWN
showdown.extension('mermaid', function () {
  return [{
    type: 'lang',
    regex: /```mermaid([\s\S]+?)```/g,
    replace: function (_, code) {
      return `<div class="mermaid">${code.trim()}</div>`
    }
  }]
})


showdown.extension('canva', function () {
  return [{
    type: 'lang',
    regex: /```canva\s*(.*?)\n\s*(\d+)x(\d+)\s*```/g,
    replace: function (_, title, width, height) {
  const cleanId = title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '') || 'canvas-sin-titulo'
  return `<div class="canva-container" id="${cleanId}" style="border:1px solid black;">
    <p class="canvas-title">${title || 'sin título'}</p>
    <button class="eraser-btn" data-target="${cleanId}">Borrar</button>
    <div class="canvas-wrapper">
      <canvas style="border:1px solid #ccc;" width="${width}" height="${height}"></canvas>
    </div>
  </div>`
}
//     replace: function (_, title, width, height) {
//       const cleanId = title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '') || 'canvas-sin-titulo'
//       return `<div class="canva-container" id="${cleanId}" style="border:1px solid black;">
//   <p class="canvas-title">${title || 'sin título'}</p>
//   <div class="canvas-wrapper">
//     <canvas style="border:1px solid #ccc;" width="${width}" height="${height}"></canvas>
//   </div>
// </div>`
//     }
  }]
})

//  CREAR CONVERSOR
const markdown = ref(`# Hola Markdown!

\`\`\`mermaid
graph LR
    A[antes de cristo] --- B[despues de cristo]
\`\`\`

\`\`\`canva esquema
400x200
\`\`\`



`)
const converter = new showdown.Converter({
  extensions: ['mermaid', 'canva'],
  tables: true,
  ghCodeBlocks: true,
  gfm: true
})


const enableDrawingOnCanvas = () => {
  const canvases = document.querySelectorAll('.canva-container canvas')

  canvases.forEach((canvas) => {
    if (canvas.dataset.bound) return
    canvas.dataset.bound = true

    const container = canvas.closest('.canva-container')
    const id = container?.id

    // 🚫 Ignorar si no hay ID válido
    if (!id || id.length < 3) return

    if (!canvasStrokes[id]) canvasStrokes[id] = []

    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2

    let drawing = false
    let currentStroke = []

    canvas.addEventListener('mousedown', (e) => {
      drawing = true
      currentStroke = []
      const { x, y } = getMousePos(canvas, e)
      ctx.beginPath()
      ctx.moveTo(x, y)
      currentStroke.push({ x, y })
    })

    canvas.addEventListener('mousemove', (e) => {
      if (!drawing) return
      const { x, y } = getMousePos(canvas, e)
      ctx.lineTo(x, y)
      ctx.stroke()
      currentStroke.push({ x, y })
    })

    const finishStroke = () => {
      if (drawing && currentStroke.length > 0) {
        canvasStrokes[id].push(currentStroke)
        currentStroke = []
      }
      drawing = false
    }

    canvas.addEventListener('mouseup', finishStroke)
    canvas.addEventListener('mouseleave', finishStroke)
  })
}


const bindEraserButtons = () => {
  const buttons = document.querySelectorAll('.eraser-btn')

  buttons.forEach((btn) => {
    if (btn.dataset.bound) return
    btn.dataset.bound = true

    btn.addEventListener('click', () => {
      const id = btn.dataset.target
      const container = document.getElementById(id)
      const canvas = container?.querySelector('canvas')

      if (canvas && canvasStrokes[id]) {
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        canvasStrokes[id] = []
      }
    })
  })
}


function getMousePos(canvas, evt) {
  const rect = canvas.getBoundingClientRect()
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
}



const convertedHtml = computed(() => converter.makeHtml(markdown.value))

//  REFS
const editor = ref(null)
const preview = ref(null)


const exportCanvasJson = () => {
  const sanitized = {}

  for (const [key, strokes] of Object.entries(canvasStrokes)) {
    if (Array.isArray(strokes) && strokes.length > 0) {
      // Filtrar strokes vacíos (por si hay trazos vacíos)
      const nonEmptyStrokes = strokes.filter(s => s.length > 0)

      if (nonEmptyStrokes.length > 0) {
        sanitized[key] = nonEmptyStrokes
      }
    }
  }
  console.log(sanitized);
  
  // return JSON.parse(JSON.stringify(canvasStrokes)) // para hacer una copia profunda
}

const importCanvasJson = (data) => {
  for (const [id, strokes] of Object.entries(data)) {
    const canvas = document.querySelector(`#${id} canvas`)
    if (!canvas) continue // Saltar si el canvas no existe

    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2

    // Asegurarse de que el objeto canvasStrokes también esté sincronizado
    canvasStrokes[id] = strokes

    for (const stroke of strokes) {
      if (!Array.isArray(stroke) || stroke.length === 0) continue

      ctx.beginPath()
      ctx.moveTo(stroke[0].x, stroke[0].y)

      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y)
      }

      ctx.stroke()
    }
  }
}


//  REDIMENSIÓN DEL TEXTAREA Y VISTA PREVIA
const autoResize = () => {
  if (!editor.value || !preview.value) return
  editor.value.style.height = 'auto'
  editor.value.style.height = editor.value.scrollHeight + 'px'
  preview.value.style.height = 'auto'
  preview.value.style.height = preview.value.scrollHeight + 'px'
}

//  RENDERIZAR MERMAID TRAS CAMBIOS
// watch(markdown, async () => {
//   await nextTick()
//   mermaid.run()
//   autoResize()
//   enableDrawingOnCanvas()
//   bindEraserButtons()
//   importCanvasJson(canvasStrokes)
// })

const updatePreview = debounce(async () => {
  await nextTick()
  mermaid.run()
  autoResize()
  enableDrawingOnCanvas()
  bindEraserButtons()
  importCanvasJson(canvasStrokes)
}, 300)

enableDrawingOnCanvas()
// mermaid.run()

watch(markdown, () => {
  updatePreview()
})

// RENDERIZAR AL MONTAR
onMounted(() => {
  autoResize()
  bindEraserButtons()
  enableDrawingOnCanvas()
  mermaid.run()
})
</script>

<style scoped>
.editor-preview {
  display: flex;
  gap: 1rem;
}

.canva-container {
  display: inline-block; /* 💡 hace que tome el ancho de su contenido */
  border: 1px solid black;
  padding: 8px;
  margin-bottom: 1rem;
}


.canvas-title {
  margin: 0 0 4px;
  font-weight: bold;
  font-size: 14px;
}

.canvas-wrapper canvas {
  display: block;
}

.canvas-wrapper canvas {
  display: block;
  max-width: 100%; /* evita que el canvas sobresalga */
}

textarea {
  width: 50%;
  min-height: 100px;
  resize: none;
  overflow: hidden;
  font-family: monospace;
  padding: 1rem;
}

.preview {
  width: 50%;
  padding: 1rem;
  /* border: 1px solid #ccc; */
  background: #f9f9f9;
  /* white-space: pre-wrap; */
  min-height: 100px;
}
</style> -->
<template>
  mildok warper
</template>

<script setup ></script>