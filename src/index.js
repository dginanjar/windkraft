import { computePosition, flip, autoUpdate } from '@floating-ui/dom'

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.accordion').forEach((accordion) => {
    let items = accordion.querySelectorAll('.accordion-item')
    let buttons = accordion.querySelectorAll('[data-toggle=accordion]')
    let contents = accordion.querySelectorAll('.accordion-content')

    let toggleContentHeight = (index) => {
      contents[index].style.height = items[index].hasAttribute('show') ? `${contents[index].scrollHeight}px` : 0
    }

    let flush = (exclude) => {
      items.forEach((item, index) => {
        if (exclude !== index) {
          item.removeAttribute('show')
          toggleContentHeight(index)
        }
      })
    }

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        if (accordion.hasAttribute('flush')) flush(index)

        items[index].toggleAttribute('show')
        toggleContentHeight(index)
      })
    })

    contents.forEach((content, index) => {
      toggleContentHeight(index)
    })
  })

  document.querySelectorAll('.tab').forEach((tab) => {
    let buttons = tab.querySelectorAll('[data-toggle=tab]')
    let contents = tab.querySelectorAll('.tab-content')

    let toggleContentAttribute = (index) => {
      if (buttons[index].hasAttribute('show')) {
        contents[index].setAttribute('show', '')
      } else contents[index].removeAttribute('show')
    }

    let flush = (exclude) => {
      buttons.forEach((button, index) => {
        if (exclude !== index) button.removeAttribute('show')

        contents.forEach((content, index) => {
          toggleContentAttribute(index)
        })
      })
    }

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        flush(index)

        buttons[index].setAttribute('show', '')
        toggleContentAttribute(index)
      })
    })

    contents.forEach((content, index) => {
      toggleContentAttribute(index)
    })
  })

  document.querySelectorAll('.alert').forEach((alert) => {
    let toggleContentHeight = () => {
      alert.style.height = alert.hasAttribute('show') ? `${alert.scrollHeight}px` : 0
    }

    let removeAlert = () => {
      alert.removeAttribute('show')
      toggleContentHeight()
    }

    toggleContentHeight()

    if ('timer' in alert.dataset) {
      setTimeout(() => {
        removeAlert()
      }, alert.dataset.timer)
    }

    alert.querySelector('[data-dismiss=alert]').addEventListener('click', () => {
      removeAlert()
    })
  })

  document.querySelectorAll('[data-toggle=slidedown]').forEach((button) => {
    let content = button.nextElementSibling

    let toggleContentHeight = () => {
      content.style.height = button.hasAttribute('show') ? `${content.scrollHeight}px` : 0
    }

    button.addEventListener('click', () => {
      button.toggleAttribute('show')
      toggleContentHeight()
    })

    toggleContentHeight()
  })

  document.querySelectorAll('[data-toggle=dropdown]').forEach((button) => {
    let content = button.nextElementSibling

    let togglePosition = () => {
      let updatePosition = () => autoUpdate(button, content, () => {
        computePosition(button, content, {
          placement: `bottom-start`,
          middleware: [flip()]
        }).then(({ x, y }) => {
          Object.assign(content.style, {
            top: `${y}px`,
            left: `${x}px`
          })
        })
      })

      const clearPosition = updatePosition()

      if (button.hasAttribute('show')) {
        updatePosition()
      } else clearPosition()
    }

    button.addEventListener('click', () => {
      button.toggleAttribute('show')
      togglePosition()
    })

    togglePosition()

    document.addEventListener('click', (e) => {
      if (e.target !== button) {
        button.removeAttribute('show')
        togglePosition()
      }
    })
  })

  document.querySelectorAll('[data-toggle=overlay]:not([data-target=""])').forEach((button) => {
    let target = document.getElementById(button.dataset.target)
    if (target === null) return

    let backdrop = document.querySelector('.backdrop')

    let toggleBackdrop = () => {
      backdrop?.remove()

      if (target.hasAttribute('show')) {
        backdrop = document.createElement('div')
        backdrop.classList.add('backdrop', 'fixed', 'inset-0', 'bg-black/50')
        target.after(backdrop)
        backdrop.style.zIndex = window.getComputedStyle(target).zIndex - 1
      } else target.style.zIndex = null

      backdrop?.addEventListener('click', () => {
        target.removeAttribute('show')
        toggleBackdrop()
      })
    }

    button.addEventListener('click', () => {
      target.toggleAttribute('show')
      toggleBackdrop()
    })

    target.querySelector('[data-dismiss=overlay]')?.addEventListener('click', () => {
      target.removeAttribute('show')
      toggleBackdrop()
    })
  })
})