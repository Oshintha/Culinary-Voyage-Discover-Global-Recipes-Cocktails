import React, { useState, useEffect } from 'react';
//import { CategoryList } from './CategoryList';

export const Home = () => {
  // State for the search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for the search results
  const [searchResults, setSearchResults] = useState({ meals: [], cocktails: [] });
  // State for the selected category (meals or cocktails)
  const [selectedCategory, setSelectedCategory] = useState('meals');
  // State for the selected item (meal or cocktail) for detail view
  const [selectedItem, setSelectedItem] = useState(null);

  // Effect hook to fetch data based on search query
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchQuery.trim() !== '') {
          // Fetch meals based on search query
          const mealResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`);
          const mealData = await mealResponse.json();
          const meals = mealData.meals || [];

          // Fetch cocktails based on search query
          const cocktailResponse = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchQuery}`);
          const cocktailData = await cocktailResponse.json();
          const cocktails = cocktailData.drinks || [];

          // Set search results for meals and cocktails
          setSearchResults({ meals, cocktails });
        } else {
          setSearchResults({ meals: [], cocktails: [] });
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [searchQuery]);

  // Handler function to handle item click and display detail view
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  // Handler function to close the detail view
  const handleCloseDetail = () => {
    setSelectedItem(null);
  };

  // Handler function to toggle between meals and cocktails
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
          <div key={meal.idMeal} className="search-result" onClick={() => handleItemClick(meal)}>
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <h3>{meal.strMeal}</h3>
          </div>
        ))}
        {selectedCategory === 'cocktails' && searchResults.cocktails.map((cocktail) => (
          <div key={cocktail.idDrink} className="search-result" onClick={() => handleItemClick(cocktail)}>
            <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} />
            <h3>{cocktail.strDrink}</h3>
          </div>
        ))}
      </div>

      {/* Detail overlay for displaying details of selected item */}
      {selectedItem && (
        <div className="detail-overlay">
          <div className="detail-content">
            <h2>{selectedItem.strMeal || selectedItem.strDrink}</h2>
            <p>{selectedItem.strInstructions}</p>
            <ul>
              {Object.keys(selectedItem)
                .filter((key) => key.startsWith('strIngredient') && selectedItem[key])
                .map((key, index) => (
                  <li key={index}>{selectedItem[key]}</li>
                ))}
            </ul>
            <button onClick={handleCloseDetail}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
