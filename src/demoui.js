import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import DemoActionsView from './ui/demoactionsview';
import DemoCommand from './democommand';

import buttonIcon from './../theme/icons/button.svg';

export default class Demo extends Plugin {

    static get requires() {
        return [ContextualBalloon];
    }

    init() {
        this.addButton();

        this.editor.commands.add('demoCommand', new DemoCommand(this.editor));

        this.actionsView = this.createActionsView();
        this.balloon = this.editor.plugins.get(ContextualBalloon);
    }

    addButton() {
        const t = this.editor.t;

        this.editor.ui.componentFactory.add('demoButton', locale => {
            const view = new ButtonView(locale);

            view.set({
                label: t('Demo Action'),
                icon: buttonIcon,
                tooltip: true
            });

            // disable the button if the command is not enabled --> see democommand flag isEnabled
            const demoCommand = this.editor.commands.get('demoCommand');
            view.bind('isEnabled').to(demoCommand, 'isEnabled');

            view.on('execute', () => {
                this.showUi();

                // Always set the focus back to the editing view --> this is a best practice of ckeditor
                this.editor.editing.view.focus();
            });

            return view;
        });
    }

    showUi() {
        this.balloon.add({
            view: this.actionsView,
            // Has to be the target element or selection
            position: this.getBalloonPositionData()
        });
    }

    hideUi() {
        this.balloon.remove(this.actionsView);

        // Because the form has an input which has focus, the focus must be brought back
        // to the editor. Otherwise, it would be lost.
        this.editor.editing.view.focus();
    }

    getBalloonPositionData() {
        const view = this.editor.editing.view;
        const viewDocument = view.document;
        const targetLink = this._getSelectedLinkElement();

        const target = targetLink ?
            // When selection is inside link element, then attach panel to this element.
            view.domConverter.mapViewToDom(targetLink) :
            // Otherwise attach panel to the selection.
            view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());

        return { target };
    }

    _getSelectedLinkElement() {
        const selection = this.editor.editing.view.document.selection;

        if (selection.isCollapsed) {
            return findLinkElementAncestor(selection.getFirstPosition());
        } else {
            // The range for fully selected link is usually anchored in adjacent text nodes.
            // Trim it to get closer to the actual link element.
            const range = selection.getFirstRange().getTrimmed();
            const startLink = findLinkElementAncestor(range.start);
            const endLink = findLinkElementAncestor(range.end);

            if (!startLink || startLink != endLink) {
                return null;
            }

            // Check if the link element is fully selected.
            if (Range.createIn(startLink).getTrimmed().isEqual(range)) {
                return startLink;
            } else {
                return null;
            }
        }
    }

    createActionsView() {
        const actionsView = new DemoActionsView(this.editor.locale);

        this.listenTo(actionsView, 'submit', () => {
            // Calls the execute method of democommand and passes the value
            this.editor.execute('demoCommand', actionsView.textBoxView.inputView.element.value);
            this.hideUi();
        });

        this.listenTo(actionsView, 'cancel', () => {
            this.hideUi();
        });

        actionsView.keystrokes.set('Esc', (data, cancel) => {
            this.hideUi();
            cancel();
        });

        return actionsView;
    }
}

function findLinkElementAncestor(position) {
    return position.getAncestors().find(ancestor => isLinkElement(ancestor));
}

const linkElementSymbol = Symbol('linkElement');

function isLinkElement(node) {
    return node.is('attributeElement') && !!node.getCustomProperty(linkElementSymbol);
}
