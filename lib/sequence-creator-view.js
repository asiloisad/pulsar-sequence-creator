const { Emitter } = require('atom')
const TemplateHelper = require('./template-helper')

const ENABLE_ENTER_KEY_DELAY = 250

const modalTemplate = `\
<div class="padded">
  <atom-text-editor placeholder-text="examples: 01+2, aa+2, 1+2:0>2, 2!" mini></atom-text-editor>
  <div class="inset-panel padded">
    <span class="icon icon-terminal"></span>
    <span id="sequence-creator-simulator"></span>
  </div>
</div>\
`

module.exports = class SequentialNumberView extends Emitter {

  constructor() {
    super()
    this.modalTemplate = TemplateHelper.create(modalTemplate)
    this.element = document.createElement('div')
    this.element.classList.add('sequence-creator')
    this.element.style.fontFamily = atom.config.get('editor.fontFamily')
    this.element.appendChild(TemplateHelper.render(this.modalTemplate))
    this.textEditor = this.element.querySelector('atom-text-editor')
    this.simulator = this.element.querySelector('#sequence-creator-simulator')
    this.modalPanel = atom.workspace.addModalPanel({ item: this.element, visible: false })
    this.handleBlur = this.handleBlur.bind(this)
    this.refreshSub = null
  }

  bindEvents() {
    this.isEnableEnterKey = false
    this.isEnableEnterKeyTimer = setTimeout(() => {
      return this.isEnableEnterKey = true
    }, ENABLE_ENTER_KEY_DELAY)
    this.textEditor.addEventListener('blur', this.handleBlur, false)
    this.refreshSub = this.textEditor.getModel().onDidChange(() => { this.handleEdit() })
  }

  unbindEvents() {
    this.isEnableEnterKey = false
    clearTimeout(this.isEnableEnterKeyTimer)
    this.isEnableEnterKeyTimer = null
    this.textEditor.removeEventListener('blur', this.handleBlur, false)
    this.refreshSub.dispose() ; this.refreshSub = null
  }

  handleBlur(event) {
    if (event.relatedTarget!==null) { return this.emit('blur') }
  }

  handleEdit() {
    this.emit('change', this.getText())
  }

  handleDone() {
    this.emit('done', this.getText())
  }

  isVisible() {
    return this.modalPanel.isVisible()
  }

  show() {
    this.modalPanel.show()
    this.textEditor.focus()
    this.textEditor.getModel().selectAll()
    return this.bindEvents()
  }

  hide() {
    this.unbindEvents()
    this.modalPanel.hide()
  }

  destroy() {
    this.modalPanel.destroy()
    this.modalPanel = null
    this.element.remove()
    return this.element = null
  }

  setText(text) {
    return this.textEditor.getModel().setText(text)
  }

  getText() {
    return this.textEditor.getModel().getText()
  }

  setSimulatorText(simulateList) {
    return this.simulator.textContent = simulateList.join(', ')
  }
}
