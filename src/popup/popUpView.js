import View from '@ckeditor/ckeditor5-ui/src/view';

import '../../theme/popup.css';

export default class PopUpView extends View {

	constructor( locale ) {
		super( locale );

		const bind = this.bindTemplate;
		/**
		 * Controls whether the balloon panel is visible or not.
		 *
		 * @observable
		 * @default false
		 * @member {Boolean} #isVisible
		 */
		this.set( 'isVisible', false );

		/**
		 * An additional CSS class added to the {@link #element}.
		 *
		 * @observable
		 * @member {String} #className
		 */
		this.set( 'className' );

		/**
		 * A callback that starts pining the panel when {@link #isVisible} gets
		 * `true`. Used by {@link #pin}.
		 *
		 * @private
		 * @member {Function} #_pinWhenIsVisibleCallback
		 */

		/**
		 * Collection of the child views which creates balloon panel contents.
		 *
		 * @readonly
		 * @member {module:ui/viewcollection~ViewCollection}
		 */
		this.content = this.createCollection();

		this.setTemplate( {
			tag: 'div',
			attributes: {
				class: [
					'ck',
					'ck-popup-panel',
					bind.if( 'isVisible', 'ck-popup-panel_visible' ),
					bind.to( 'className' )
				]
			},

			children: this.content
		} );
	}

	/**
	 * Shows the panel.
	 *
	 * See {@link #isVisible}.
	 */
	show() {
		this.isVisible = true;
	}

	/**
	 * Hides the panel.
	 *
	 * See {@link #isVisible}.
	 */
	hide() {
		this.isVisible = false;
	}
}
