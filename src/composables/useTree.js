import { ref } from 'vue';

const arbolJerarquico = ref({
    id: 0,
    tipo: 'root',
    children: []
});
export function useTree(externalSelectedNode) {

    const selectedNode = externalSelectedNode;

    const agregarNodoAlArbol = (nodoPadre, idPadre, nuevoNodo) => {
        if (nodoPadre.id === idPadre) {
            nodoPadre.children.push(nuevoNodo);
            return true;
        }

        for (const child of nodoPadre.children) {
            if (agregarNodoAlArbol(child, idPadre, nuevoNodo)) {
                return true;
            }
        }

        return false;
    };

    const agregarNuevoNodo = (nuevoNodo) => {
        if (!selectedNode.value) {
            arbolJerarquico.value.children.push(nuevoNodo);
        } else {
            agregarNodoAlArbol(arbolJerarquico.value, selectedNode.value.key, nuevoNodo);
        }
    };

    const eliminarNodoDelArbol = (nodoPadre, idNodoEliminar) => {
        if (!nodoPadre.children) return false;

        const index = nodoPadre.children.findIndex(child => child.id === idNodoEliminar);
        if (index !== -1) {
            nodoPadre.children.splice(index, 1);
            return true;
        }

        for (const child of nodoPadre.children) {
            if (eliminarNodoDelArbol(child, idNodoEliminar)) {
                return true;
            }
        }

        return false;
    };

    const obtenerIdsRecursivos = (nodo) => {
        const ids = [];

        const recolectar = (n) => {
            if (n.children && n.children.length > 0) {
                for (const hijo of n.children) {
                    ids.push(hijo.id);
                    recolectar(hijo); // recursivo
                }
            }
        };

        recolectar(nodo);
        return ids;
    };

    const buscarNodoPorId = (nodo, id) => {
        if (nodo.id === id) return nodo;

        if (nodo.children && nodo.children.length > 0) {
            for (const child of nodo.children) {
                const resultado = buscarNodoPorId(child, id);
                if (resultado) return resultado;
            }
        }

        return null;
    };

    const obtenerScaffoldIdsYTextos = () => {
        const lista = [];

        const recorrer = (nodo) => {
            if (nodo.tipo === 'scaffold') {
                lista.push({
                    id: nodo.id,
                    nombre: nodo.type || `Scaffold ${nodo.id}`
                });
            }

            if (nodo.children && nodo.children.length > 0) {
                for (const child of nodo.children) {
                    recorrer(child);
                }
            }
        };

        recorrer(arbolJerarquico.value);
        return lista;
    };


    return {
        arbolJerarquico,
        agregarNuevoNodo,
        obtenerIdsRecursivos,
        eliminarNodoDelArbol,
        buscarNodoPorId,
        obtenerScaffoldIdsYTextos
    };
}