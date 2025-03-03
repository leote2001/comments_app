document.addEventListener("DOMContentLoaded", () => {
    const likeButtons = document.querySelectorAll(".likeButton");
    likeButtons.forEach(async (btn) => {
        const comment_id = btn.dataset.commentId;
        const response = await fetch("/get-likes/" + comment_id, {
            method: "get",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        const btnText = data.like ? `Unlike 👍${data.commentLikes}` : `Like 👍${data.commentLikes}`;
        btn.textContent = btnText;
        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            const response = await fetch("/toggle-like", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ commentId: comment_id })
            });
            const data = await response.json();
            const btnText = data.like ? `Unlike 👍${data.commentLikes}` : `Like 👍${data.commentLikes}`;
            btn.textContent = btnText;
        });
    });
});