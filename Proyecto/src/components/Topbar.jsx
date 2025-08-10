import React from 'react';

const Topbar = ({ selectedCategory, onCategoryChange, searchText, onSearchTextChange }) => {
  const categories = [
    'Recomendación', 'Ropa', 'Comida', 'Maquillaje', 'Películas',
    'Trabajo', 'Emociones', 'Hogar', 'Juegos', 'Viajes', 'Fitness',
  ];

  return (
    <div className="topbar d-flex justify-content-between align-items-center px-4 py-2 bg-white shadow-sm sticky-top"
         style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <input
        type="text"
        className="form-control w-25"
        placeholder="Buscar publicaciones..."
        value={searchText}
        onChange={(e) => onSearchTextChange(e.target.value)}
        style={{ borderRadius: '20px' }}
      />

      <div className="d-flex flex-wrap justify-content-center gap-3 mx-3">
        <span
          className={`small fw-semibold ${selectedCategory === null ? 'text-primary' : 'text-secondary'}`}
          style={{ cursor: 'pointer' }}
          onClick={() => onCategoryChange(null)}
        >
          Todas
        </span>
        {categories.map((cat) => (
          <span
            key={cat}
            className={`small fw-semibold ${selectedCategory === cat ? 'text-primary' : 'text-secondary'}`}
            style={{ cursor: 'pointer' }}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </span>
        ))}
      </div>

      <div className="d-flex gap-3">
        <a href="#" className="text-decoration-none text-dark small fw-semibold">Centro creativo</a>
        <a href="#" className="text-decoration-none text-dark small fw-semibold">Cooperación empresarial</a>
      </div>
    </div>
  );
};

export default Topbar;





