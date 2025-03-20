document.addEventListener("DOMContentLoaded", () => {
    const deleteForms = document.querySelectorAll(".deleteForm");
    deleteForms.forEach((form) => {
        const comment_id = form.commentId.value;
        const profile_id = form.source.value;
        form.addEventListener("submit", async () => {
            if (confirm("Are you sure you want to delete this comment?")) {
                await fetch("/delete", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ commentId: comment_id, source: profile_id })
                })
            }
        })
    })
})