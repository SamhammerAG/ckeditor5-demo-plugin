import View from '@ckeditor/ckeditor5-ui/src/view';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';

import submitHandler from '@ckeditor/ckeditor5-ui/src/bindings/submithandler';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';

import LabeledInputView from '@ckeditor/ckeditor5-ui/src/labeledinput/labeledinputview';
import InputTextView from '@ckeditor/ckeditor5-ui/src/inputtext/inputtextview';

import ContainerView from './containerView';

import { createButton, createFocusCycler, registerFocusableViews } from './uiutils';

import checkIcon from '@ckeditor/ckeditor5-core/theme/icons/check.svg';
import cancelIcon from '@ckeditor/ckeditor5-core/theme/icons/cancel.svg';

import Awesomplete from 'awesomplete';

/**
 * View for the balloon that is visible on clicking a demo html element.
 */
export default class DemoActionsView extends View {

    constructor(locale) {
        super(locale);

        const t = locale.t;
        this.focusables = new ViewCollection();
        this.focusTracker = new FocusTracker();
        this.keystrokes = new KeystrokeHandler();
        this.focusCycler = createFocusCycler(this.focusables, this.focusTracker, this.keystrokes);

        this.textBoxView = this.createTextBoxInput();

        // The demoactionview emits a event called submit (see second line)
        this.saveButtonView = createButton(t('Save'), checkIcon, this.locale, 'ck-button-save');
        this.saveButtonView.type = 'submit';

        // The demoactionview emits a event called cancel (see second line)
        this.cancelButtonView = createButton(t('Cancel'), cancelIcon, this.locale, 'ck-button-cancel');
        this.cancelButtonView.delegate('execute').to(this, 'cancel');

        this.containerView = new ContainerView(this.locale);

        // Creates the balloon with its sub elements
        this.setTemplate({
            tag: 'form',

            attributes: {
                class: [
                    'ck',
                    'ck-link-form',
                ],

                tabindex: '-1'
            },

            children: [
                this.textBoxView,
                this.saveButtonView,
                this.cancelButtonView,
                this.containerView
            ]
        });
    }

    render() {
        super.render();

        submitHandler({
            view: this
        });

        const childViews = [
            this.textBoxView,
            this.saveButtonView,
            this.cancelButtonView,
            this.containerView
        ];

        this.initAutoComplete();

        // The two below commands are called this way in every plugin.
        // They ensure that focus is working correctly and that we can handle button clicks
        registerFocusableViews(childViews, this.focusables, this.focusTracker);
        this.keystrokes.listenTo(this.element);
    }

    focus() {
        // The two below commands are called this way in every plugin to
        // set the focus to the first input element of the balloon.
        this.focusCycler.focusFirst();
    }

    createTextBoxInput() {
        const t = this.locale.t;

        const labeledInput = new LabeledInputView(this.locale, InputTextView);

        labeledInput.label = t('Link URL');
        labeledInput.inputView.placeholder = 'A demo placeholder';

        return labeledInput;
    }

    createDropDown() {
        const t = this.locale.t;

        const labeledInput = new LabeledInputView(this.locale, InputTextView);

        labeledInput.label = t('Link URL');
        labeledInput.inputView.placeholder = 'A demo placeholder';

        return labeledInput;
    }

    initAutoComplete() {
        var input = document.createElement('input');
        input.placeholder = 'Autocomplete here';
        this.containerView.element.appendChild(input);
        new Awesomplete(input, { list: ['Vuejs', 'Npm', 'Node.js'] });
    }
}
