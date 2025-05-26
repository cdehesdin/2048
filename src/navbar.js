document.querySelector(`header > a.responsive`).addEventListener("click", () => {
    document.querySelector(`header > nav`).classList.remove("hiddenResponsive")
})
document.querySelector(`header > nav div.responsive`).addEventListener("click", () => {
    document.querySelector(`header > nav`).classList.add("hiddenResponsive")
})