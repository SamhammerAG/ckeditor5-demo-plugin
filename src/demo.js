import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import DemoUi from './demoui';

export default class Demo extends Plugin {

    static get requires() {
		return [ DemoUi ];
	}

    static get pluginName() {
        return 'Demo';
    }
}
