const { CompositeDisposable, Range } = require("atom")
const SequentialNumberView = require("./sequential-creator-view")

const SIMULATE_CURSOR_LENGTH = 5

module.exports = {
  activate() {
    this.view = new SequentialNumberView
    this.view.on("blur", () => this.close())
    this.view.on("change", value => this.simulate(value))
    this.view.on("done", value => this.exec(value))
    this.previousFocused
    this.subscriptions = new CompositeDisposable
    this.subscriptions.add(atom.commands.add("atom-workspace", {"sequential-creator:open": () => this.open()}))
    return this.subscriptions.add(atom.commands.add("atom-workspace", {"sequential-creator:close": () => this.close()}))
  },

  deactivate() {
    this.subscriptions.dispose()
    return this.view.destroy()
  },

  serialize() {},

  open() {
    if (!this.view.isVisible()) {
      return this.view.show()
    }
  },

  close() {
    this.view.hide()
    return atom.views.getView(atom.workspace).focus()
  },

  simulate(value) {
    const result = this.parseValue(value)
    let text = ""

    if (result !== null) {
      const simulateList = __range__(0, SIMULATE_CURSOR_LENGTH - 1, true).map(index => {
        return this.calculateValue(index, result)
      })
      simulateList.push("...")
      text = simulateList.join(", ")
    }

    return this.view.setSimulatorText(text)
  },

  exec(value) {
    const editor = this.getEditor()
    const result = this.parseValue(value)

    if (result !== null) {
      editor.transact( () => {
        const {
          length
        } = editor.cursors
        return (() => {
          const result1 = []
          for (let index = 0, end = length, asc = 0 <= end; asc ? index < end : index > end; asc ? index++ : index--) {
            let cursors = editor.cursors.slice()
            cursors = cursors.map(cursor => cursor.selection.getBufferRange())
            const range = cursors[index]
            result1.push(editor.setTextInBufferRange(new Range(range.start, range.end), this.calculateValue(index, result)))
          }
          return result1
        })()
      })
    }

    return this.close()
  },

  getEditor() {
    return atom.workspace.getActivePane().activeItem
  },

  parseValue(input) {
    const matches = `${input}`.match(/^([+\-]?[\da-zA-Z]+(?:\.\d+)?)\s*([+\-]|(?:\+\+|\-\-))?\s*(\d+)?\s*(?:\:\s*(\d+))?\s*(?:\:\s*([\daA]+))?( *\/ *(\d+))?$/)
    if (matches === null) { return null }

    let radix = matches[5]
    radix = radix !== undefined ? radix : 10
    radix = /\d+/.test(radix) ? parseInt(radix, 10) : radix
    const isAlphaRadix = /[aA]/.test(radix)

    let start = matches[1]
    if (isAlphaRadix && /\d+/.test(start)) { return null }

    start = isAlphaRadix ? start : parseInt(start, radix)

    const operator = matches[2] || "+"
    let step = parseInt(matches[3], 10)
    step = isNaN(matches[3]) ? 1 : step

    const _digit = parseInt(matches[4], 10)
    let digit = `${start}` === matches[1] ? 0 : matches[1].length
    digit = /^[+\-]/.test(matches[1]) ? Math.max(digit - 1, 0) : digit
    digit = isNaN(_digit) ? digit : _digit

    const repeat = matches[7] ? parseInt(matches[7], 10) : 1
    if (repeat === 0) { return null }

    return {start, digit, operator, step, radix, input, repeat}
  },

  calculateValue(index, args) {
    if (/[aA]/.test(args.radix)) {
      return this.calculateAlphaValue(index, args)
    } else {
      return this.calculateNumberValue(index, args)
    }
  },

  calculateNumberValue(index, {start, digit, operator, step, radix, input, repeat}) {
    index = parseInt(index/repeat)

    let value
    const _start = parseInt(start, 10)

    switch (operator) {
      case "++": value = _start + index; break
      case "--": value = _start - index; break
      case "+": value = _start + (index * step); break
      case "-": value = _start - (index * step); break
      default: return ""
    }

    if (isNaN(value)) {
      return ""
    }

    value = this.zeroPadding(value, digit, radix)
    const firstAlpha = input.match(/([a-fA-F])/)

    if (firstAlpha) {
      value = value[firstAlpha[1] === firstAlpha[1].toLowerCase() ? "toLowerCase" : "toUpperCase"]()
    }

    return value
  },

  calculateAlphaValue(index, {start, digit, operator, step, radix, input, repeat}) {
    index = parseInt(index/repeat)

    let count
    switch (operator) {
      case "++": count = (index - 1) + step; break
      case "--": count = (index - 1) - step; break
      case "+": count = index * step; break
      case "-": count = index * step * -1; break
    }

    let value = this.alphaSequence(start.toLowerCase(), count)
    value = this.leftPadding(value, digit, "a")

    if (/[A-Z]/.test(start) || /[A-Z]/.test(radix)) {
      value = value.toUpperCase()
    }

    return value
  },

  alphaSequence(str, count) {
    if (count === 0) { return str }

    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")
    const last = str.slice(-1)
    const index = alphabet.indexOf(last)
    const n = Math.floor((index + count) / alphabet.length)
    const next = alphabet[(index + count) % alphabet.length]

    if (!next) { return "" }

    let s = `${str.slice(0, str.length - 1)}${next}`

    if (n > 0) {
      if ((s.length === 1) && (index === (alphabet.length - 1))) {
        s = `a${s}`
      } else {
        s = `${this.alphaSequence(s.slice(0, s.length - 1), n)}${next}`
      }
    }

    return s
  },

  leftPadding(str, digit, padString) {
    const _digit = Math.max(str.length, digit)
    return (Array(_digit).join(padString) + str).slice(_digit * -1)
  },

  zeroPadding(number, digit, radix) {
    if (digit == null) { digit = 0 }
    if (radix == null) { radix = 10 }
    const num = number.toString(radix)
    const numAbs = num.replace("-", "")
    const positive = num.indexOf("-") < 0
    return (positive ? "" : "-") + this.leftPadding(numAbs, digit, "0")
  }
}

function __range__(left, right, inclusive) {
  let range = []
  let ascending = left < right
  let end = !inclusive ? right : ascending ? right + 1 : right - 1
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i)
  }
  return range
}
