<template>
  <div v-if="tituloProyecto">
    <h3>Proyecto: {{ tituloProyecto }}</h3>
  </div>

  <div v-if="esAnfitrion">
    <p>es anfitrion</p>
  </div>
  <div v-else>
    <p>es colaborador</p>
  </div>

  <div v-if="esAnfitrion" class="mb-3 d-flex gap-2">
    <input v-model="colaborador" placeholder="Usuario a invitar" class="form-control w-auto" />
    <button @click="unirse" class="btn btn-outline-primary">Unir usuario</button>
  </div>

  <!-- Acciones rápidas -->
  <div class="d-flex flex-wrap gap-2 mb-3">
    <button @click="addText()">Text</button>
    <button @click="addinputNode('input', { x: 130, y: 35 })">Input Básico</button>
    <button @click="deleteNode" class="btn btn-outline-danger">Eliminar</button>
  </div>

  <!-- Layouts disponibles -->
  <div class="d-flex flex-wrap gap-2 mb-4">
    <button @click="addLayoutNode('container', { x: 300, y: 500 },'#a6e482')">Container</button>
    <button @click="addLayoutNode('padding', { x: 100, y: 100 },'#ead1dc')">Padding</button>
    <button @click="addLayoutNode('listview', { x: 300, y: 500 }, '#f7de95')">ListView</button>
    <button @click="addLayoutNode('center', { x: 100, y: 100 }, '#8ebbda')">Center</button>
    <button @click="addLayoutNode('row', { x: 100, y: 100 },'#f49d9d')">Row</button>
    <button @click="addLayoutNode('column', { x: 100, y: 100 }, '#ff9c00')">Column</button>
    <button @click="addLayoutNode('sizedBox', { x: 100, y: 100 },'#b4a7d6')">SizedBox</button>
    <button @click="addLayoutNode('flexible', { x: 100, y: 100 }, '#c10a0a')">Flexible</button>
    <button @click="addLayoutNode('card', { x: 100, y: 100 },'#8fce00')">Card</button>
    <button @click="addLayoutNode('expanded', { x: 100, y: 100 },'#96ceb4')">Expanded</button>
    <button @click="addLayoutNode('grid', { x: 100, y: 100 },'#ffcc5c')">Grid</button>
    <button @click="addLayoutNode('input', { x: 100, y: 100 },'#ff79c2')">Input Avanzado</button>
    <button @click="addLayoutNode('scaffold', { x: 360, y: 620 })">Scaffold</button>

    <button @click="limpiarLienso()">Limpiar lienzo</button>
    <!-- <button @click="addLayoutNode('scaffold', { x: 360, y: 620 })">Scaffold</button> -->


  </div>

  <!-- Generar código Dart -->
  <div class="my-2">
    <button @click="generarPaquete()" class="btn btn-outline-secondary">Generar Código Dart</button>
  </div>

  <!-- Prompt IA -->
  <div class="input-group mt-4">
    <input
      v-model="prompt"
      placeholder="Describe lo que deseas generar"
      class="form-control"
    />
    <button @click="generarYAgregarJson" class="btn btn-success">
      Generar por Prompt IA
    </button>
  </div>

  <!-- OCR IA -->
  <div class="input-group mt-3">
    <input type="file" @change="procesarImagenOCR" accept="image/*" class="form-control" />
    <button @click="enviarImagenOCR" class="btn btn-primary">
      Generar por Imagen (OCR)
    </button>
  </div>
  <div class="input-group mt-3">
    <button @click="example" class="btn btn-primary">
      example
    </button>
  </div>
  <p class="mt-2"><strong>Nodo seleccionado:</strong> {{ selectedNode?.type }}{{ selectedNode?.key }}</p>

  <!-- Área de trabajo -->
  <div class="container-fluid mt-4">
    <div class="row">
      <div class="col-1 p-3 bg-light">
        <ContainerWidget v-if="selectedNode?.type === 'container'" />
        <PaddingWidget v-if="selectedNode?.type === 'padding'" />
        <Scaffold v-if="selectedNode?.type === 'scaffold'" />
        <RowWidget v-if="selectedNode?.type === 'row'" />
        <ColumnWidget v-if="selectedNode?.type === 'column'" />
        <DrawerWidget v-if="selectedNode?.type === 'drawer'" />
        <SizedBoxWidget v-if="selectedNode?.type === 'sizedBox'" />
        <CardWidget v-if="selectedNode?.type === 'card'" />
        <GridWidget v-if="selectedNode?.type === 'grid'" />
        <InputWidget v-if="selectedNode?.type === 'input'" />
        <FloattingWidget v-if="selectedNode?.type === 'circle'" />
      </div>
      <div class="col-2">
        <pre>{{ arbolComoTexto }}</pre>
      </div>
      <div class="col-9 p-3 bg-light">
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
import { armarArbolConDatos, generarScaffoldWidgets } from "@/class/convertir/DartCode.js";

//componsable
import { useDiagram } from '../composables/useDiagram.js';
import { useTree } from '../composables/useTree.js';


import ContainerWidget from "@/components/widgets/layout/ContainerWidget.vue";
import PaddingWidget from "@/components/widgets/layout/PaddingWidget.vue";
import Scaffold from "@/components/widgets/composition/scaffoldWidget.vue";
import DrawerWidget from "@/components/widgets/composition/drawerWidget.vue";
import RowWidget from "@/components/widgets/layout/RowWidget.vue";
import ColumnWidget from "@/components/widgets/layout/ColumnWidget.vue";
import SizedBoxWidget from "@/components/widgets/layout/SizedBoxWidget .vue";
import CardWidget from "@/components/widgets/layout/CardWidget.vue";
import GridWidget from "@/components/widgets/layout/GridWidget.vue";
import InputWidget from "@/components/widgets/layout/InputWidget.vue";
import FloattingWidget from "@/components/widgets/layout/FloattingWidget.vue";
import JSZip from 'jszip';

//componentes
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
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
const prompt = ref("");
const coloresPorTipo = {
  container: '#a6e482',
  padding: '#ead1dc',
  listview: '#f7de95',
  center: '#8ebbda',
  row: '#f49d9d',
  column: '#ff9c00',
  sizedBox: '#b4a7d6',
  flexible: '#c10a0a',
  card: '#8fce00',
  expanded: '#96ceb4',
  grid: '#ffcc5c',
  input: '#ff79c2',
  scaffold: '#a0a0a0'
};
const COMPONENTES_VALIDOS = [
  'scaffold',
  'appbar',
  'body',
  'circle',
  'drawer',
  'drawerItem',
  'drawerHeader',
  'container',
  'listview',
  'padding',
  'center',
  'row',
  'column',
  'sizedBox',
  'flexible',
  'card',
  'expanded',
  'input',
  'texto', 
];



// const selectedNode = ref({})
const { selectedNode, setSelectedNode,setEmitir, setDiagramManager } = useDiagram();
const { arbolJerarquico, agregarNuevoNodo, buscarNodoPorId, obtenerIdsRecursivos, eliminarNodoDelArbol } = useTree(selectedNode);


//computed
const arbolComoTexto = computed(() => formatearArbol(arbolJerarquico.value))

const example = () =>{
  const resultadoJson = 

  {
  "id": 0,
  "tipo": "root",
  "children": [
    {
      "id": 1,
      "tipo": "scaffold",
      "pos": "0 0",
      "size": "360 640",
      "children": [
        {
          "id": 2,
          "tipo": "body",
          "pos": "0 0",
          "size": "360 640",
          "children": [
            {
              "id": 3,
              "tipo": "column",
              "pos": "0 0",
              "size": "360 640",
              "children": [
                {
                  "id": 4,
                  "tipo": "expanded",
                  "pos": "0 0",
                  "size": "360 320",
                  "children": [
                    {
                      "id": 5,
                      "tipo": "center",
                      "pos": "0 0",
                      "size": "360 320",
                      "children": [
                        {
                          "id": 6,
                          "tipo": "texto",
                          "pos": "0 0",
                          "size": "360 24",
                          "text": "Hola Mundo"
                        }
                      ]
                    }
                  ]
                },
                {
                  "id": 7,
                  "tipo": "container",
                  "pos": "0 320",
                  "size": "360 48",
                  "children": [
                    {
                      "id": 8,
                      "tipo": "row",
                      "pos": "0 0",
                      "size": "360 48",
                      "children": [
                        {
                          "id": 9,
                          "tipo": "texto",
                          "pos": "16 12",
                          "size": "100 24",
                          "text": "Izquierda"
                        },
                        {
                          "id": 10,
                          "tipo": "texto",
                          "pos": "244 12",
                          "size": "100 24",
                          "text": "Derecha"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

 
  arbolJerarquico.value = resultadoJson;
  convertirJsonJerarquicoADiagrama(resultadoJson);
}



const limpiarLienso = () =>{
    diagramManager.clearDiagram()
    arbolJerarquico.value = {    id: 0,
    tipo: 'root',
    children: []}
}
// const convertirJsonJerarquicoADiagrama = (nodo) => {
//   if (!nodo || !nodo.tipo) return;

//   const [x, y] = nodo.pos ? nodo.pos.split(' ').map(Number) : [0, 0];
//   const pos = { x, y };
//   const [w, h] = nodo.size ? nodo.size.split(' ').map(Number) : [100, 100];
//   const size = { x: w, y: h };
//   const colorPorDefecto = coloresPorTipo[nodo.tipo] || '#cccccc';

//   // Ignorar el root
//   if (nodo.tipo !== 'root') {
//     if (nodo.tipo === 'input' || nodo.tipo === 'appBar') {

//       diagramManager.addRectangleTextNode(nodo.tipo, size,  nodo.text || nodo.field || 'input', pos);
//       const json = diagramManager.saveDiagram();
//       emitir(json);

//       // addinputNode(nodo.tipo, size, nodo.text || nodo.field || 'input', pos);
//     } else if (nodo.tipo === 'texto' || nodo.tipo === 'text' || nodo.tipo === 'label') {
      
      
//       diagramManager.addTextNode(nodo.tipo, nodo.text || 'Nuevo Texto');
//       const json = diagramManager.saveDiagram();
//       emitir(json);

//       // addText(nodo.tipo, nodo.text || 'Nuevo Texto');
//     } else if (COMPONENTES_VALIDOS.includes(nodo.tipo)) {

//       diagramManager.addLayout(nodo.tipo, size,pos,colorPorDefecto);
//       const json = diagramManager.saveDiagram();
//       emitir(json);

//       // addLayoutNode(nodo.tipo, size, colorPorDefecto, pos);
//     } else {
//       console.warn('Tipo de componente no reconocido:', nodo.tipo);
//     }
//   }

//   // Procesar hijos
//   if (Array.isArray(nodo.children)) {
//     nodo.children.forEach(child => convertirJsonJerarquicoADiagrama(child));
//   }
// };


async function generarYAgregarJson() {
  try {
    // const resultadoJson = await generarJsonDesdePrompt(prompt.value);


    // Si quieres, puedes limpiar el diagrama antes
    // limpiarDiagrama();
    console.log(prompt.value);
    
    // arbolJerarquico.value = resultadoJson;
    // convertirJsonJerarquicoADiagrama(resultadoJson);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

async function generarJsonDesdePrompt(prompt) {
  if (!prompt || prompt.trim() === '') {
    throw new Error('El prompt está vacío');
  }

  const instrucciones = `
Quiero que generes un JSON estructurado siguiendo estas especificaciones. La respuesta siempre debe ser SOLO el JSON. No escribas explicaciones, no escribas introducción, no cierres con conclusiones. SOLO genera el JSON correspondiente.

Formato del JSON:

La estructura es jerárquica. Cada nodo tiene:

"id": número entero único (incremental)
"tipo": uno de los componentes válidos (ver lista abajo)
"pos": posición X Y como string "x y"
"size": tamaño WIDTH HEIGHT como string "w h"
"children": arreglo de nodos hijos
"text" (opcional): solo si es tipo texto, input, select, check o radio
"field" (obligatorio si es input): text, select, check o radio
"opciones" (obligatorio si es select o radio): array de strings
"redirige" (solo en tipo circle): puede ser null o scaffold{id} indicando a cuál scaffold redirige

Lista de componentes válidos para "tipo":

scaffold
appbar
body
circle (es un FloatingActionButton)
drawer
drawerItem
drawerHeader
container
listview
padding
center
row
column
sizedBox
flexible
card
expanded
input (requiere "field")
texto

Reglas específicas:
Siempre debe comenzar con un nodo raíz con "tipo": "root" y "id": 0. "children" contiene de 1 a N scaffolds.
Puede haber múltiples scaffold a nivel raíz.
Cada scaffold puede contener como máximo:
Un appbar (opcional)
Un body (obligatorio si no hay drawer)
Opcionalmente un circle (FloatingActionButton) como hijo directo del scaffold
El "circle" puede tener "redirige": null o "redirige": "scaffold{id}" si redirige a otro scaffold del árbol.
Los inputs (tipo: "input") requieren obligatoriamente el campo "field", que puede ser:
"text" → "text" opcional
"select" → "text" obligatorio, "opciones" obligatorio (array de strings)
"check" → "text" obligatorio
"radio" → "text" obligatorio, "opciones" obligatorio (array de strings)
Los textos (tipo: "texto") deben tener siempre el campo "text".
Los "children" pueden contener componentes anidados de cualquier tipo válido, organizados de manera coherente como en un diseño de interfaz.
Genera estructuras extensas, realistas y completas, incluyendo listas, formularios, textos, inputs variados.
El JSON generado debe ser sintácticamente correcto.

Respuesta esperada: SOLO el JSON correspondiente. SIN texto adicional.

PROMPT DEL USUARIO:
${prompt}
  `.trim();

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o', // o gpt-4, gpt-4-turbo
      messages: [{ role: 'user', content: instrucciones }],
      temperature: 0.2
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Error al generar el JSON');
  }

  // El contenido del JSON vendrá como texto, necesitamos parsearlo
  const contenido = data.choices?.[0]?.message?.content;

  let resultadoJson;
  try {
    resultadoJson = JSON.parse(contenido);
  } catch (err) {
    console.error('Error al parsear JSON:', contenido);
    throw new Error('El contenido generado no es un JSON válido.');
  }

  return resultadoJson;
}


onMounted(async () => {
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


const generarPaquete = () => {
    console.log('paquete generado');

    const a = diagramManager.saveDiagram();
    const raw = JSON.parse(a);
    const ordernado = armarArbolConDatos(raw.nodeDataArray, arbolJerarquico.value);
    // const final = generarScaffoldWidgets(ordernado);
    console.log(generarScaffoldWidgets(ordernado));
    const code = generarScaffoldWidgets(ordernado);

    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });

    // Crear enlace para descargar
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = tituloProyecto.value + '.dart'; 
    document.body.appendChild(link);
    link.click();

    // Limpieza
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

}




const generar = () => {
  const a = diagramManager.saveDiagram();
  const raw = JSON.parse(a);
  const ordernado = armarArbolConDatos(raw.nodeDataArray, arbolJerarquico.value);
  // const final = generarScaffoldWidgets(ordernado);
  console.log(generarScaffoldWidgets(ordernado));
  
};  

const addText = (tipo = "texto", text = "Nuevo Texto") => {
    const newNodeData = diagramManager.addTextNode(tipo, text);
    agregarNodoJson(tipo, newNodeData);
    const json = diagramManager.saveDiagram();

    emitir(json);

};
const addLayoutNode = (valor, size = { x: 1160, y: 640 }, color = 'aquamarine') => {
    const newNodeData = diagramManager.addLayout(valor, size,{ x: 0, y: 0 },color);
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


const generarDesdePrompt = async () => {
  if (!prompt.value.trim()) return;

  try {
    const res = await fetch("http://localhost:3000/api/prompt/generar-desde-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt.value })
    });

    const componentes = await res.json();
    console.log("Componentes recibidos:", componentes);

    // Verificar y completar estructura básica si falta
    let scaffold = componentes.find(c => c.tipo === 'scaffold');
    let body = componentes.find(c => c.tipo === 'body');
    
    if (!scaffold) {
      scaffold = { tipo: 'scaffold', text: 'Scaffold', loc: '100 100' };
    }
    
    if (!body) {
      body = { tipo: 'body', text: 'Body', loc: '140 140' };
    }

    // Buscar contenedor principal (si no existe, creamos uno)
    let contenedor = componentes.find(c => ['column', 'row', 'container'].includes(c.tipo));
    if (!contenedor) {
      contenedor = { tipo: 'column', text: 'Contenedor', loc: '180 180' };
    }

    // Filtrar hijos (excluyendo los nodos estructurales)
    const hijos = componentes.filter(c => 
      !['scaffold', 'body', contenedor.tipo].includes(c.tipo)
    );

    // 1. Crear scaffold (nodo raíz)
    const scaffoldNode = diagramManager.addLayout(
      scaffold.tipo, 
      getPosition(scaffold.loc), 
      { x: 0, y: 0 }, 
      '#e3fcec'
    );
    agregarNodoJson(scaffold.tipo, scaffoldNode);

    // 2. Crear body (dentro de scaffold)
    const bodyNode = diagramManager.addLayout(
      body.tipo,
      getPosition(body.loc),
      { x: 0, y: 0 },
      '#f0f9ff'
    );
    diagramManager.diagram.model.setGroupKeyForNodeData(bodyNode, scaffoldNode.key);
    agregarNodoJson(body.tipo, bodyNode);

    // 3. Crear contenedor principal (dentro de body)
    const contNode = diagramManager.addLayout(
      contenedor.tipo,
      getPosition(contenedor.loc),
      { x: 0, y: 0 },
      '#fff7ed'
    );
    diagramManager.diagram.model.setGroupKeyForNodeData(contNode, bodyNode.key);
    agregarNodoJson(contenedor.tipo, contNode);

    // 4. Agregar hijos (dentro del contenedor)
    hijos.forEach((comp, i) => {
      const pos = comp.loc ? getPosition(comp.loc) : { x: 200 + i * 30, y: 220 + i * 30 };
      const nodo = diagramManager.addLayout(
        comp.tipo,
        pos,
        { x: 0, y: 0 },
        '#f4f4f5'
      );
      
      diagramManager.diagram.model.setGroupKeyForNodeData(nodo, contNode.key);
      agregarNodoJson(comp.tipo, nodo);
    });

    // Actualizar vista y emitir cambios
    diagramManager.diagram.requestUpdate();
    const json = diagramManager.saveDiagram();
    emitir(json);

  } catch (err) {
    console.error("Error al generar desde prompt:", err);
  }
};

// Helper para parsear coordenadas
function getPosition(locStr) {
  if (!locStr) return { x: 0, y: 0 };
  const [x, y] = locStr.split(' ').map(Number);
  return { x: x || 0, y: y || 0 };
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