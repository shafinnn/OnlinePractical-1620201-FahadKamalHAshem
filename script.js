const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random_btn = document.getElementById("random_btn");
const result_heading = document.getElementById("result_heading");
const mealsEl = document.getElementById("meals");
const recipeEl = document.getElementById("recipe");

function getMeals(e) {
  e.preventDefault();

  recipeEl.innerHTML = "";

  const meal = search.value;
  if (meal.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.meals === null) {
          result_heading.textContent = `404! not found, search again!`;
        } else {
          result_heading.textContent = `Search result for ${meal} :`;
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
                <div class='meal'>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                    <div class='meal-info' data-mealID="${meal.idMeal}">
                        <h4>${meal.strMeal}</h4>
                    </div>
                </div>
            `
            )
            .join("");
        }
      });
    search.value = "";
  } else {
    result_heading.textContent = `Please search again!`;
  }
}

function getMealByID(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.meals[0]);
      addRecipeToDOM(data.meals[0]);
    });
}

function randomRecipe() {
    result_heading.textContent = '';
    mealsEl.innerHTML = '';
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      addRecipeToDOM(data.meals[0]);
    });
}

function addRecipeToDOM(meal) {
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]}-${meal[`strMeasure${i}`]}`
      );
    }
  }

  function showAll() {
    var url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`; 

    
    fetch(url)
    .then(res => res.json())
    .then(data => show(data.meals))
  }

  recipeEl.innerHTML = `
    <div class='recipe_wrapper'>   
        <div class="recipe_container">
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <p>Area: ${meal.strArea}</p>
            <p>Category: ${meal.strCategory}</p>
        </div>
            <h3>Instruction</h3>
            <p>${meal.strInstructions}</p>
            <h4>Ingredients</h4>
            <ul>
                ${ingredients
                  .map((ingredient) => `<li>${ingredient}</li>`)
                  .join("")}
            </ul>
    </div>
    `;
}

submit.addEventListener("submit", getMeals);
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealID");
    getMealByID(mealID);
  }
});
random_btn.addEventListener("click", randomRecipe);
