import { AppBarWidget } from './widgets/AppBarWidget.js';
import { BodyWidget } from './widgets/BodyWidget.js';
import { FloatingButtonWidget } from './widgets/FloatingButtonWidget.js';
import { ScaffoldWidget } from './widgets/ScaffoldWidget.js';

import { DrawerHeaderWidget } from './widgets/DrawerHeaderWidget.js';
import { DrawerItemWidget } from './widgets/DrawerItemWidget.js';
import { DrawerWidget } from './widgets/DrawerWidget.js';
import { ContainerWidget } from './widgets/ContainerWidget.js';
import { ListViewWidget } from './widgets/ListViewWidget.js';
import { PaddingWidget } from './widgets/PaddingWidget.js';
import { CenterWidget } from './widgets/CenterWidget.js';
import { RowWidget } from './widgets/RowWidget.js';
import { ColumnWidget } from './widgets/ColumnWidget.js';
import { SizedBoxWidget } from './widgets/SizedBoxWidget.js';
import { FlexibleWidget } from './widgets/FlexibleWidget.js';
import { CardWidget } from './widgets/CardWidget.js';
import { ExpandedWidget } from './widgets/ExpandedWidget.js';
import { TextWidget } from './widgets/TextWidget.js';
import { InputTextWidget } from './widgets/InputTextWidget.js';
import { InputCheckWidget } from './widgets/InputCheckWidget.js';
import { InputRadioWidget } from './widgets/InputRadioWidget.js';
import { InputSelectWidget } from './widgets/InputSelectWidget.js';
import { InputWidget } from './widgets/InputWidget.js';





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
            return `// skipping unsupported screen type: ${node?.type ?? 'unknown'}`;
        }

        const screen = new ScaffoldWidget(node);
        return screen.toFlutter();
    }


    static generate(node) {
        if (!node || typeof node.type !== 'string') {
            return '// invalid or undefined widget node';
        }

        switch (node.type) {
            case 'scaffold':
                return new ScaffoldWidget(node).toFlutter();
            case 'appbar':
                return new AppBarWidget(node).toFlutter();
            case 'body':
                return new BodyWidget(node).toFlutter();
            case 'circle':
                return new FloatingButtonWidget(node).toFlutter();
            case 'drawer':
                return new DrawerWidget(node).toFlutter();
            case 'drawerItem':
                return new DrawerItemWidget(node).toFlutter();
            case 'drawerHeader':
                return new DrawerHeaderWidget(node).toFlutter();
            case 'container':
                return new ContainerWidget(node).toFlutter();
            case 'listview':
                return new ListViewWidget(node).toFlutter();
            case 'padding':
                return new PaddingWidget(node).toFlutter();
            case 'center':
                return new CenterWidget(node).toFlutter();
            case 'row':
                return new RowWidget(node).toFlutter();
            case 'column':
                return new ColumnWidget(node).toFlutter();
            case 'sizedBox':
                return new SizedBoxWidget(node).toFlutter();
            case 'flexible':
                return new FlexibleWidget(node).toFlutter();
            case 'card':
                return new CardWidget(node).toFlutter();
            case 'expanded':
                return new ExpandedWidget(node).toFlutter();
            case 'input':
                return new InputWidget(node).toFlutter();
            case 'texto':
                return new TextWidget(node).toFlutter();


            default:
                return `// unsupported widget type: ${node.type}`;
        }
    }
}