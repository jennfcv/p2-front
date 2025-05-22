import { ScaffoldWidget } from './widgets/ScaffoldWidget.js';

export class WidgetFactory {
    static generateAll(rootNode) {
        if (!rootNode || rootNode.type !== 'root' || !Array.isArray(rootNode.children)) {
            return '// Invalid root node';
        }

        const screens = rootNode.children;

        return screens
            .map((screenNode) => WidgetFactory.generateScreen(screenNode))
            .join('\n\n');
    }

    static generateScreen(node) {
        if (!node || node.type !== 'scaffold') {
            return `// Skipping unsupported screen type: ${node?.type ?? 'unknown'}`;
        }

        const screen = new ScaffoldWidget(node);
        return screen.toFlutter();
    }
}