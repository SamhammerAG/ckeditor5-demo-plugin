import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class Demo extends Plugin {

    init() {
        console.log( 'My demo plugin is initialized');

        const editor = this.editor;

        editor.ui.componentFactory.add( 'demoButton', locale => {
            const view = new ButtonView( locale );

            view.set( {
                label: 'Iconless DemoButton',
                tooltip: true
            } );

            return view;
        } );
    }

    static get pluginName() {
        return 'Demo';
    }
}
