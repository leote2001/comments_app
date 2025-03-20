document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.querySelector("#submitBtn");
    const pLength = document.querySelector("#p-length");
    const textArea = document.querySelector("#content");
    const maxCharacters = 180;
    pLength.textContent=`${textArea.value.length}/${maxCharacters}`;
    pLength.className="text-success";
    textArea.addEventListener("input", () => {
        pLength.textContent=`${textArea.value.length}/${maxCharacters}`;
        if (textArea.value.length < maxCharacters && textArea.value.length > 0) {
            submitBtn.disabled=false;
        pLength.className="text-success";
        } else {
            submitBtn.setAttribute("disabled", "");
            pLength.className="text-danger";
        }
    })
})