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

        // This event can be handled outside
        // e.g.: editor.on('demoEvent', (event, data) => { console.log('Yeah, the demo event is working: ' + data.inputValue); });
        this.editor.fire('demoEvent', { inputValue })

        // Ckeditor is using an internal data structure: https://docs.ckeditor.com/ckeditor5/latest/framework/guides/architecture/editing-engine.html
        // If you want to generate a specific tag you just have to set an Attribute and write conversion logic.
        // See also:
        // this.editor.conversion.for( 'dataDowncast' )
        // this.editor.conversion.for('editingDowncast')
        // this.editor.conversion.for('upcast')
        this.editor.model.change( writer => {
            for ( const range of this.editor.model.document.selection.getRanges() ) {
                writer.setAttribute( 'internalLinkId', inputValue, range );
            }
        } );
    }
}
