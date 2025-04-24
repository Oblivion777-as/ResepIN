// Data resep contoh
const recipes = [
    {
        id: 1,
        title: "Nasi Goreng Spesial",
        image: "image/nasigoreng.jpg",
        ingredients: [
            "Nasi putih",
            "Telur",
            "Bawang merah",
            "Bawang putih",
            "Kecap manis",
            "Garam",
            "Minyak goreng",
            "Ayam suwir"
        ],
        steps: [
            "Panaskan minyak dalam wajan",
            "Tumis bawang merah dan bawang putih hingga harum",
            "Masukkan telur, orak-arik",
            "Tambahkan nasi putih, aduk rata",
            "Bumbui dengan kecap manis dan garam",
            "Masukkan ayam suwir, aduk hingga matang",
            "Sajikan hangat"
        ]
    },
    {
        id: 2,
        title: "Mie Goreng Jawa",
        image: "image/Mie Goreng Jawa.jpg",
        ingredients: [
            "Mie kuning",
            "Kolm kubis",
            "Wortel",
            "Bawang merah",
            "Bawang putih",
            "Kecap manis",
            "Garam",
            "Minyak goreng"
        ],
        steps: [
            "Rebus mie hingga setengah matang, tiriskan",
            "Panaskan minyak, tumis bawang merah dan bawang putih",
            "Masukkan sayuran, tumis hingga layu",
            "Tambahkan mie, aduk rata",
            "Bumbui dengan kecap manis dan garam",
            "Aduk hingga semua bahan matang",
            "Sajikan dengan acar dan kerupuk"
        ]
    },
    {
        id: 3,
        title: "Soto Ayam",
        image: "image/Soto Ayam 23.jpg",
        ingredients: [
            "Ayam",
            "Bawang merah",
            "Bawang putih",
            "Kunyit",
            "Jahe",
            "Serai",
            "Daun jeruk",
            "Garam"
        ],
        steps: [
            "Rebus ayam hingga matang, angkat dan suwir-suwir",
            "Haluskan bawang merah, bawang putih, kunyit, dan jahe",
            "Tumis bumbu halus dengan serai dan daun jeruk hingga harum",
            "Masukkan kaldu ayam, didihkan",
            "Bumbui dengan garam",
            "Sajikan dengan ayam suwir, tauge, dan bahan pelengkap lainnya"
        ]
    },
    {
        id: 4,
        title: "Pancake Pisang",
        image: "https://source.unsplash.com/random/800x600/?pancake",
        ingredients: [
            "Tepung terigu",
            "Pisang",
            "Telur",
            "Susu cair",
            "Gula",
            "Mentega",
            "Baking powder"
        ],
        steps: [
            "Haluskan pisang dalam mangkuk",
            "Campurkan tepung, gula, dan baking powder",
            "Tambahkan telur dan susu, aduk rata",
            "Masukkan pisang yang sudah dihaluskan",
            "Panaskan wajan dengan sedikit mentega",
            "Tuang adonan, masak hingga matang kedua sisinya",
            "Sajikan dengan madu atau sirup maple"
        ]
    }
];

// Variabel global
let selectedIngredients = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentRecipes = [...recipes];

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const ingredientInput = document.getElementById('ingredient-input');
const addIngredientBtn = document.getElementById('add-ingredient-btn');
const ingredientsTags = document.getElementById('ingredients-tags');
const filterBtn = document.getElementById('filter-btn');
const resetBtn = document.getElementById('reset-btn');
const showFavoritesBtn = document.getElementById('show-favorites-btn');
const recipesContainer = document.getElementById('recipes-container');
const recipeModal = document.getElementById('recipe-modal');
const closeModal = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalIngredients = document.getElementById('modal-ingredients');
const modalSteps = document.getElementById('modal-steps');
const favoriteBtn = document.getElementById('favorite-btn');

// Fungsi untuk menampilkan resep
function displayRecipes(recipesToDisplay) {
    recipesContainer.innerHTML = '';
    
    if (recipesToDisplay.length === 0) {
        recipesContainer.innerHTML = '<p>Tidak ada resep yang ditemukan.</p>';
        return;
    }
    
    recipesToDisplay.forEach(recipe => {
        const isFavorited = favorites.includes(recipe.id);
        
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
            <div class="recipe-info">
                <h3 class="recipe-title">${recipe.title}</h3>
                <p class="recipe-ingredients">${recipe.ingredients.join(', ')}</p>
                <div class="recipe-actions">
                    <button class="view-btn" data-id="${recipe.id}">Lihat Resep</button>
                    <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-id="${recipe.id}">
                        ${isFavorited ? '❤️ Favorit' : '♡ Favorit'}
                    </button>
                </div>
            </div>
        `;
        recipesContainer.appendChild(recipeCard);
    });
    
    // Tambahkan event listener untuk tombol lihat resep
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const recipeId = parseInt(e.target.getAttribute('data-id'));
            showRecipeModal(recipeId);
        });
    });
    
    // Tambahkan event listener untuk tombol favorit
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const recipeId = parseInt(e.target.getAttribute('data-id'));
            toggleFavorite(recipeId);
        });
    });
}

// Fungsi untuk menampilkan modal resep
function showRecipeModal(recipeId) {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    modalTitle.textContent = recipe.title;
    modalImage.src = recipe.image;
    modalImage.alt = recipe.title;
    
    // Isi bahan-bahan
    modalIngredients.innerHTML = '';
    recipe.ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = ingredient;
        modalIngredients.appendChild(li);
    });
    
    // Isi langkah-langkah
    modalSteps.innerHTML = '';
    recipe.steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        modalSteps.appendChild(li);
    });
    
    // Set status tombol favorit
    const isFavorited = favorites.includes(recipe.id);
    favoriteBtn.textContent = isFavorited ? '❤️ Hapus dari Favorit' : '♡ Tambahkan ke Favorit';
    favoriteBtn.className = isFavorited ? 'favorited' : '';
    favoriteBtn.setAttribute('data-id', recipe.id);
    
    // Tampilkan modal
    recipeModal.style.display = 'block';
}

// Fungsi untuk menutup modal
function closeRecipeModal() {
    recipeModal.style.display = 'none';
}

// Fungsi untuk toggle favorit
function toggleFavorite(recipeId) {
    const index = favorites.indexOf(recipeId);
    if (index === -1) {
        favorites.push(recipeId);
    } else {
        favorites.splice(index, 1);
    }
    
    // Simpan ke localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Refresh tampilan
    if (showFavoritesBtn.classList.contains('active')) {
        showFavorites();
    } else {
        displayRecipes(currentRecipes);
    }
}

// Fungsi untuk mencari resep
function searchRecipes() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (!searchTerm) {
        currentRecipes = [...recipes];
        displayRecipes(currentRecipes);
        return;
    }
    
    currentRecipes = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm))
    );
    
    displayRecipes(currentRecipes);
}

// Fungsi untuk menambahkan bahan ke filter
function addIngredient() {
    const ingredient = ingredientInput.value.trim();
    
    if (ingredient && !selectedIngredients.includes(ingredient)) {
        selectedIngredients.push(ingredient);
        updateIngredientsTags();
        ingredientInput.value = '';
    }
}

// Fungsi untuk memperbarui tampilan tag bahan
function updateIngredientsTags() {
    ingredientsTags.innerHTML = '';
    
    selectedIngredients.forEach(ingredient => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            ${ingredient}
            <span class="tag-remove" data-ingredient="${ingredient}">&times;</span>
        `;
        ingredientsTags.appendChild(tag);
    });
    
    // Tambahkan event listener untuk tombol hapus
    document.querySelectorAll('.tag-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const ingredientToRemove = e.target.getAttribute('data-ingredient');
            selectedIngredients = selectedIngredients.filter(ing => ing !== ingredientToRemove);
            updateIngredientsTags();
        });
    });
}

// Fungsi untuk filter resep berdasarkan bahan
function filterByIngredients() {
    if (selectedIngredients.length === 0) {
        alert('Tambahkan bahan terlebih dahulu!');
        return;
    }
    
    currentRecipes = recipes.filter(recipe => 
        selectedIngredients.every(ing => 
            recipe.ingredients.some(recipeIng => 
                recipeIng.toLowerCase().includes(ing.toLowerCase())
            )
        )
    );
    
    displayRecipes(currentRecipes);
}

// Fungsi untuk reset filter
function resetFilters() {
    searchInput.value = '';
    ingredientInput.value = '';
    selectedIngredients = [];
    updateIngredientsTags();
    currentRecipes = [...recipes];
    showFavoritesBtn.classList.remove('active');
    displayRecipes(currentRecipes);
}

// Fungsi untuk menampilkan favorit
function showFavorites() {
    showFavoritesBtn.classList.toggle('active');
    
    if (showFavoritesBtn.classList.contains('active')) {
        currentRecipes = recipes.filter(recipe => favorites.includes(recipe.id));
        displayRecipes(currentRecipes);
    } else {
        currentRecipes = [...recipes];
        displayRecipes(currentRecipes);
    }
}

// Event Listeners
searchBtn.addEventListener('click', searchRecipes);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchRecipes();
});

addIngredientBtn.addEventListener('click', addIngredient);
ingredientInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addIngredient();
});

filterBtn.addEventListener('click', filterByIngredients);
resetBtn.addEventListener('click', resetFilters);
showFavoritesBtn.addEventListener('click', showFavorites);
closeModal.addEventListener('click', closeRecipeModal);
favoriteBtn.addEventListener('click', (e) => {
    const recipeId = parseInt(e.target.getAttribute('data-id'));
    toggleFavorite(recipeId);
    closeRecipeModal();
});

// Tutup modal saat klik di luar modal
window.addEventListener('click', (e) => {
    if (e.target === recipeModal) {
        closeRecipeModal();
    }
});

// Inisialisasi tampilan
displayRecipes(recipes);