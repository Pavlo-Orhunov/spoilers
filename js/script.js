"use strict"
// ------------- Spoilers -------------
document.addEventListener("DOMContentLoaded", () => {
  const spoilersArray = document.querySelectorAll("[data-spoilers]")

  // Add styles to hide the marker for summary inside data-spoilers
  const style = document.createElement("style")
  style.textContent = `
    [data-spoilers] summary {
      list-style-type: none;
    }
  `
  document.head.appendChild(style)

  if (spoilersArray.length > 0) {
    spoilersArray.forEach((spoilersBlock) => {
      const detailsElements = spoilersBlock.querySelectorAll("details")
      detailsElements.forEach((details) => {
        details.open = true // Set the open attribute initially
        details.addEventListener("click", (e) => e.preventDefault())
      })

      const summaryElements = spoilersBlock.querySelectorAll("summary")
      summaryElements.forEach((summary) => {
        summary.addEventListener("click", (e) => e.preventDefault())
      })
    })

    const spoilersRegular = Array.from(spoilersArray).filter(
      (item) => !item.dataset.spoilers.split(",")[0]
    )
    if (spoilersRegular.length > 0) initSpoilers(spoilersRegular)

    const spoilersMedia = Array.from(spoilersArray).filter(
      (item) => item.dataset.spoilers.split(",")[0]
    )
    if (spoilersMedia.length > 0) {
      const breakpointsArray = spoilersMedia.map((item) => {
        const [value, type = "max"] = item.dataset.spoilers
          .split(",")
          .map((param) => param.trim())
        return { value, type, item }
      })

      const mediaQueries = Array.from(
        new Set(
          breakpointsArray.map(
            ({ type, value }) => `(${type}-width: ${value}px),${value},${type}`
          )
        )
      )

      mediaQueries.forEach((breakpoint) => {
        const [query, value, type] = breakpoint.split(",")
        const matchMedia = window.matchMedia(query)

        const matchedSpoilers = breakpointsArray.filter(
          (breakpoint) => breakpoint.value === value && breakpoint.type === type
        )

        const handleChange = () => initSpoilers(matchedSpoilers, matchMedia)
        matchMedia.addListener(handleChange)
        handleChange()
      })
    }
  }

  function initSpoilers(spoilersArray, matchMedia = false) {
    spoilersArray.forEach((spoilersBlock) => {
      spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock
      if (matchMedia.matches || !matchMedia) {
        spoilersBlock.classList.add("_init")
        initSpoilerBody(spoilersBlock)
        spoilersBlock.addEventListener("click", setSpoilerAction)
      } else {
        spoilersBlock.classList.remove("_init")
        initSpoilerBody(spoilersBlock, false)
        spoilersBlock.removeEventListener("click", setSpoilerAction)
      }
    })
  }

  function initSpoilerBody(spoilersBlock, hideSpoilerBody = true) {
    const spoilerTitles = spoilersBlock.querySelectorAll("[data-spoiler]")
    spoilerTitles.forEach((spoilerTitle) => {
      spoilerTitle.tabIndex = hideSpoilerBody ? 0 : -1
      spoilerTitle.nextElementSibling.hidden =
        hideSpoilerBody && !spoilerTitle.classList.contains("_active")
    })
  }

  function setSpoilerAction(e) {
    const el = e.target.closest("[data-spoiler]")
    if (el) {
      const spoilersBlock = el.closest("[data-spoilers]")
      const oneSpoiler = spoilersBlock.hasAttribute("data-one-spoiler")
      if (!spoilersBlock.querySelector("._slide")) {
        if (oneSpoiler && !el.classList.contains("_active")) {
          hideSpoilersBody(spoilersBlock)
        }
        el.classList.toggle("_active")
        _slideToggle(el.nextElementSibling, 300)
      }
      e.preventDefault()
    }
  }

  function hideSpoilersBody(spoilersBlock) {
    const activeTitle = spoilersBlock.querySelector("[data-spoiler]._active")
    if (activeTitle) {
      activeTitle.classList.remove("_active")
      _slideUp(activeTitle.nextElementSibling, 300)
    }
  }
})

const _slideUp = (target, duration = 300) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide")
    target.style.transition = `height ${duration}ms, padding ${duration}ms, margin ${duration}ms`
    target.style.height = target.offsetHeight + "px"
    requestAnimationFrame(() => {
      target.style.overflow = "hidden"
      target.style.height = 0
      target.style.paddingTop = 0
      target.style.paddingBottom = 0
      target.style.marginTop = 0
      target.style.marginBottom = 0
    })
    setTimeout(() => {
      target.hidden = true
      target.removeAttribute("style")
      target.classList.remove("_slide")
    }, duration)
  }
}

const _slideDown = (target, duration = 300) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide")
    if (target.hidden) target.hidden = false
    const height = target.offsetHeight
    target.style.overflow = "hidden"
    target.style.height = 0
    target.style.transition = `height ${duration}ms, padding ${duration}ms, margin ${duration}ms`
    requestAnimationFrame(() => {
      target.style.height = height + "px"
    })
    setTimeout(() => {
      target.removeAttribute("style")
      target.classList.remove("_slide")
    }, duration)
  }
}

const _slideToggle = (target, duration = 300) => {
  return target.hidden
    ? _slideDown(target, duration)
    : _slideUp(target, duration)
}
// ------------- END OF Spoilers -------------
