const closeModalBtn = document.getElementById("close-modal");
const openCProjectModal = document.getElementById("open-project-modal");
const modal = document.querySelector(".modal");
const searchForm = document.getElementById("search-form");
const projectList = document.getElementById("project-list");
const sortProject = document.getElementById("sort-project");

const originalList = projectList ? projectList.innerHTML : null;
const SIM_THRESHOLD = 0.4;

document.onkeydown = (e) => {
    if (e.code == "Escape" && modal.style.display != "none")
        modal.style.display = "none";
}
closeModalBtn.onmouseup = () => {
    modal.style.display = "none";
}

openCProjectModal.onmouseup = () => {
    modal.style.display = "flex";
}

sortProject.onchange = (e) => {
    const arr = [];

    projects.forEach(p => {
        arr.push(p);
    })

    let min;
    const sorted = [];
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        min = 0;
        for (let j = 0; j < arr.length; j++) {
            if (e.target.value == "Date Created" && Date.parse(arr[j].created_at) > Date.parse(arr[min].created_at)) min = j;
            else if (e.target.value == "Date Modified" && Date.parse(arr[j].created_at) < Date.parse(arr[min].created_at)) min = j;
        }
        sorted.push(arr[min]);
        arr.splice(min, 1);
    }

    projectList.innerHTML = "";

    for (const prj of sorted) {
        projectList.innerHTML += getProjectRecordString(prj);
    }
}

searchForm.onsubmit = (e) => {
    e.preventDefault();
    const query = new FormData(searchForm).get("query");

    if (query === "") {
        projectList.innerHTML = originalList;
        return;
    }

    projectList.innerHTML = "";

    projects.forEach(p => {
        if(getSimilarity(p.name, query) > SIM_THRESHOLD)
            projectList.innerHTML += getProjectRecordString(p);
    })
}

function getProjectRecordString(prj) {
    return '<div class="project-record column">' +
               `<h3>${prj.name}</h3>` +
               `<p class="bottom-line">CREATED <span>${prj.created_at}</span></p>` +
               `<p class="bottom-line">MODIFIED <span>Sep 30, 2021</span></p>` +
               `<p class="bottom-line">TOTAL ISSUES <span>102</span></p>` +
               `<a class="btn-highlight" href="/p/1">VIEW</a>` +
           '</div>';
}

function getBigram(str) {
    const bigram = [];
    for (let i = 1; i < str.length; i++) {
        bigram.push(str[i-1] + str[i]);
    }
    return bigram;
}

/* Sørensen–Dice coefficient */

function getSimilarity(str0, str1) {
    const bigram0 = getBigram(str0);
    const bigram1 = getBigram(str1);

    let n = 0;

    for (let i = 0; i < bigram0.length; i++) {
        for (let j = 0; j < bigram1.length; j++) {
            if (bigram0[i] === bigram1[j]) n++;
        }
    }

    return ((2 * n) / (bigram0.length + bigram1.length)).toFixed(2);
}
