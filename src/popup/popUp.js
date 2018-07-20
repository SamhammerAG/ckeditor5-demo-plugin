import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import PopUpView from './popUpView';
import CKEditorError from '@ckeditor/ckeditor5-utils/src/ckeditorerror';

export default class PopUp extends Plugin {

	static get pluginName() {
		return 'PopUp';
	}

	init() {
		/**
		 * The common popup panel view.
		 *
		 * @readonly
		 * @member {module:ui/panel/balloon/PopUpView~PopUpView} #view
		 */
		this.view = new PopUpView();

		/**
		 * Stack of the views injected into the popup. Last one in the stack is displayed
		 * as a content of {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon#view}.
		 *
		 * @private
		 * @member {Map} #_stack
		 */
		this._stack = new Map();

		// Add balloon panel view to editor `body` collection and wait until view will be ready.
		this.editor.ui.view.body.add( this.view );

		// Editor should be focused when contextual balloon is focused.
		this.editor.ui.focusTracker.add( this.view.element );
	}

	/**
	 * Returns the currently visible view or `null` when there are no
	 * views in the stack.
	 *
	 * @returns {module:ui/view~View|null}
	 */
	get visibleView() {
		const item = this._stack.get( this.view.content.get( 0 ) );

		return item ? item.view : null;
	}

	/**
	 * Returns `true` when the given view is in the stack. Otherwise returns `false`.
	 *
	 * @param {module:ui/view~View} view
	 * @returns {Boolean}
	 */
	hasView( view ) {
		return this._stack.has( view );
	}

	/**
	 * Adds a new view to the stack and makes it visible.
	 *
	 * @param {Object} data Configuration of the view.
	 * @param {module:ui/view~View} [data.view] Content of the balloon.
	 * @param {module:utils/dom/position~Options} [data.position] Positioning options.
	 * @param {String} [data.balloonClassName] Additional css class for {@link #view} added when given view is visible.
	 */
	add( data ) {
		if ( this.hasView( data.view ) ) {
			/**
			 * Trying to add configuration of the same view more than once.
			 *
			 * @error contextualballoon-add-view-exist
			 */
			throw new CKEditorError( 'contextualballoon-add-view-exist: Cannot add configuration of the same view twice.' );
		}

		// When adding view to the not empty balloon.
		if ( this.visibleView ) {
			// Remove displayed content from the view.
			this.view.content.remove( this.visibleView );
		}

		// Add new view to the stack.
		this._stack.set( data.view, data );

		// And display it.
		this._show( data );
	}

	/**
	 * Removes the given view from the stack. If the removed view was visible,
	 * then the view preceding it in the stack will become visible instead.
	 * When there is no view in the stack then balloon will hide.
	 *
	 * @param {module:ui/view~View} view A view to be removed from the balloon.
	 */
	remove( view ) {
		if ( !this.hasView( view ) ) {
			/**
			 * Trying to remove configuration of the view not defined in the stack.
			 *
			 * @error contextualballoon-remove-view-not-exist
			 */
			throw new CKEditorError( 'contextualballoon-remove-view-not-exist: Cannot remove configuration of not existing view.' );
		}

		// When visible view is being removed.
		if ( this.visibleView === view ) {
			// We need to remove it from the view content.
			this.view.content.remove( view );

			// And then remove from the stack.
			this._stack.delete( view );

			// Next we need to check if there is other view in stack to show.
			const last = Array.from( this._stack.values() ).pop();

			// If it is some other view.
			if ( last ) {
				// Just show it.
				this._show( last );
			} else {
				// Hide the balloon panel.
				this.view.hide();
			}
		} else {
			// Just remove given view from the stack.
			this._stack.delete( view );
		}
	}

	/**
	 * Sets the view as a content of the popup and attaches popup using position
	 * options of the first view.
	 *
	 * @private
	 * @param {Object} data Configuration.
	 * @param {module:ui/view~View} [data.view] View to show in the popup.
	 * @param {String} [data.balloonClassName=''] Additional class name which will added to the view.
	 */
	_show( { view, balloonClassName = '' } ) {
		this.view.className = balloonClassName;

        this.view.content.add( view );
        this.view.show();
	}
}
