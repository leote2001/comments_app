document.addEventListener("DOMContentLoaded", () => {
    const hiddenForms = document.querySelectorAll(".hiddenForm");
    hiddenForms.forEach((form) => {
        const comment_id = form.commentId.value;
        const profile_id = form.profileId.value;
        form.addEventListener("submit", async () => {
            if (confirm("Are you sure you want to hidden this comment?")) {
                await fetch("/hidden", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ commentId: comment_id, profileId: profile_id })
                });
            }
        });
    });
});