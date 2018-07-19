import Command from '@ckeditor/ckeditor5-core/src/command';

export default class DemoCommand extends Command {

    // Refresh is called on starting a selection or setting the cursor.
    refresh() {
        // Can depend on model if required
        // e.G. the link plugin does the following: model.schema.checkAttributeInSelection( this.editor.model.document.selection, 'linkHref' );
        // The button that belongs to this command is automatically enabled or disabled due to the following binding:
        // view.bind('isEnabled').to(demoCommand, 'isEnabled'); --> See demoui.addButton
        this.isEnabled = true;
    }

    // this method is called if the command is executed by calling:
    // editor.execute('demoCommand', actionsView.textBoxView.inputView.element.value);
    execute(inputValue) {
        console.log('entered text: ' + inputValue);
    }
}
