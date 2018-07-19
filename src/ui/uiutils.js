import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

/**
* Creates a button view.
*
* @public
* @param {String} label The button label.
* @param {String} icon The button's icon.
* @param locale The editors locale.
* @param {String} className The additional button CSS class name.
* @param {String} [eventName] An event name that the `ButtonView#execute` event will be delegated to.
* @returns {module:ui/button/buttonview~ButtonView} The button view instance.
*/
export function createButton(label, icon, locale, className, eventName) {
    const button = new ButtonView(locale);

    button.set({
        label,
        icon,
        tooltip: true
    });

    button.extendTemplate({
        attributes: {
            class: className
        }
    });

    return button;
}

/**
 * Helps cycling over {@link #_focusables} in the view.
 *
 * @public
 * @param {module:ui/viewcollection~ViewCollection} focusables The focusables
 * @param {module:utils/focustracker~FocusTracker} focusTracker The focus tracker
 * @param {module:utils/keystrokehandler~KeystrokeHandler} keystrokes The keystrokes
 * @returns {module:ui/focuscycler~FocusCycler}
 */
export function createFocusCycler(focusables, focusTracker, keystrokes) {

    return new FocusCycler({
        focusables: focusables,
        focusTracker: focusTracker,
        keystrokeHandler: keystrokes,
        actions: {
            // Navigate fields backwards using the Shift + Tab keystroke.
            focusPrevious: 'shift + tab',

            // Navigate fields forwards using the Tab key.
            focusNext: 'tab'
        }
    });
}

/**
 * Registers the focusable views to focusable and focus tracker.
 *
 * @public
 */
export function registerFocusableViews(childViews, focusables, focusTracker) {
    childViews.forEach(v => {
        // Register the view as focusable.
        focusables.add(v);

        // Register the view in the focus tracker.
        focusTracker.add(v.element);
    });
}
