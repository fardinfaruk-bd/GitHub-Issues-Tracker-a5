let openList = [];
let closedList = [];
let allIssues = [];

let total = document.getElementById("total");

const issuesDetailsModal = document.getElementById("issuesDetailsModal");
const allCards = document.getElementById("cardContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const allBtn = document.getElementById("allBtn");
const openBtn = document.getElementById("openBtn");
const closedBtn = document.getElementById("closedBtn");

const modelTitle = document.getElementById("model-title");
const modalStatus = document.getElementById("modalStatus");
const assigneeName = document.getElementById("assignee");
const assignDate = document.getElementById("assignDate");
const label1 = document.getElementById("label1");
const label2 = document.getElementById("label2");
const modalDescription = document.getElementById("modalDescription");
const authorName = document.getElementById("author");
const modelPriority = document.getElementById("modelPriority");
const modalSection = document.getElementById("modalContainer");

const searchInput = document.getElementById("searchInput");

function updateCount() {
  total.innerText = info.data.length;
}

function toggle(id) {
  let filtered = [];

  allBtn.classList.remove("btn-primary", "text-white");
  openBtn.classList.remove("btn-primary", "text-white");
  closedBtn.classList.remove("btn-primary", "text-white");

  allBtn.classList.add("text-[#64748b]", "bg-white");
  openBtn.classList.add("text-[#64748b]", "bg-white");
  closedBtn.classList.add("text-[#64748b]", "bg-white");

  const selectedBtn = document.getElementById(id);
  selectedBtn.classList.remove("text-[#64748B]", "bg-white");
  selectedBtn.classList.add("bg-[#3B82F6]", "text-white");

  if (id === "allBtn") {
    filtered = allIssues;
  } else if (id === "openBtn") {
    filtered = allIssues.filter(
      (issue) => issue.status === "open",
    );
  } else if (id === "closedBtn") {
    filtered = allIssues.filter((issue) => issue.status === "closed");
  }

  displayCards(filtered);
}

function showLoading() {
  loadingSpinner.classList.remove("hidden");
  loadingSpinner.classList.add("flex");
  allCards.innerHTML = "";
}

function hideLoading() {
  loadingSpinner.classList.add("hidden");
  loadingSpinner.classList.remove("flex");
}

async function loadCard() {
  showLoading();
  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const info = await res.json();
  allIssues = info.data;
  hideLoading();
  displayCards(allIssues);
}

function displayCards(allCard) {
  let btnClass = "";
  let statusImg = "";
  let labelHidden = "";

  allCards.innerHTML = "";
  total.innerText = allCard.length;

  allCard.forEach((cards) => {
    let label1 = "";
    let label2 = "";

    if (cards.labels !== undefined && cards.labels !== null) {
      if (cards.labels[0] !== undefined && cards.labels[0] !== null) {
        label1 = cards.labels[0].toUpperCase();
      }

      if (cards.labels[1] !== undefined && cards.labels[1] !== null) {
        label2 = cards.labels[1].toUpperCase();
      }
    }

    let label1Class = "";
    let label2Class = "";

    if (label1 === "BUG") {
      label1Class = "border-red-500 bg-[#feecec] text-red-500";
    } else if (label1 === "HELP WANTED") {
      label1Class = "border-yellow-400 bg-[#fff8db] text-[#d97706]";
    } else if (
      label1 === "ENHANCEMENT" ||
      label1 === "GOOD FIRST ISSUES" ||
      label1 === "DOCUMENTATION"
    ) {
      label1Class = "border-green-500 bg-green-100 text-green-600";
    }

    if (label2 === "BUG") {
      label2Class = "border-red-500 bg-[#feecec] text-red-500";
    } else if (label2 === "HELP WANTED") {
      label2Class = "border-yellow-400 bg-[#fff8db] text-[#d97706]";
    } else if (
      label2 === "ENHANCEMENT" ||
      label2 === "GOOD FIRST ISSUE" ||
      label2 === "DOCUMENTATION"
    ) {
      label2Class = "border-green-500 bg-green-100 text-green-600";
    }

    if (label2 === "") {
      labelHidden = "hidden";
    } else {
      labelHidden = "flex";
    }

    const card = document.createElement("div");
    // priority check
    if (cards.status === "open") {
      card.className =
        "card bg-base-100 shadow-sm mt-10 transition-transform duration-300 hover:scale-105 border-t-4 border-green-500";
    } else {
      card.className =
        "card bg-base-100 shadow-sm mt-10 transition-transform duration-300 hover:scale-105 border-t-4 border-purple-500";
    }
    //Button color change according to priority status.
    if (cards.priority === "high") {
      btnClass = "bg-[#feecec] text-[#ef4444] border";
    } else if (cards.priority === "medium") {
      btnClass = "bg-[#fff8db] text-[#d97706] border";
    } else {
      btnClass = "bg-[#f1f5f9] text-[#64748b] ";
    }
    //Priority Image Set
    if (cards.priority === "high" || cards.priority === "medium") {
      statusImg = "./assets/Open-Status.png";
    } else {
      statusImg = "./assets/Closed-Status.png";
    }
    card.innerHTML = `
            <div class="card-body cursor-pointer" onclick="showIssuesModal(${cards.id})">
              <div class="flex justify-between items-center">
                <img src="${statusImg}" alt=""  />
        
                <button
                  class="text-[12px] font-medium px-6 py-2 rounded-full cursor-pointer ${btnClass}"
                >
                  ${cards.priority.toUpperCase()}
                </button>
              </div>
              <h2 class="card-title">${cards.title}</h2>
              <p class="line-clamp-1 overflow-hidden  text-[#64748b]">
                ${cards.description}
              </p>
              <div class="flex gap-3">
                <div
                  class="badge ${label1Class} font-medium text[12px]  items-center p-2"
                > 
                  <p class ="text-[10px]">${label1.toUpperCase()}</p>
                </div>
                <div
                  class="badge ${label2Class} font-medium text[12px] ${labelHidden} items-center p-2"
                >
                  <p class ="text-[10px]">${label2.toUpperCase()}</p>
                </div>
              </div>
            </div>
            <div class="border border-[#e4e4e7] p-4 rounded-b-lg">
              <p class="text-[12px] text-[#64748b] font-normal">
                #${cards.id} by ${cards.assignee}
              </p>
              <p class="text-[12px] text-[#64748b] font-normal">${cards.createdAt}</p>
            </div>`;
    allCards.appendChild(card);
  });
}

async function showIssuesModal(id) {
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
  );
  const info = await res.json();
  const issue = info.data;

  modelTitle.innerText = issue.title;
  modalStatus.innerText = issue.status.toUpperCase();
  modalDescription.innerText = issue.description;
  authorName.innerText = issue.author;
  assigneeName.innerText = issue.assignee;
  assignDate.innerText = issue.createdAt;
  modelPriority.innerText = issue.priority.toUpperCase();

  modalStatus.classList.remove("bg-green-500", "bg-red-500")
  if(issue.status.toUpperCase() === "OPEN"){
    modalStatus.classList.add("bg-green-500", "rounded-full", "px-4", "py-2")
  }
  else if (issue.status.toUpperCase() === "CLOSED"){
    modalStatus.classList.add("bg-red-500", "rounded-full", "px-4", "py-2")
  }

  //remove btn class form priority
  modelPriority.classList.remove("bg-[#feecec]","text-[#ef4444]","bg-[#fff8db]","text-[#d97706]","bg-[#f1f5f9]","text-[#64748b]",
  );

  // priority Check and add class
  if (issue.priority === "high") {
    modelPriority.classList.add("bg-[#feecec]", "text-[#ef4444]", "border");
  } else if (issue.priority === "medium") {
    modelPriority.classList.add("bg-[#fff8db]", "text-[#d97706]", "border");
  } else {
    modelPriority.classList.add("bg-[#f1f5f9]", "text-[#64748b]");
  }

  //label Set and if label2 is undefined, null, empty string then add hidden in classlist
  const l1 = issue.labels?.[0]?.toUpperCase() || "";
  const l2 = issue.labels?.[1]?.toUpperCase();

  label1.innerText = l1;
  label2.innerText = l2 || "";

  label1.parentElement.classList.remove("border-red-500","bg-[#feecec]","text-red-500","border-yellow-400","bg-[#fff8db]","text-[#d97706]","border-green-500","bg-green-100","text-green-600");
  label2.parentElement.classList.remove("border-red-500","bg-[#feecec]","text-red-500","border-yellow-400","bg-[#fff8db]","text-[#d97706]","border-green-500","bg-green-100","text-green-600");

  if (l1 === "BUG") {
    label1.parentElement.classList.add(
      "border-red-500",
      "bg-[#feecec]",
      "text-red-500",
    );
  } else if (l1 === "HELP WANTED") {
    label1.parentElement.classList.add("border-yellow-400","bg-[#fff8db]","text-[#d97706]");
  } else if (
    l1 === "ENHANCEMENT" ||
    l1 === "GOOD FIRST ISSUE" ||
    l1 === "DOCUMENTATION"
  ) {
    label1.parentElement.classList.add("border-green-500","bg-green-100","text-green-600",);
  }

  if (l2 === "BUG") {
    label2.parentElement.classList.add("border-red-500","bg-[#feecec]","text-red-500");
  } else if (l2 === "HELP WANTED") {
    label2.parentElement.classList.add(
      "border-yellow-400",
      "bg-[#fff8db]",
      "text-[#d97706]",
    );
  } else if (
    l2 === "ENHANCEMENT" ||
    l2 === "GOOD FIRST ISSUE" ||
    l2 === "DOCUMENTATION"
  ) {
    label2.parentElement.classList.add(
      "border-green-500",
      "bg-green-100",
      "text-green-600",
    );
  }

  if (l2 === undefined || l2 === null || l2 === "") {
    label2.parentElement.classList.add("hidden");
  } else {
    label2.parentElement.classList.remove("hidden");
  }

  issuesDetailsModal.showModal();
}

// add event listener in Search input
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = allIssues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(value) ||
      issue.description.toLowerCase().includes(value),
  );

  displayCards(filtered);
});

loadCard();
