<template>
    <div class="drawing-wrapper">
        <!-- Canvas para dibujar -->
        <canvas ref="myCanvas" width="600" height="300" @mousedown="startDrawing" @mousemove="draw"
            @mouseup="stopDrawing" style="border: 1px solid black"></canvas>

        <!-- Controles -->
        <div style="margin-top: 10px;">
            <button @click="clearCanvas">Limpiar</button>
            <button @click="toggleEraser">
                {{ isEraserActive ? '✏️ Lápiz' : '🩹 Borrador' }}
            </button>

            <label for="lineWidth">Grosor:</label>
            <input type="range" id="lineWidth" v-model="lineWidth" min="1" max="10" />

            <label for="strokeColor">Color:</label>
            <input type="color" id="strokeColor" v-model="strokeColor" />
            
                <button @click="doneDrawing">Listo</button>
                <button @click="cancelDrawing">Cancelar</button>
        
        </div>
    </div>
</template>

<style>
.drawing-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    padding: 20px;
    border-radius: 8px;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['done'])

const isDrawing = ref(false)
const isEraserActive = ref(false)
const lastX = ref(0)
const lastY = ref(0)
const currentPoints = ref([])
const drawnObjects = ref([])

const ctx = ref(null)
const lineWidth = ref(5)
const strokeColor = ref("#000000")
const myCanvas = ref(null)

onMounted(() => {
    ctx.value = myCanvas.value.getContext("2d")
    ctx.value.lineCap = "round"
})

const doneDrawing = () => {
    // emit('done', canvasImage)
    // showCanvas.value = false

    const dataURL = myCanvas.value.toDataURL("image/png")
    emit('done', dataURL)
}
const cancelDrawing = () => {
    emit('done', '')
}


const startDrawing = (e) => {
    const { offsetX: x, offsetY: y } = e
    if (isEraserActive.value) {
        eraseAtPoint(x, y)
        return
    }

    isDrawing.value = true
    lastX.value = x
    lastY.value = y
    currentPoints.value = [{ x, y }]
}

const draw = (e) => {
    if (!isDrawing.value || isEraserActive.value) return

    const { offsetX: x, offsetY: y } = e

    ctx.value.strokeStyle = strokeColor.value
    ctx.value.lineWidth = lineWidth.value

    ctx.value.beginPath()
    ctx.value.moveTo(lastX.value, lastY.value)
    ctx.value.lineTo(x, y)
    ctx.value.stroke()

    lastX.value = x
    lastY.value = y

    currentPoints.value.push({ x, y })
}

const stopDrawing = () => {
    if (!isDrawing.value) return
    isDrawing.value = false

    drawnObjects.value.push({
        id: Date.now(),
        points: [...currentPoints.value],
        color: strokeColor.value,
        width: lineWidth.value
    })

    currentPoints.value = []
}

const redrawCanvas = () => {
    ctx.value.clearRect(0, 0, myCanvas.value.width, myCanvas.value.height)
    for (const obj of drawnObjects.value) {
        if (obj.points.length < 2) continue

        ctx.value.strokeStyle = obj.color
        ctx.value.lineWidth = obj.width

        ctx.value.beginPath()
        ctx.value.moveTo(obj.points[0].x, obj.points[0].y)
        for (let i = 1; i < obj.points.length; i++) {
            ctx.value.lineTo(obj.points[i].x, obj.points[i].y)
        }
        ctx.value.stroke()
    }
}

const eraseAtPoint = (x, y) => {
    const threshold = 6
    const indexToDelete = drawnObjects.value.findIndex(obj =>
        obj.points.some(p => {
            const dx = x - p.x
            const dy = y - p.y
            return Math.sqrt(dx * dx + dy * dy) < threshold
        })
    )

    if (indexToDelete !== -1) {
        drawnObjects.value.splice(indexToDelete, 1)
        redrawCanvas()
    }
}

const clearCanvas = () => {
    ctx.value.clearRect(0, 0, myCanvas.value.width, myCanvas.value.height)
    drawnObjects.value = []
}

const toggleEraser = () => {
    isEraserActive.value = !isEraserActive.value
}

const emitImage = () => {
    const dataURL = myCanvas.value.toDataURL("image/png")
    emit('done', dataURL)
}
</script>