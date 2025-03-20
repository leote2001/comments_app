                                document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector("#searchForm");
    const pResults = document.querySelector("#p-results");
    const h3Results = document.querySelector("#h3-results");
    const ulResults = document.querySelector("#ul-results");
    let page;
    const divResults = document.querySelector("#div-results");
    let q; 
    const totalPagesSpan = document.querySelector("#totalPages");
    const currentPageSpan = document.querySelector("#currentPage");
    const btnPrevious = document.querySelector("#btn-previous");
    const btnNext = document.querySelector("#btn-next");
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        q = document.querySelector("#q").value;
        page = 1;
                                                    console.log(q);
        fetchResults();
    });
    updatePageButtons();
    async function fetchResults() {
        ulResults.innerHTML = "";
        pResults.style.display = "none";
        divResults.style.display = "none";
        const response = await fetch(`/search?q=${q}&page=${page}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        if (data.existingUsers) {
            const results = data.existingUsers;
            if (results.length > 0) {
                searchForm.reset();
                h3Results.textContent=`Results for ${q}`;
                page = data.currentPage;
                divResults.style.display = "block";
                currentPageSpan.innerHTML = `<b>${data.currentPage}</b>`;
                btnPrevious.style.display = data.currentPage > 1 ? "inline" : "none";
                totalPagesSpan.innerHTML = `<b>${data.totalPages}</b>`;
                btnNext.style.display = data.currentPage < data.totalPages ? "inline" : "none";
                results.forEach((user) => {
                    const liUser = document.createElement("li");
                    const aUser = document.createElement("a");
                    liUser.className = "list-group-item";
                    aUser.href = `/profile/${user._id}`;
                    aUser.textContent = user.username
                    liUser.appendChild(aUser);
                    ulResults.appendChild(liUser);
                });
            } else {
                pResults.style.display = "block";
                pResults.textContent = "No results";
            }
        } else {
                    pResults.style.display = "block";
            pResults.textContent = data.message;
        }
    }
    function updatePageButtons() {
btnPrevious.addEventListener("click", () => {
    page -= 1; 
    fetchResults();
});
btnNext.addEventListener("click", () => {
    page += 1;
    fetchResults();
});
    }
});
