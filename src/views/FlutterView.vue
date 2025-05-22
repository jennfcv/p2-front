<template>
    <div v-if="tituloProyecto">
        <h3>Proyecto: {{ tituloProyecto }}</h3>
    </div>
    <div v-if="esAnfitrion">
        <p>es anfitrion</p>
    </div>
    <div v-if="!esAnfitrion">
        <p>es colaborador</p>
    </div>
    <div v-if="esAnfitrion">
        <input v-model="colaborador" placeholder="Usuario a invitar" />
        <button @click="unirse">Unir usuario</button>
<!-- 
        <button id="popover-button" type="button" class="btn btn-secondary" data-bs-toggle="popover" data-bs-html="true"
            data-bs-trigger="hover" data-bs-placement="right">
            Colaboradores
        </button> -->

    </div>





    <button @click="addText()">Text</button>
    <button @click="addinputNode('input', { x: 130, y: 150 })">input</button>
    <!-- <button @click="addCustomNode('nav', 'lightskyblue', { x: 1160, y: 70 })">custom node</button>
    <button @click="addCustomNode('cricle', 'lightskyblue', { x: 50, y: 50 })">circle node</button> -->
    <br>
    <button class="link-dark rounded" @click="deleteNode">Eliminar</button>

    <button @click="addLayoutNode('container', { x: 300, y: 500 })">container</button>
    <button @click="addLayoutNode('listview', { x: 300, y: 500 })">list view</button>
    <button @click="addLayoutNode('padding', { x: 100, y: 100 })">padding</button>
    <button @click="addLayoutNode('center', { x: 100, y: 100 })">center</button>
    <button @click="addLayoutNode('row', { x: 100, y: 100 })">row</button>    
    <button @click="addLayoutNode('column', { x: 100, y: 100 })">column</button>
    <button @click="addLayoutNode('sizedBox', { x: 100, y: 100 })">SizedBox</button>
    <button @click="addLayoutNode('flexible', { x: 100, y: 100 })">Flexible</button>
    <button @click="addLayoutNode('card', { x: 100, y: 100 })">Card</button>
    <button @click="addLayoutNode('expanded', { x: 100, y: 100 })">Expanded</button>

    <p>-----------composition-----------</p>
    <p v-if="selectedNode">Nodo seleccionado: {{ selectedNode.type }}{{ selectedNode.key }}</p>

    <button @click="addLayoutNode('scaffold', { x: 360, y: 620 })">scaffold</button>




    <div class="container-fluid">
        <div class="row">
            <div class="col-1 p-3 bg-light ">
                <ContainerWidget v-if="selectedNode?.type === 'container'" />
                <PaddingWidget v-if="selectedNode?.type === 'padding'" />
                <Scaffold v-if="selectedNode?.type === 'scaffold'" />
                <DrawerWidget v-if="selectedNode?.type === 'drawer'" />


            </div>
            <div class="col-2">
                <pre>{{ arbolComoTexto }}</pre>

            </div>
            <div class="col-9 p-3 bg-light ">
                <div ref="diagramRef" style="width: 100%; height: 670px; border: 1px solid #ccc"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, onBeforeUnmount } from "vue";
import { DiagramManager } from "../class/DiagramManagerNew.js";
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth';
import { useSalaStore } from '@/stores/salas';
import { useProyectosStore } from '@/stores/proyectos';
import { io } from "socket.io-client";

//componsable
import { useDiagram } from '../composables/useDiagram.js';
import { useTree } from '../composables/useTree.js';


import ContainerWidget from "@/components/widgets/layout/ContainerWidget.vue";
import PaddingWidget from "@/components/widgets/layout/PaddingWidget.vue";
import Scaffold from "@/components/widgets/composition/scaffoldWidget.vue";
import DrawerWidget from "@/components/widgets/composition/drawerWidget.vue";




//componentes


const diagramRef = ref(null);
let diagramManager = null;
let socket = null;
const route = useRoute();
const router = useRouter();
const codigoSala = ref(route.params.codigo);
const idProyecto = ref(Number(route.params.id));
const esAnfitrion = ref(!!route.params.id);
const auth = useAuthStore();
const sala = useSalaStore();
const proyecto = useProyectosStore();
let inicializado = false;
const tituloProyecto = ref('');
const colaborador = ref("");
const mensaje = ref("");



// const selectedNode = ref({})
const { selectedNode, setSelectedNode,setEmitir, setDiagramManager } = useDiagram();
const { arbolJerarquico, agregarNuevoNodo, buscarNodoPorId, obtenerIdsRecursivos, eliminarNodoDelArbol } = useTree(selectedNode);


//computed
const arbolComoTexto = computed(() => formatearArbol(arbolJerarquico.value))




onMounted(async () => {
    // if (diagramRef.value) {
    //     diagramManager = new DiagramManager(diagramRef.value, (nodeData) => {
    //         selectedNode.value = nodeData
    //         // console.log(selectedNode.value);
    //     });
    //     setDiagramManager(diagramManager);
    // }


    socket = io("http://localhost:3000");
    socket.on("connect", () => {
        console.log("Conectado al WebSocket");

        socket.emit("join-room", {
            codigo: codigoSala.value,
            usuario: auth.user.usuario,
        });

        socket.on("load-diagram", (data) => {

            if (inicializado) return;
            tituloProyecto.value = data.data.nombre || '';

            const arbol = JSON.parse(data.payload)[1]
            const diagramaRaw = JSON.parse(data.payload)[0]

            if (diagramRef.value) {
                diagramManager = new DiagramManager(diagramRef.value, (nodeData) => {
                    selectedNode.value = nodeData
                    console.log(selectedNode.value);
                    
                });
                diagramManager.loadDiagram(diagramaRaw);
                diagramManager.setNodeMovedCallback((json) => {
                    socket.emit("save-diagram", {
                        codigo: codigoSala.value,
                        diagrama: [json, arbolJerarquico.value]
                    });
                });
                setDiagramManager(diagramManager);
            }


            if (arbol) {
                arbolJerarquico.value = arbol
            }
            inicializado = true;
        });

        socket.on("update-diagram", (data) => {
            const model = JSON.parse(data.payload.diagrama)
            if (diagramRef.value) {
                diagramManager.loadDiagram(model[0]);
                arbolJerarquico.value = model[1];
            }
        });

    });

    setEmitir(emitir); 

})


onBeforeUnmount(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
    }
    generarImagenDelDiagrama();
})



const addText = (tipo = "texto", text = "Nuevo Texto") => {
    const newNodeData = diagramManager.addTextNode(tipo, text);
    agregarNodoJson(tipo, newNodeData);
    const json = diagramManager.saveDiagram();

    emitir(json);

};
// const addCustomNode = (valor, color, size = { x: 1160, y: 640 }, pos = { x: 0, y: 0 }) => {
//     const newNodeData = diagramManager.addNodeToDiagram(valor, color, size, pos);
//     agregarNodoJson(valor, newNodeData);
//     const json = diagramManager.saveDiagram();

//     emitir(json);

// };
const addLayoutNode = (valor, size = { x: 1160, y: 640 }) => {
    const newNodeData = diagramManager.addLayout(valor, size);
    agregarNodoJson(valor, newNodeData);
    const json = diagramManager.saveDiagram();

    emitir(json);

};
const addinputNode = (valor = "input", size = { x: 80, y: 30 }, text = "input", pos = { x: 0, y: 0 }) => {
    const newNodeData = diagramManager.addRectangleTextNode(valor, size, text, pos);
    agregarNodoJson(valor, newNodeData);
    const json = diagramManager.saveDiagram();

    emitir(json);

};




const deleteNode = () => {
    const respuesta = diagramManager.deleteSelectedNode();
    const idNodo = respuesta.data.key;
    const nodoEncontrado = buscarNodoPorId(arbolJerarquico.value, idNodo);
    console.log(nodoEncontrado);
    
    const todosLosIds = obtenerIdsRecursivos(nodoEncontrado);
    eliminarNodoDelArbol(arbolJerarquico.value, idNodo);
    diagramManager.deleteNodesByIds(todosLosIds);
};


const agregarNodoJson = (type, nodo) => {
    const nuevoNodo = {
        id: nodo.key,
        tipo: type,
        children: []
    };
    agregarNuevoNodo(nuevoNodo);
    console.log(arbolJerarquico.value);

}
const formatearArbol = (nodo, nivel = 0) => {
    if (!nodo) return '';

    const indentacion = '  '.repeat(nivel);
    const flechas = nivel > 0 ? '--> ' : '';
    const texto = `${nodo.tipo}${nodo.id !== undefined ? nodo.id : ''}`;
    let resultado = `${indentacion}${flechas}${texto}\n`;
    if (nodo.children && nodo.children.length > 0) {
        for (const hijo of nodo.children) {
            resultado += formatearArbol(hijo, nivel + 1);
        }
    }
    return resultado;
};
const emitir = (json) => {
    socket.emit("add-node", {
        codigo: codigoSala.value,
        diagrama: [json, arbolJerarquico.value]
    });
}
const unirse = async () => {
    if (!colaborador.value.trim()) {
        return;
    }

    console.log(colaborador.value)
    try {
        await sala.joinSala({
            usuario: colaborador.value,
            codigo: codigoSala.value,
        });
        mensaje.value = `usuario agregado a la sala ${colaborador.value}`;
    } catch (err) {
        mensaje.value = err.response;
        console.log(err);
        
    }
    colaborador.value = '';
}

async function generarImagenDelDiagrama() {
    if (!diagramManager) {
        console.warn('No hay instancia de diagramManager');
        return;
    }

    const imageDataUrl = diagramManager.getDiagramImageData();
    if (!imageDataUrl) {
        console.warn('No se pudo generar la imagen del diagrama');
        return;
    }

    const imagenFile = dataURLToFile(imageDataUrl, 'diagrama.png');

    const formData = new FormData();
    formData.append('imagenData', imagenFile);

    try {
        await proyecto.cerrarProyecto(formData, idProyecto.value);
        console.log('Imagen enviada correctamente');
    } catch (err) {
        console.error('Error al enviar la imagen generada:', err);
    }
}
function dataURLToFile(dataUrl, filename) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

</script>