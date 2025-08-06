import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { AuthContext } from '../auth/AuthContext';

const RegisterForm = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/auth/register', form);
            const response = await axios.post('/auth/login', {
                email: form.email,
                password: form.password
            });
            login(response.data.token);
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Error en el registro');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">Registro</h2>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Nombre de usuario</label>
                        <input
                            id="username"
                            name="username"
                            className="form-control"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Usuario"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Correo electrónico</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-control"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Correo"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="form-control"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Contraseña"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 mb-3">Registrarse</button>
                </form>

                <div className="text-center">
                    <span>¿Ya tienes cuenta? </span>
                    <button className="btn btn-link p-0" onClick={() => navigate('/login')}>
                        Inicia sesión aquí
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
