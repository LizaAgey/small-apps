const meals = document.getElementById('meals')
const globalMeals = document.getElementById('global-meals')
let inputSearch = document.getElementById("text-to-search")
const searchBtn = document.getElementById("search")

//check LS for Favorite meals presence and add them to Favorite meals section
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
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" id="img-meal" class="${mealData.idMeal}">
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

    let imgMainMeal = document.getElementById("img-meal")
    imgMainMeal.addEventListener("click", addModalWindowMealInfo)

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
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" id="img-meal" class="${mealData.idMeal}">
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

    let imgMainMeal = document.getElementById("img-meal")
    imgMainMeal.addEventListener("click", addModalWindowMealInfo)

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

    const listOfFavMeals = document.getElementById("meal-ul-list")
    listOfFavMeals.innerHTML = '';
    addMealsToFav()

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

// ADD  from LS to FAVORITES

function addMealsToFav() {

    let meaLIdsLS = getMealsLS()
    meaLIdsLS.forEach(id => {
        let mealData = getMealById(id)

        mealData = mealData.then(function (mealData) {


            const listOfFavMeals = document.getElementById("meal-ul-list")
            const favMeal = document.createElement('li');

            favMeal.innerHTML = `       
             <img src="${mealData.strMealThumb}" alt="" onclick = "getAlert()">
            <span>${mealData.strMeal}</span>`

            listOfFavMeals.append(favMeal);


        })

    })



}

// GET MEAL by ID
async function getMealById(id) {
    const resp = await fetch(
        "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
    );

    const respData = await resp.json();
    const meal = respData.meals[0];
    // console.log(meal)

    return meal;
}



// insert MEAL INFO modal window

function addModalWindowMealInfo() {
    let mealID = document.getElementById("img-meal")
    mealID = mealID.className

    let mealData = getMealById(mealID)
    mealData = mealData.then(function (mealData) {
        const divForModalWindow = document.getElementById("modul-window-meal")

        const mealInfoContainer = document.createElement("div");
        mealInfoContainer.classList.add('meal-info-container')

        mealInfoContainer.innerHTML = `
            <div class="meal-info">
                 <button class="close-btn">    
                     <i class="fa-solid fa-xmark"></i>
                  </button>
                <img src="${mealData.strMealThumb}" alt="">
                <h4>${mealData.strMeal}</h4>
                <p>${mealData.strInstructions}</p> 
            </div>`

        divForModalWindow.append(mealInfoContainer)
    })
}


function mapIngredientsWithAmount(mealData) {
    let arrayWithIngredients = []
    for
    mealData.forEach( key => {
        if (key.includes("strIngredient")) {
            arrayWithIngredients.push(key)
        }
        console.log(arrayWithIngredients)
    })
}

let arrayCheck = {
    "meals": [
    {
    "idMeal": "52973",
    "strMeal": "Leblebi Soup",
    "strDrinkAlternate": null,
    "strCategory": "Vegetarian",
    "strArea": "Tunisian",
    "strInstructions": "Heat the oil in a large pot. Add the onion and cook until translucent.\r\nDrain the soaked chickpeas and add them to the pot together with the vegetable stock. Bring to the boil, then reduce the heat and cover. Simmer for 30 minutes.\r\nIn the meantime toast the cumin in a small ungreased frying pan, then grind them in a mortar. Add the garlic and salt and pound to a fine paste.\r\nAdd the paste and the harissa to the soup and simmer until the chickpeas are tender, about 30 minutes.\r\nSeason to taste with salt, pepper and lemon juice and serve hot.",
    "strMealThumb": "https://www.themealdb.com/images/media/meals/x2fw9e1560460636.jpg",
    "strTags": "Soup",
    "strYoutube": "https://www.youtube.com/watch?v=BgRifcCwinY",
    "strIngredient1": "Olive Oil",
    "strIngredient2": "Onion",
    "strIngredient3": "Chickpeas",
    "strIngredient4": "Vegetable Stock",
    "strIngredient5": "Cumin",
    "strIngredient6": "Garlic",
    "strIngredient7": "Salt",
    "strIngredient8": "Harissa Spice",
    "strIngredient9": "Pepper",
    "strIngredient10": "Lime",
    "strIngredient11": "",
    "strIngredient12": "",
    "strIngredient13": "",
    "strIngredient14": "",
    "strIngredient15": "",
    "strIngredient16": "",
    "strIngredient17": "",
    "strIngredient18": "",
    "strIngredient19": "",
    "strIngredient20": "",
    "strMeasure1": "2 tbs",
    "strMeasure2": "1 medium finely diced",
    "strMeasure3": "250g",
    "strMeasure4": "1.5L",
    "strMeasure5": "1 tsp ",
    "strMeasure6": "5 cloves",
    "strMeasure7": "1/2 tsp",
    "strMeasure8": "1 tsp ",
    "strMeasure9": "Pinch",
    "strMeasure10": "1/2 ",
    "strMeasure11": " ",
    "strMeasure12": " ",
    "strMeasure13": " ",
    "strMeasure14": " ",
    "strMeasure15": " ",
    "strMeasure16": " ",
    "strMeasure17": " ",
    "strMeasure18": " ",
    "strMeasure19": " ",
    "strMeasure20": " ",
    "strSource": "http://allrecipes.co.uk/recipe/43419/leblebi--tunisian-chickpea-soup-.aspx",
    "strImageSource": null,
    "strCreativeCommonsConfirmed": null,
    "dateModified": null
    }
    ]
    }




//for FAV MEALS
function getAlert() {
    alert("hi")
}