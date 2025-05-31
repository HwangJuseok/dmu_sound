// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 디버깅용 콘솔 로그 추가
    useEffect(() => {
        console.log('AuthContext - User state changed:', user);
        console.log('AuthContext - Loading state:', loading);
    }, [user, loading]);

    // 로그인 상태 확인
    const checkAuthStatus = async () => {
        console.log('AuthContext - Checking auth status...');
        try {
            // 먼저 localStorage 확인
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    console.log('AuthContext - Found stored user:', userData);
                    setUser(userData);
                } catch (e) {
                    console.error('AuthContext - Invalid stored user data');
                    localStorage.removeItem('user');
                }
            }

            // 서버 상태도 확인
            const response = await fetch('/api/auth/status', {
                credentials: 'include'
            });
            const data = await response.json();
            console.log('AuthContext - Auth status response:', data);

            if (data.success) {
                const userData = { userId: data.token || data.message };
                console.log('AuthContext - Setting user from server:', userData);
                setUser(userData);
                // localStorage에도 저장
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                console.log('AuthContext - Auth check failed, clearing user');
                setUser(null);
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error('Auth status check failed:', error);
            // 네트워크 오류시 localStorage 데이터 유지
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    // 로그인 함수
    const login = async (userId, userPw) => {
        console.log('AuthContext - Login attempt for:', userId);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ userId, userPw })
            });

            const data = await response.json();
            console.log('AuthContext - Login response:', data);

            if (data.success) {
                const userData = { userId: userId };
                console.log('AuthContext - Login successful, setting user:', userData);
                setUser(userData);

                // localStorage에도 저장
                localStorage.setItem('user', JSON.stringify(userData));

                return { success: true };
            } else {
                console.log('AuthContext - Login failed:', data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: '서버 연결 오류가 발생했습니다.' };
        }
    };

    // 로그아웃 함수
    const logout = async () => {
        console.log('AuthContext - Logout attempt');
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            console.log('AuthContext - Logout API call successful');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            console.log('AuthContext - Clearing user state');
            setUser(null);
            // 로컬스토리지 정리
            localStorage.removeItem('user');
            localStorage.removeItem('myPlaylists');
        }
    };

    // 회원가입 함수
    const register = async (userId, userPw, userName) => {
        console.log('AuthContext - Register attempt for:', userId);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ userId, userPw, userName })
            });

            const result = await response.json();
            console.log('AuthContext - Register response:', result);
            return result;
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, message: '서버 연결 오류가 발생했습니다.' };
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const value = {
        user,
        loading,
        login,
        logout,
        register,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};