import React, { useState, useEffect } from 'react';

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ meals: [], cocktails: [] });
  const [selectedCategory, setSelectedCategory] = useState('meals');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchQuery.trim() !== '') {
          const mealResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`);
          const mealData = await mealResponse.json();
          const meals = mealData.meals || [];

          const cocktailResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchQuery}`);
          const cocktailData = await cocktailResponse.json();
          const cocktails = cocktailData.drinks || [];

          setSearchResults({ meals, cocktails });
        } else {
          setSearchResults({ meals: [], cocktails: [] });
        }
      } catch (error) {
        console.error(error);
        // Handle error (e.g., display error message)
      }
    };

    fetchData();
  }, [searchQuery]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  const handleToggleCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="home">
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search for meals or cocktails..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      {/* Toggle buttons for selecting category (meals or cocktails) */}
      <div className="toggle">
        <button onClick={() => handleToggleCategory('meals')} className={selectedCategory === 'meals' ? 'active' : ''}>Meals</button>
        <button onClick={() => handleToggleCategory('cocktails')} className={selectedCategory === 'cocktails' ? 'active' : ''}>Cocktails</button>
      </div>

      {/* Display search results based on selected category */}
      <div className="search-results">
        {selectedCategory === 'meals' && searchResults.meals.map((meal) => (
          <div key={meal.idMeal} className="search-result">
            <h2>{meal.strMeal}</h2>
            <img className='img'
              src={meal.strMealThumb} 
              alt={meal.strMeal}
              onError={(e) => e.target.src = "images/meals.png"}
              onClick={() => handleItemClick(meal)}
            />
            
          </div>
        ))}
        {selectedCategory === 'cocktails' && searchResults.cocktails.map((cocktail) => (
          <div key={cocktail.idDrink} className="search-result">
            <h2>{cocktail.strDrink}</h2>
            <img className='img'
              src={cocktail.strDrinkThumb} 
              alt={cocktail.strDrink} 
              onError={(e) => e.target.src = 'images/cocktails.png'}
              onClick={() => handleItemClick(cocktail)}
            />
            {selectedItem === cocktail && (
              <div className="detail-overlay">
                <div className="detail-content">
                  <p>{cocktail.strInstructions}</p>
                  <ul>
                    {Array.from({ length: 20 }, (_, index) => index + 1).map((index) => (
                      cocktail[`strIngredient${index}`] && <li key={index}>{cocktail[`strIngredient${index}`]}</li>
                    ))}
                  </ul>
                  <button onClick={handleCloseDetail}>Close</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
