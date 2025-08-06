import React from 'react';

const CryptoList = ({ cryptos, onSelectCrypto, selectedCryptoId, favoriteCryptoIds = [], onToggleFollow }) => {
    return (
        <div>
            {cryptos.map((crypto) => {
                const isFavorite = favoriteCryptoIds.includes(crypto.id);
                const isSelected = selectedCryptoId === crypto.id;

                return (
                    <div
                        key={crypto.id}
                        className={`card mb-3 ${isSelected ? 'border-success shadow' : ''}`}
                        onClick={() => onSelectCrypto(crypto)}
                        style={{
                            cursor: 'pointer',
                            borderWidth: isSelected ? '2px' : '1px',
                            borderColor: isSelected ? '#198754' : '#ced4da',
                        }}
                    >
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="card-title mb-1">
                                    {crypto.name} ({crypto.symbol})
                                </h5>
                                <p className="card-text mb-1">💰 Precio: ${crypto.price_usd}</p>
                                <p className="card-text mb-1">📊 Volumen 24h: ${crypto.volume_24h}</p>
                                <p
                                    className={`card-text mb-0 ${
                                        crypto.percent_change_24h > 0 ? 'text-success' : 'text-danger'
                                    }`}
                                >
                                    ⬆ Cambio 24h: {crypto.percent_change_24h}%
                                </p>
                            </div>
                            <div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleFollow(crypto.id);
                                    }}
                                    className={`btn btn-sm ${
                                        isFavorite ? 'btn-success' : 'btn-outline-secondary'
                                    }`}
                                >
                                    {isFavorite ? '✅ Siguiendo' : '⭐ Seguir'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CryptoList;
