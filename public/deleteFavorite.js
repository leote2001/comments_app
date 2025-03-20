document.addEventListener("DOMContentLoaded", () => {
    const deleteForms = document.querySelectorAll(".deleteFavoriteForm");
    deleteForms.forEach((form) => {
        const favorite_id = form.favoriteId.value;
        
        form.addEventListener("submit", async () => {
            
            if (confirm("Are you sure you want to delete this favorite user?")) {
            await fetch("/favorite/delete", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ favoriteId: favorite_id})
            });
        }
        });
    });
});