
const allCards = document.getElementById("cardContainer")
const loadingSpinner =document.getElementById("loadingSpinner")

const allBtn = document.getElementById('allBtn')
const openBtn = document.getElementById('openBtn')
const closedBtn = document.getElementById('closedBtn')

function showLoading(){
    loadingSpinner.classList.remove('hidden')
    allCards.innerHTML = ""
}
function hideLoading(){
    loadingSpinner.classList.add('hidden')
}

async function loadCard(){
    showLoading();
    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const info = await res.json();
    hideLoading();
    displayCards(info.data);
}

function displayCards(cards){
    console.log(cards);
    cards.forEach((cards) => {
        const label1 = cards.labels[0];
        
        const label2 = cards.labels[1];
        
        const card = document.createElement("div");
        card.className = "card bg-base-100 shadow-sm mt-10"
        card.innerHTML = `
            <div class="card-body">
              <div class="flex justify-between items-center">
                <img src="./assets/Open-Status.png" alt="" />
                <button
                  class="text-[12px] font-medium px-6 py-2 rounded-full bg-[#feecec] text-[#ef4444]"
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
                  class="badge border-red-500 bg-[#feecec] text-red-500 font-medium text[12px] flex items-center p-2"
                > 
                  <p class ="text-[12px]">${label1}</p>
                </div>
                <div
                  class="badge border-[#fde68a] bg-[#fff8db] text-[#d97706] font-medium text[12px] flex items-center p-2"
                >
                  <p class ="text-[12px]">${label2}</p>
                </div>
              </div>
            </div>
            <div class="border border-[#e4e4e7] p-4 rounded-b-lg">
              <p class="text-[12px] text-[#64748b] font-normal">
                #1 by john_doe
              </p>
              <p class="text-[12px] text-[#64748b] font-normal">1/15/2024</p>
            </div>`
          allCards.appendChild(card);
    });
}

loadCard();