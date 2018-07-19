import View from '@ckeditor/ckeditor5-ui/src/view';
import Template from '@ckeditor/ckeditor5-ui/src/template';

export default class ContainverView extends View {
    constructor(locale) {
        super(locale);

        this.template = new Template( {
			tag: 'div'
		} );
    }
}
