import { InputCheckWidget } from './InputCheckWidget.js';
import { InputRadioWidget } from './InputRadioWidget.js';
import { InputSelectWidget } from './InputSelectWidget.js';
import { InputTextWidget } from './InputTextWidget.js';


export class InputWidget {
    constructor(node) {
        this.node = node;
    }

    toFlutter() {
        console.log('---------input---------', this.node.field);

        switch (this.node.field) {
            case 'text':
                return new InputTextWidget(this.node).toFlutter();
            case 'select':
                return new InputSelectWidget(this.node).toFlutter();
            case 'check':
                return new InputCheckWidget(this.node).toFlutter();
            case 'radio':
                return new InputRadioWidget(this.node).toFlutter();
            default:
                return `// Unsupported widget type: ${this.node?.field}`;
        }
    }
}