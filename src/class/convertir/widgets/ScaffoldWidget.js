import { WidgetFactory } from '../widgets.js';
import { AppBarWidget } from './AppBarWidget.js';
import { BodyWidget } from './BodyWidget.js';
import { FloatingButtonWidget } from './FloatingButtonWidget.js';


export class ScaffoldWidget {
  constructor(node) {
    this.node = node;
  }

  toFlutter() {
    const screenName = `${this.node.type}${this.node.key ?? ''}`;

    const appBarNode = this.node.children?.find(child => child.type === 'appbar');
    const bodyNode = this.node.children?.find(child => child.type === 'body');
    const fabNode = this.node.children?.find(child => child.type === 'circle');
    const drawerNode = this.node.children?.find(child => child.type === 'drawer');


    // console.log('------->>',bodyNode);
    

    const appBar = appBarNode ? `appBar: ${WidgetFactory.generate(appBarNode)},` : '';
    const body = bodyNode ? `body: ${WidgetFactory.generate(bodyNode)}` : '';
    const drawer = drawerNode ? `drawer: ${WidgetFactory.generate(drawerNode)},` : '';
    const fab = fabNode ? `floatingActionButton: ${WidgetFactory.generate(fabNode)}` : '';


    return `// ===== ${screenName} =====
Scaffold(
  ${appBar}
  ${body}
  ${fab}
  ${drawer}
)`;
  }
}
