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

    // 로그인 상태 확인
    const checkAuthStatus = async () => {
        try {
            const response = await fetch('/api/auth/status', {
                credentials: 'include'
            });
            const data = await response.json();

            if (data.success) {
                setUser({ userId: data.token || data.message }); // 실제 사용자 정보로 설정
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Auth status check failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // 로그인 함수
    const login = async (userId, userPw) => {
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

            if (data.success) {
                setUser({ userId: userId });
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: '서버 연결 오류가 발생했습니다.' };
        }
    };

    // 로그아웃 함수
    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            // 로컬스토리지 정리
            localStorage.removeItem('myPlaylists');
        }
    };

    // 회원가입 함수
    const register = async (userId, userPw, userName) => {
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