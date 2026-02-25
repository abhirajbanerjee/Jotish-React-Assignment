// pages/LoginPage.jsx — React Hook Form + hardcoded auth. Redirects on success.
import { useForm } from 'react-hook-form';
import { useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const VALID_USER = { username: 'testuser', password: 'Test123' };

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();

    // If already logged in, skip to list
    if (localStorage.getItem('auth') === 'true') {
        return <Navigate to="/list" replace />;
    }

    const onSubmit = ({ username, password }) => {
        if (username === VALID_USER.username && password === VALID_USER.password) {
            localStorage.setItem('auth', 'true');
            toast.success('Welcome back! 👋', { icon: '✅' });
            navigate('/list');
        } else {
            toast.error('Invalid credentials. Try testuser / Test123');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-logo">
                    <span>💼</span>
                </div>
                <h1 className="login-title">Employee Directory</h1>
                <p className="login-subtitle">Sign in to access your workspace</p>

                <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            id="username"
                            type="text"
                            className={`form-input${errors.username ? ' input-error' : ''}`}
                            placeholder="testuser"
                            {...register('username', { required: 'Username is required' })}
                        />
                        {errors.username && <p className="error-message">{errors.username.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            className={`form-input${errors.password ? ' input-error' : ''}`}
                            placeholder="••••••••"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                            })}
                        />
                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Signing in…' : 'Sign In →'}
                    </button>
                </form>

                <p className="login-hint">
                    Demo credentials: <strong>testuser</strong> / <strong>Test123</strong>
                </p>
            </div>
        </div>
    );
}
