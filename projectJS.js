function generateMealPlan() {
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var goal = document.getElementById('goal').value;


  // Validate email
  if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
  }

  var mealPlanContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Weekly Planner</title>
      <link rel="stylesheet" href="styles.css">
  </head>
  <body>
  <div id="meal">
  <div>
    <div id="user">
        <h2>Weekly Meal Plan for ${name}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Weekly Goal:</strong> ${goal}</p>
    </>
    <div class="w-100">
      <div class="my-4">
        </a>
        <nav class="d-flex justify-center flex-wrap">
          <button
                  data-day-name="monday"
                  class="meal-day-name btn bg-white shadow mx-1"
          >
          Monday
          </button>
          <button
                  data-day-name="tuesday"
                  class="meal-day-name btn bg-white shadow mx-1"
          >
          Tuesday
          </button>
          <button
                  data-day-name="wednesday"
                  class="meal-day-name btn bg-white shadow mx-1"
          >
          Wednesday
          </button>
          <button
                  data-day-name="thursday"
                  class="meal-day-name btn bg-white shadow mx-1"
          >
          Thursday
          </button>
          <button
                  data-day-name="friday"
                  class="meal-day-name btn bg-white shadow mx-1"
          >
          Friday
          </button>
          <button
                  data-day-name="saturday"
                  class="meal-day-name btn bg-white shadow mx-1"
          >
          Saturday
          </button>
          <button
                  data-day-name="sunday"
                  class="meal-day-name btn bg-white shadow mx-1"
          >
          Sunday
          </button>
          
        </nav>
      </div>
      <main class="d-flex flex-col items-center justify-center">
        <div class="wrapper p-10 mb-10">
          <div class="heading d-flex justify-between">
            <h2 id = "day-title" class="mt-1">Monday Meal Plan</h2>
            <span class="mr-2 mt-4 meal-count">total 0</span>
          </div>
          <form id="meal-form">
            <div class="d-flex w-100">
              <select id="meal-option"> 
                <option value="Breakfast" selected>Breakfast</option> 
                <option value="Snack">Snack</option> 
                <option value="Lunch">Lunch</option> 
                <option value="Snack">Snack</option> 
                <option value="Dinner">Dinner</option> 
              </select>
              <label for="meal-name" class="input-label" hidden>
                What you eat
              </label>
              <input
                      type="text"
                      id="meal-name"
                      name="mealName"
                      class="input-field"
                      placeholder="What you eat"
                      autocomplete="off"
              />
              <button
                      type="button"
                      name="submit"
                      id="meal-submit-button"
                      class="input-submit bg-blue-300 ml-2"
              >
                확인
              </button>
            </div>
          </form>
          <ul id="meal-list" class="mt-3 pl-0"></ul>
        </div>
        <button class="remove-all d-block text-sm text-black btn bg-red-200 mb-10">
          Planner Reset
         </button>
      </main>
    </div>
  </div>
  <script src="projectJS.js">
  </script>
  </body>
  `
  var newWindow = window.open();
  newWindow.document.write(mealPlanContent);
}

function validateEmail(email) {
  // Basic email validation regex
  var regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}

const store = {
setLocalStorage(name){
    localStorage.setItem("name", JSON.stringify(name));
},
getLocalStorage(){
    return JSON.parse(localStorage.getItem("name"));
},
};


function Planner(){
    
    this.meal = {
        monday : [],
        tuesday : [],
        wednesday : [],
        thursday : [],
        friday : [],
        saturday : [],
        sunday : []
    };

    this.currentDay = 'monday';

    this.init = () => {
        if(store.getLocalStorage()){
            this.meal = store.getLocalStorage();
        }
        render();
        initEventListeners();
    };

    const render = () => {
        const template = this.meal[this.currentDay].map((mealThing, index) => {
            return `
                <li data-meal-id="${index}" class="meal-list-item d-flex items-center py-2">
                <span class="w-50 meal-option ${mealThing.finish ? "finish-work" : ""}">${mealThing.option}</span>
                <span class="w-100 meal-name ${mealThing.finish ? "finish-work" : ""}">${mealThing.name}</span>
                <button
                    type="button"
                    class="meal-finish-button"
                >
                    complete
                </button>
                <button
                    type="button"
                    class="meal-edit-button"
                >
                    edit
                </button>
                <button
                    type="button"
                    class="meal-remove-button"
                >
                    delete
                </button>
            </li>`;
        }).join("");

        document.querySelector("#meal-list").innerHTML = template; 
    }

    const addMealName = () => {
        if(document.querySelector("#meal-name").value === "") {
            alert("Enter more than one word.");
            return;
        }
            const mealOption = document.querySelector("#meal-option").value
            const mealName = document.querySelector("#meal-name").value;
            
            this.meal[this.currentDay].push({ option: mealOption, name:  mealName });   
            store.setLocalStorage(this.meal);
            render();  
            document.querySelector("#meal-name").value = "";
    };

    const updateMealName = (e) => {
        const mealId = e.target.closest("li").dataset.mealId;
        const selectmeal = e.target.closest("li").querySelector(".meal-name");
        const updatedmealName = prompt("Please edit the content", selectmeal.innerText);

        if(updatedmealName === null) {
            alert("Edit has been canceled")
            return;
        } else {
            this.meal[this.currentDay][mealId].name = updatedmealName;
            store.setLocalStorage(this.meal);
            render();
        }
    }

    const removeMealName = (e) => {
        if(confirm("Are you sure you want to delete?")) {
            const mealId = e.target.closest("li").dataset.mealId;
            this.meal[this.currentDay].splice(mealId, 1);
            store.setLocalStorage(this.meal);
            render();
        }
    }


    const finishMeal = (e) => {
        const mealId = e.target.closest("li").dataset.mealId;
        this.meal[this.currentDay][mealId].finish = !this.meal[this.currentDay][mealId].finish;
        store.setLocalStorage(this.meal);
        render();
    }

    const initEventListeners = () => {
        document.querySelector("#meal-list").addEventListener("click", (e) => {
            if (e.target.classList.contains("meal-edit-button")) {
                updateMealName(e);
                return;
            }
    
            if(e.target.classList.contains("meal-remove-button")) {
                removeMealName(e);
                return;
            }
    
            if(e.target.classList.contains("meal-finish-button")) {
                finishMeal(e);
                return;
            }
        });
    
        document.querySelector("#meal-form").addEventListener("submit", (e) => {
            e.preventDefault();
        });
    
        document.querySelector("#meal-submit-button").addEventListener("click",addMealName);
    
        document.querySelector("#meal-name")
            .addEventListener("keypress", (e) => {
                if (e.key !== "Enter") {
                    return;
                }
                addMealName();
            });
    
        document.querySelector("nav").addEventListener("click", (e) => {
                const isDayButton = e.target.classList.contains("meal-day-name");
                if (isDayButton) {
                    const dayName = e.target.dataset.dayName;
                    this.currentDay = dayName;
                    document.querySelector("#day-title").innerText = `${e.target.innerText} Meal Plan`
                    render();
                }
            });

        document.querySelector(".remove-all").addEventListener("click", (e) => {
            if(confirm("Are you sure you want to reset your planner?")){
                localStorage.clear();
                location.reload();
                window.close()
            }
        });

        };
    }

const app = new Planner();
app.init();