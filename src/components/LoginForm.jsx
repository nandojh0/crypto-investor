import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { AuthContext } from '../auth/AuthContext';

const LoginForm = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/auth/login', { email, password });
            login(res.data.token);
            navigate('/home');
        } catch (error) {
            console.error('Error en login:', error);
            if (error.response && error.response.data) {
                alert(error.response.data.message || 'Error en login');
            } else if (error.request) {
                alert('No se recibió respuesta del servidor. Intenta de nuevo.');
            } else {
                alert('Ocurrió un error inesperado: ' + error.message);
            }
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Correo electrónico</label>
                        <input
                            id="email"
                            type="email"
                            className="form-control"
                            placeholder="Ej: usuario@correo.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            className="form-control"
                            placeholder="Tu contraseña"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-3">Ingresar</button>
                </form>

                <div className="text-center">
                    <span>¿No tienes cuenta? </span>
                    <button className="btn btn-link p-0" onClick={() => navigate('/register')}>
                        Regístrate aquí
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
