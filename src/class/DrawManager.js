import * as go from 'gojs';

export class LienzoDibujoLibre {
    constructor(divId) {
        this.divId = divId;
        this.diagram = null;
        this.freehandTool = null;
        this.init();
    }

    init() {
        this.diagram = new go.Diagram(this.divId);
        this.diagram.undoManager.isEnabled = true;

        // Insertar herramienta de modificación de geometría (opcional)
        this.diagram.toolManager.mouseDownTools.insertAt(3, new GeometryReshapingTool());

        // Herramienta de dibujo libre
        this.freehandTool = new FreehandDrawingTool();
        this.freehandTool.archetypePartData = {
            stroke: 'green',
            strokeWidth: 3,
            category: 'FreehandDrawing'
        };
        this.freehandTool.isBackgroundOnly = false;
        this.diagram.toolManager.mouseMoveTools.insertAt(0, this.freehandTool);
    }

    // Activa o desactiva el modo de dibujo
    activarModoDibujo(activo) {
        if (!this.freehandTool) return;
        this.freehandTool.isEnabled = activo;
    }

    // Guardar como JSON
    guardar() {
        return JSON.stringify({
            position: go.Point.stringify(this.diagram.position),
            model: this.diagram.model.toJson()
        });
    }

    // Cargar desde JSON
    cargar(jsonStr) {
        try {
            const data = JSON.parse(jsonStr);
            this.diagram.initialPosition = go.Point.parse(data.position || '0 0');
            this.diagram.model = go.Model.fromJson(data.model);
            this.diagram.model.undoManager.isEnabled = true;
        } catch (error) {
            console.error('Error al cargar el diagrama:', error);
        }
    }
}