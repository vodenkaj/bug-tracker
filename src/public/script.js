const bugModal = document.querySelector(".bug-modal");
const openBugModalBtn = document.getElementById("open-bug-modal");
const closeBugModalBtn = document.getElementById("close-bug-modal");

openBugModalBtn.onmouseup = () => {
    bugModal.style.display = "block";
}

closeBugModalBtn.onmouseup = () => {
    bugModal.style.display = "none";
}
