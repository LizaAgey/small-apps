const meals = document.getElementById('meals')
const globalMeals = document.getElementById('global-meals')
let inputSearch = document.getElementById("text-to-search")
const searchBtn = document.getElementById("search")



// R A N D O M
getRandomMeal()

async function getRandomMeal() {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    const responseData = await response.json()
    const randomMeal = responseData.meals[0]

    addRandomMeal(randomMeal);
}


function addRandomMeal(mealData) {
    const meal = document.createElement("div")
    meal.classList.add('meal')
    meal.innerHTML = `
   <div class="meal-header">
        <button class="random-header" id="random-btn">Random meal</button> 
        <div class="random-meal">
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        </div>
        <div class="meal-name">
            <div class="random-name">
                <h4>${mealData.strMeal}</h4>
            </div>
            <div class="fav-btn active">
                <button class="heart-button" onclick="changeIcon()">
                    <i class="fa-regular fa-heart" id="change-icon"></i>
                </button>
            </div>
        </div>
    </div>`
    meals.innerHTML = '';
    meals.appendChild(meal)

    const randomBtn = document.getElementById("random-btn")
    randomBtn.addEventListener("click", getRandomMeal);

}



// S E A R C H

async function getMealBySearch() {
    let inputSearch = document.getElementById("text-to-search")
    if (!inputSearch.value) {
        return
    }

    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + inputSearch.value)
    const responseData = await response.json() //receive an array with objects (meals)
    if (responseData.meals == null) {
        alert('Not found')
    } else {
        const searchedMeal = responseData.meals[0] // take the first meal in search
        replaceExistingMeal(searchedMeal);
    }
    inputSearch.value = ""
}



searchBtn.addEventListener("click", getMealBySearch);

inputSearch.addEventListener("keypress", (event) => {
    if (event.key === 'Enter') {
        getMealBySearch()
    }
});


// R E P L A C E  
function replaceExistingMeal(mealData) {
    const meal = document.createElement("div")
    meal.classList.add('meal')
    meal.innerHTML = `
   <div class="meal-header">
        <div class="random-meal">
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        </div>
        <div class="meal-name">
            <div class="random-name">
                <h4>${mealData.strMeal}</h4>
            </div>
            <div class="fav-btn active">
                <button class="heart-button" onclick="changeIcon()">
                    <i class="fa-regular fa-heart" id="change-icon"></i>
                </button>
            </div>
        </div>
    </div>`
    meals.innerHTML = '';
    meals.appendChild(meal)

}



function changeIcon() {
    const iconClass = document.getElementById("change-icon")
    if (iconClass.className == "fa-regular fa-heart") {
        iconClass.className = "fa-solid fa-heart"
        // addMealToLocalStorage()
    } else {
        iconClass.className = "fa-regular fa-heart"
        // removeFromLS()
    }
    return iconClass.className

}


//local storage: you would keep a key on the user’s computer and read it out when the user returns.

//Если в метод getItem() интерфейса Storage передать ключ в качестве параметра, то метод вернёт значение, лежащее в хранилище по указанному ключу.
//storage.setItem(название Ключа, значение Ключа);

