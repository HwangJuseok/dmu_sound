import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import "../styles/Login.css";
const Login = () => {
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        console.log('Login attempt:', { userId });

        try {
            // AuthContext의 login 함수 사용
            const result = await login(userId, userPw);

            console.log('Login result:', result);

            if (result.success) {
                console.log('Login successful, redirecting...');
                // React Router로 리다이렉트 (페이지 새로고침 없이)
                navigate('/', { replace: true });
            } else {
                setError(result.message || '로그인 실패');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
        };

        return (
        <div className="login-container">
            <h1>로그인</h1>
            {error && <p className="login-error">{error}</p>}
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="아이디"
                    required
                    disabled={isLoading}
                />
                <input
                    type="password"
                    value={userPw}
                    onChange={(e) => setUserPw(e.target.value)}
                    placeholder="비밀번호"
                    required
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? '로그인 중...' : '로그인'}
                </button>
            </form>
            <div className="login-links">

                <a href="/auth/register">회원가입 하기</a>
            </div>
        </div>
    );

};

export default Login;