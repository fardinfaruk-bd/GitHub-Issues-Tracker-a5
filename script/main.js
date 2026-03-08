let openList = [];
let closedList = [];
let allIssues = [];

let total = document.getElementById("total");

const allCards = document.getElementById("cardContainer");
const loadingSpinner = document.getElementById("loadingSpinner");

const allBtn = document.getElementById("allBtn");
const openBtn = document.getElementById("openBtn");
const closedBtn = document.getElementById("closedBtn");

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
  }

  else if (id === "openBtn") {
    filtered = allIssues.filter(issue =>
      issue.priority === "high" || issue.priority === "medium"
    );
  }

  else if (id === "closedBtn") {
    filtered = allIssues.filter(issue =>
      issue.priority === "low"
    );
  }

  displayCards(filtered);
}

function showLoading() {
  loadingSpinner.classList.remove("hidden");
  allCards.innerHTML = "";
}
function hideLoading() {
  loadingSpinner.classList.add("hidden");
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
  let labelHidden ="";

  allCards.innerHTML = "";
  total.innerText = allCard.length;

  allCard.forEach((cards) => {
    const label1 = cards.labels[0]?.toUpperCase() || "";
    const label2 = cards.labels[1]?.toUpperCase();

    if(typeof label1 === "undefined" || typeof label2 === "undefined"){
      labelHidden = "hidden"
    }else {
      labelHidden = "flex"
    }
    const card = document.createElement("div");
    // priority check
    if (cards.priority === "high" || cards.priority === "medium") {
      card.className =
        "card bg-base-100 shadow-sm mt-10 border-t-4 border-green-500";
    } else {
      card.className =
        "card bg-base-100 shadow-sm mt-10 border-t-4 border-purple-500";
    }
    //Button color change according to priority status.
    if (cards.priority === "high") {
      btnClass = "bg-[#feecec] text-[#ef4444] border";
    } else if (cards.priority === "medium") {
      btnClass = "bg-[#fff8db] text-[#d97706] border";
    } else {
      btnClass = "bg-[#f1f5f9] text-[#64748b] ";
    }

    if (cards.priority === "high" || cards.priority === "medium") {
      statusImg = "./assets/Open-Status.png";
    } else {
      statusImg = "./assets/Closed-Status.png";
    }
    card.innerHTML = `
            <div class="card-body">
              <div class="flex justify-between items-center">
                <img src="${statusImg}" alt=""  />
        
                <button
                  class="text-[12px] font-medium px-6 py-2 rounded-full cursor-pointer ${btnClass}"
                >
                  ${cards.priority.toUpperCase()}
                </button>
              </div>
              <h2 class="card-title">${cards.title}</h2>
              <p class="line-clamp-2">
                ${cards.description}
              </p>
              <div class="flex gap-3">
                <div
                  class="badge border-red-500 bg-[#feecec] text-red-500 font-medium text[12px]  items-center p-2"
                > 
                  <p class ="text-[12px]">${label1}</p>
                </div>
                <div
                  class="badge border-[#fde68a] bg-[#fff8db] text-[#d97706] font-medium text[12px] ${labelHidden} items-center p-2"
                >
                  <p class ="text-[12px]">${label2}</p>
                </div>
              </div>
            </div>
            <div class="border border-[#e4e4e7] p-4 rounded-b-lg">
              <p class="text-[12px] text-[#64748b] font-normal">
                #1 by ${cards.author}
              </p>
              <p class="text-[12px] text-[#64748b] font-normal">${cards.createdAt}</p>
            </div>`;
    allCards.appendChild(card);
  });
}

loadCard();
