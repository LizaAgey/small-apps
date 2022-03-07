const meals = document.getElementById('meals')



getRandomMeal()

async function getRandomMeal() {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    const responseData = await resp.json()
    const randomMeal = responseData.meals[0]
    console.log(randomMeal)

    addMeal(randomMeal, true);
}

async function getMealbyId(id) {
    const meal = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id)

}

async function getMealBySearch(term) {
    const meals = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term)

}

function addMeal(mealData, random = false) {
    const meal = document.createElement("div")
    meal.classList.add('meal')
    meal.innerHTML = `
   <div class="meal-header">
   ${random ? `<h3 class="random-header">Random meal</h3>` : '' }
            <div class="random-meal">
                <img src="${mealData.strMealThumb}" 
                    alt="${mealData.strMeal}">
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

    meals.appendChild(meal)

    
}

function changeIcon() {
    const iconClass = document.getElementById("change-icon")
    if(iconClass.className == "fa-regular fa-heart") {
        iconClass.className = "fa-solid fa-heart"
        addMealToLocalStorage()
    } else {
        iconClass.className = "fa-regular fa-heart"
        removeFromLS()
    }
    return iconClass.className

}


//local storage: you would keep a key on the user’s computer and read it out when the user returns.

//Если в метод getItem() интерфейса Storage передать ключ в качестве параметра, то метод вернёт значение, лежащее в хранилище по указанному ключу.
//storage.setItem(название Ключа, значение Ключа);

function addMealToLocalStorage(meal) {
    console.log(mealData)
    const mealIds = getMealsFromLocalStorage()

    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealID]))

}

function removeFromLS (mealID) {
    const mealIds = getMealsFromLocalStorage()

    localStorage.setItem(mealIds.filter(id => id !== mealID))
}

function getMealsFromLocalStorage() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'))

    return mealIds
}

