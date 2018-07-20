import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import DemoUi from './demoui';
import Editing from './editing';

export default class Demo extends Plugin {

    static get requires() {
        return [Editing, DemoUi];
    }

    static get pluginName() {
        return 'Demo';
    }
}
