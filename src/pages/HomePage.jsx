import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import Logout from '../components/Logout';
import { useNavigate } from 'react-router-dom';
import CryptoList from '../components/CryptoList';
import SearchBar from '../components/SearchBar';
import CryptoChart from '../components/CryptoChart';
import axiosInstance from '../api/axiosInstance';
import Swal from 'sweetalert2';

const HomePage = () => {
    const { token } = useContext(AuthContext);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const [cryptos, setCryptos] = useState([]);
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [favoriteCryptoIds, setFavoriteCryptoIds] = useState([]);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);



    // Estados para paginado
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchUserName();
        fetchAllCryptos();
        fetchUserFavorites();
    }, [token, navigate]);

    useEffect(() => {
        setCurrentPage(1); // Resetear paginación al cambiar filtro
    }, [showFavoritesOnly]);

    const fetchUserName = async () => {
        try {
            const response = await axiosInstance.get('/user');
            setUserName(response.data.name);
        } catch (error) {
            console.error('Error al obtener el nombre del usuario:', error);
        }
    };


    const fetchAllCryptos = async () => {
        try {
            const response = await axiosInstance.get('/cryptos');
            setCryptos(response.data);
            setShowFavoritesOnly(false); // desactiva filtro al cargar todas
        } catch (error) {
            console.error('Error al obtener criptomonedas:', error);
            Swal.fire('Error', 'Error al obtener criptomonedas', 'error');
        }
    };

    const fetchUserFavorites = async () => {
        try {
            const response = await axiosInstance.get('/usuarios/');
            const ids = response.data.map(item => item.id);
            setFavoriteCryptoIds(ids);
        } catch (error) {
            console.error('Error al obtener criptomonedas seguidas:', error);
            Swal.fire('Error', 'Error al obtener criptomonedas seguidas', 'error');
        }
    };

    const handleSearch = async (query) => {
        if (!query.trim()) {
            fetchAllCryptos(); // si está vacío, cargar todas
            return;
        }
        try {
            const response = await axiosInstance.get(`/cryptos/search?query=${query}`);
            setCryptos(response.data);
        } catch (error) {
            console.error('Error al buscar criptomonedas:', error);
            if (error.response?.status === 404) {
                setCryptos([]);
                Swal.fire('Sin resultados', 'No se encontraron criptomonedas con ese término.', 'warning');
            } else {
                Swal.fire('Error', 'Error al buscar criptomonedas', 'error');
            }
        }
    };

    const handleSelectCrypto = async (crypto) => {
        setSelectedCrypto(crypto);
        try {
            const now = new Date();
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            const endDate = end.toISOString().split('.')[0];
            const start = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];

            const response = await axiosInstance.get(`/cryptos/${crypto.id}/history?start=${start}&end=${endDate}`);
            const formattedData = response.data.map((item) => ({
                precio: parseFloat(item.precio_usd),
                fecha: new Date(item.fecha_hora).toLocaleString('es-CO', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit'
                })
            }));
            setChartData(formattedData);
        } catch (error) {
            console.error('Error al obtener historial:', error);
            Swal.fire('Error', 'Error al obtener historial de la criptomoneda', 'error');
        }
    };

    const toggleFollowCrypto = async (crypto_id) => {
        try {
            if (favoriteCryptoIds.includes(crypto_id)) {
                await axiosInstance.post(`/usuarios/remove/`, { cryptoId: crypto_id });
                setFavoriteCryptoIds(favoriteCryptoIds.filter(id => id !== crypto_id));
            } else {
                await axiosInstance.post(`/usuarios/add`, { cryptoId: crypto_id });
                setFavoriteCryptoIds([...favoriteCryptoIds, crypto_id]);
            }
        } catch (error) {
            console.error('Error al seguir/no seguir criptomoneda:', error);
            Swal.fire('Error', 'Error al seguir/no seguir criptomoneda', 'error');
        }
    };

    // Filtrar si está activado "solo favoritas"
    const filteredCryptos = showFavoritesOnly
        ? cryptos.filter(c => favoriteCryptoIds.includes(c.id))
        : cryptos;

    // Paginación sobre filtradas
    const indexOfLastCrypto = currentPage * itemsPerPage;
    const indexOfFirstCrypto = indexOfLastCrypto - itemsPerPage;
    const currentCryptos = filteredCryptos.slice(indexOfFirstCrypto, indexOfLastCrypto);
    const totalPages = Math.ceil(filteredCryptos.length / itemsPerPage);

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 fw-bold mb-0">CryptoInvestment</h1>
                    {userName && <small className="text-muted">Bienvenido, {userName}</small>}
                </div>
                <Logout />
            </div>


            <div className="mb-3 d-flex gap-2">
                <button onClick={fetchAllCryptos} className="btn btn-primary">
                    Ver todas las criptomonedas
                </button>
                <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`btn ${showFavoritesOnly ? 'btn-outline-info' : 'btn-info'}`}
                >
                    {showFavoritesOnly ? 'Ver todas' : 'Ver solo favoritas'}
                </button>
            </div>

            <SearchBar onSearch={handleSearch} />

            <div className="d-flex justify-content-center my-3">
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Anterior</button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Siguiente</button>
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="row mt-4">
                <div className="col-md-6">
                    <CryptoList
                        cryptos={currentCryptos}
                        onSelectCrypto={handleSelectCrypto}
                        selectedCryptoId={selectedCrypto?.id}
                        favoriteCryptoIds={favoriteCryptoIds}
                        onToggleFollow={toggleFollowCrypto}
                    />
                </div>
                <div className="col-md-6">
                    {selectedCrypto && <CryptoChart crypto={selectedCrypto} data={chartData} />}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
