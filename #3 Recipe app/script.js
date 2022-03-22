const meals = document.getElementById('meals')
const globalMeals = document.getElementById('global-meals')
let inputSearch = document.getElementById("text-to-search")
const searchBtn = document.getElementById("search")
// const heartBtn = document.getElementById("")

addMealsToFav()

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
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" id="img-meal">
        </div>
        <div class="meal-name">
            <div class="random-name">
                <h4 id="meal-name">${mealData.strMeal}</h4>
            </div>
            <div class="fav-btn active">
                <button class="heart-button" onclick="changeIcon()">
                    <i class="fa-regular fa-heart change-icon" id="${mealData.idMeal}"></i>
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
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" id="img-meal">
        </div>
        <div class="meal-name">
            <div class="random-name">
                <h4 id="meal-name">${mealData.strMeal}</h4>
            </div>
            <div class="fav-btn active">
                <button class="heart-button" onclick="changeIcon()">
                    <i class="fa-regular fa-heart change-icon" id="${mealData.idMeal}"></i>
                </button>
            </div>
        </div>
    </div>`
    meals.innerHTML = '';
    meals.appendChild(meal)

}



function changeIcon() {
    const heartBtn = document.querySelector(".change-icon")
    if (heartBtn.className == "fa-regular fa-heart change-icon") {
        heartBtn.className = "fa-solid fa-heart change-icon"
        addMealToLocalStorage()

    } else {
        heartBtn.className = "fa-regular fa-heart change-icon"
        removeFromLS()
    }
    return heartBtn.className

}

// L O C A L    S T O R A G E

function addMealToLocalStorage() {
    const heartBtnID = document.querySelector('.change-icon').id
    const mealIds = getMealsLS();

    localStorage.setItem("mealIds", JSON.stringify([...mealIds, new String(heartBtnID)]))

    // let arrayWithIdsFromLS = JSON.parse(localStorage.getItem('mealIds')) // receive array with all IDs in LS

    // arrayWithIdsFromLS.forEach((id) => {
        const listOfFavMeals = document.getElementById("meal-ul-list")
        listOfFavMeals.innerHTML = '';
        addMealsToFav()

    // });




}

function removeFromLS() {
    const heartBtnID = document.querySelector('.change-icon').id
    const mealIds = getMealsLS();

    localStorage.setItem("mealIds", JSON.stringify(mealIds.filter((id) => id !== heartBtnID)));
    const listOfFavMeals = document.getElementById("meal-ul-list")
        listOfFavMeals.innerHTML = '';
        addMealsToFav()

}

function getMealsLS() {
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));

    return mealIds === null ? [] : mealIds;
}

// GET MEAL by ID
async function getMealById(id) {
    const resp = await fetch(
        "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
    );

    const respData = await resp.json();
    const meal = respData.meals[0];
    // console.log(meal)

    return meal; //receive object with Meal data
}


// ADD  from LS to FAVORITES

function addMealsToFav() {

    let meaLIdsLS = getMealsLS()
    meaLIdsLS.forEach(id => {
        let mealData = getMealById(id)

        mealData = mealData.then(function (mealData) {


            const listOfFavMeals = document.getElementById("meal-ul-list")
            let favMeal = document.createElement('li');

            favMeal.innerHTML = `       
             <img src="${mealData.strMealThumb}" alt="">
            <span>${mealData.strMeal}</span>`

            listOfFavMeals.append(favMeal);
        })

    })

}


// const scrollContainer = document.querySelector("meal-ul-list");

// scrollContainer.addEventListener("wheel", (evt) => {
//     evt.preventDefault();
//     scrollContainer.scrollLeft += evt.deltaY;
// })