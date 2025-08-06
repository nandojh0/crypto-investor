import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="input-group mb-4">
            <input
                type="text"
                className="form-control"
                placeholder="Buscar criptomoneda"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-outline-primary" type="submit">
                Buscar
            </button>
        </form>
    );
};

export default SearchBar;
