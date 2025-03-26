document.addEventListener("DOMContentLoaded", () => {
    const repostButtons = document.querySelectorAll(".btnRepost");
    repostButtons.forEach(async (btn) => {
        const comment_id = btn.dataset.commentId;
        const content = btn.dataset.content;
        const response = await fetch("/get-repost-btn-text/" + comment_id, {
            method: "get",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        const btnText = data.reposted ? "Reposted" : "Repost";
        btn.textContent = btnText;
        btn.addEventListener("click", async () => {
            const response = await fetch("/repost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ commentId: comment_id, content })
            });
            const data = await response.json();
            const btnText = data.reposted ? "Reposted" : "Repost";
            btn.textContent = btnText;
            window.location.reload();
        })
    })
})
