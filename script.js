class Model {
    static operativeCode = '';
    static calculateFlexibleSize(width1, width2, value1, value2) {
        const x = (value1 - value2) / (width1 / 100 - width2 / 100);
        const pixels = value1 - (x * width1 / 100);
        return [parseFloat(x.toFixed(3)), parseFloat(pixels.toFixed(3))];
    }
    static generateFlexibleCode(x, pixels) {
        this.operativeCode = `calc(${x}vw + ${pixels}px)`;
        return this.operativeCode;
    }
}
class View {
    static inputs = ['width1', 'width2', 'value1', 'value2'];
    static init() {
        this.getElement('delete').addEventListener('click', () => this.clear());
        this.getElement('run').addEventListener('click', () => Controller.run());
        this.getElement('copy').addEventListener('click', () => Controller.copy());
        for (let domId of this.inputs) {
            this.getElement(domId).addEventListener('change', () => Controller.run());
            this.getElement(`${domId}-drop`).addEventListener('click', () => View.clearInput(domId));
        }
    }
    static getElement(domId) {
        return window.document.getElementById(domId);
    }
    static getInputValue(domId) {
        return this.getElement(domId).value;
    }
    static getValues() {
        const table = {};
        for (let domId of this.inputs) {
            table[domId] = this.getInputValue(domId);
        }
        return table;
    }
    static clearInput(domId) {
        this.getElement(domId).value = '';
    }
    static clear() {
        for (let domId of this.inputs) {
            this.clearInput(domId);
        }
    }
    static answer(text) {
        this.getElement('answer').textContent = text;
    }
    static warnVoid() {
        for (let domId of this.inputs) {
            const input = this.getElement(domId);
            if (input.value === '') {
                input.parentNode.parentNode.style.backgroundColor = '#38191c';
                return 'voidPresent';
            } else {
                input.parentNode.parentNode.style.backgroundColor = '#192e38';
            }
        }
    }
}
class Controller {
    static init() {
        View.init();
    }
    static calculate() {
        const table = View.getValues();
        const credentials = Model.calculateFlexibleSize(table['width1'], table['width2'], table['value1'], table['value2']);
        View.answer(Model.generateFlexibleCode(...credentials));

    }
    static async copy() {
        const type = 'text/plain';
        const blob = new Blob([Model.operativeCode], { type });
        const data= [new ClipboardItem({ [type]: blob })];
        View.answer('calc()');
        await navigator.clipboard.write(data);
    }
    static run() {
        if (View.warnVoid() === 'voidPresent') {
            View.answer('calc()');
        } else {
            this.calculate();
        }
    }
}
function start() {
    console.log('Loaded');
    Controller.init();
}
window.addEventListener('load', start);