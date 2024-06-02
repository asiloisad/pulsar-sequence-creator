const { Emitter } = require('atom')
const TemplateHelper = require("./template-helper")

const ENABLE_ENTER_KEY_DELAY = 250

const modalTemplate = `\
<div class="padded">
  <atom-text-editor placeholder-text="example) 01 + 2" mini></atom-text-editor>
  <div class="inset-panel">
    <div class="padded">
      <span class="icon icon-terminal"></span>
      <span id="sequential-creator-simulator"></span>
    </div>
  </div>
</div>\
`

module.exports = class SequentialNumberView extends Emitter {
  constructor(serializedState) {
    super()

    this.modalTemplate = TemplateHelper.create(modalTemplate)

    this.element = document.createElement("div")
    this.element.classList.add("sequential-creator")
    this.element.appendChild(TemplateHelper.render(this.modalTemplate))

    this.textEditor = this.element.querySelector("atom-text-editor")
    this.simulator = this.element.querySelector("#sequential-creator-simulator")
    this.modalPanel = atom.workspace.addModalPanel({item: this.element, visible: false})

    this.handleBlur = this.handleBlur.bind(this)
    this.handleKeyup = this.handleKeyup.bind(this)
  }

  serialize() {}

  bindEvents() {
    this.isEnableEnterKey = false
    this.isEnableEnterKeyTimer = setTimeout(() => {
      return this.isEnableEnterKey = true
    }
    , ENABLE_ENTER_KEY_DELAY)

    this.textEditor.addEventListener("blur", this.handleBlur, false)
    return this.textEditor.addEventListener("keyup", this.handleKeyup, false)
  }

  unbindEvents() {
    this.isEnableEnterKey = false
    clearTimeout(this.isEnableEnterKeyTimer)
    this.isEnableEnterKeyTimer = null

    this.textEditor.removeEventListener("blur", this.handleBlur, false)
    return this.textEditor.removeEventListener("keyup", this.handleKeyup, false)
  }

  handleBlur() {
    return this.emit("blur")
  }

  handleKeyup(e) {
    const text = this.getText()
    if (this.isEnableEnterKey && (e.keyCode === 13)) {
      return this.emit("done", text)
    } else {
      return this.emit("change", text)
    }
  }

  isVisible() {
    return this.modalPanel.isVisible()
  }

  show() {
    this.modalPanel.show()
    this.textEditor.focus()
    return this.bindEvents()
  }

  hide() {
    this.unbindEvents()
    this.modalPanel.hide()
    this.setText("")
    return this.setSimulatorText("")
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
    return this.textEditor.getModel().getText().trim()
  }

  setSimulatorText(text) {
    return this.simulator.textContent = text
  }

  getSimulatorText() {
    return this.simulator.textContent
  }
}
