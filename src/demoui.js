import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import buttonIcon from './../theme/icons/button.svg';

export default class Demo extends Plugin {

    init() {
        this.addButton();
    }

    addButton() {
        this.editor.ui.componentFactory.add( 'demoButton', locale => {
            const view = new ButtonView( locale );

            view.set( {
                label: 'Iconless DemoButton',
                icon: buttonIcon,
                tooltip: true
            } );

            return view;
        } );
    }
}
