document.addEventListener("DOMContentLoaded", () => {
    const favoriteButtons = document.querySelectorAll(".favoriteButton");
    favoriteButtons.forEach(async (btn) => {
        const favorite_id = btn.dataset.favoriteId;
        const response = await fetch("/favorite/btn-text/" + favorite_id, {
            method: "get",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        if (data.favorite) {
            btn.textContent = "Remove from favorite users";
        } else {
            btn.textContent = "Add to favorite users";
        }
        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            const response = await fetch("/favorite/toggle", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ favoriteId: favorite_id })
            });
            const data = await response.json();

            const allButtons = document.querySelectorAll(`.favoriteButton[data-favorite-id="${favorite_id}"]`);
            allButtons.forEach((button) => {
const btnText = data.favorite ? "Remove from favorite users" : "Add to favorite users"; 
button.textContent=btnText;
            });
        });
    });
})