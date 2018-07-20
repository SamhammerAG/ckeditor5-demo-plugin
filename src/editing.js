import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { downcastAttributeToElement } from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import { upcastElementToAttribute } from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';

export default class Editing extends Plugin {

    init() {
        // Allow link attribute on all inline nodes.
        this.editor.model.schema.extend('$text', { allowAttributes: 'internalLinkId' });

        // On loading html data to the editor html tags are converted to
        // the configured attribute (internal data structure of ckeditor)
        this.editor.conversion.for('upcast')
            .add(upcastElementToAttribute({
                view: {
                    name: 'internalLink', // The html tag
                    attributes: {
                        linkedId: true
                    }
                },
                model: {
                    key: 'internalLinkId', // The internal attribute name
                    value: viewElement => viewElement.getAttribute('linkedId')
                }
            }));

        // Retrieving the data from the editor.
        // This converts the internal data structure with the attribute to a regular
        // internalLink tag.
        this.editor.conversion.for('dataDowncast')
            .add(downcastAttributeToElement({ model: 'internalLinkId', view: this.createLinkElement }));


        // Rendering the editor content to the user for editing.
        // This process takes place for the entire time when the editor is initialized / refreshed
        this.editor.conversion.for('editingDowncast')
            .add(downcastAttributeToElement({ model: 'internalLinkId', view: (linkedId, writer) => { return this.createLinkElement(linkedId, writer); } }));
    }

    createLinkElement(linkedId, writer) {
        let linkElementSymbol = Symbol('linkElement');

        const linkElement = writer.createAttributeElement('internalLink', { linkedId }, { priority: 5 });
        writer.setCustomProperty(linkElementSymbol, true, linkElement);

        return linkElement;
    }
}
