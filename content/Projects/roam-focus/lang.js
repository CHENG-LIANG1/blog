(function () {
  function applyLanguagePreference() {
    try {
      var zhInput = document.getElementById("rf-lang-zh")
      var enInput = document.getElementById("rf-lang-en")
      if (!(zhInput instanceof HTMLInputElement) || !(enInput instanceof HTMLInputElement)) return

      if (!zhInput.checked && !enInput.checked) {
        zhInput.checked = true
      }

      var languageCandidates =
        Array.isArray(navigator.languages) && navigator.languages.length > 0
          ? navigator.languages
          : [navigator.language]

      var normalized = languageCandidates
        .filter(function (value) {
          return typeof value === "string" && value.trim().length > 0
        })
        .map(function (value) {
          return value.toLowerCase()
        })

      var isZh = normalized.some(function (value) {
        return value.indexOf("zh") === 0
      })
      var isEn = normalized.some(function (value) {
        return value.indexOf("en") === 0
      })

      if (!isZh && isEn) {
        enInput.checked = true
        return
      }
      zhInput.checked = true
    } catch (_error) {}
  }

  applyLanguagePreference()
  document.addEventListener("nav", applyLanguagePreference)
})()
