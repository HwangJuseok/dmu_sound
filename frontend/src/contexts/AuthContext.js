import React, { createContext, useState, useContext, useEffect } from 'react';


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

    // 상태 변경 디버깅
    useEffect(() => {
        console.log('AuthContext - User state changed:', user);
        console.log('AuthContext - Loading state:', loading);
    }, [user, loading]);

    // 로그인 함수
    const login = async (userId, userPw) => {
        try {
            console.log('AuthContext - Attempting login with:', { userId });

            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ userId, userPw })
            });

            console.log('AuthContext - Login response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('AuthContext - Login successful, response:', data);

                if (data.success) {
                    const userData = { userId: userId };
                    setUser(userData);

                    // 메모리에 사용자 정보 저장 (세션 유지용)
                    const userInfo = {
                        userId: userId,
                        loginTime: new Date().toISOString()
                    };

                    window.sessionUser = userInfo;

                    return { success: true };
                } else {
                    console.log('AuthContext - Login failed:', data.message);
                    return { success: false, message: data.message };
                }
            } else {
                const errorData = await response.json();
                console.log('AuthContext - Login failed:', errorData);
                return { success: false, message: errorData.message || '로그인 실패' };
            }
        } catch (error) {
            console.error('AuthContext - Login error:', error);
            return { success: false, message: '서버 연결 오류가 발생했습니다.' };
        }
    };

    // 회원가입 함수
    const register = async (userId, userPw, userName) => {
        try {
            console.log('AuthContext - Attempting register with:', { userId, userName });

            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ userId, userPw, userName })
            });

            console.log('AuthContext - Register response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('AuthContext - Register successful:', result);
                return result;
            } else {
                const errorData = await response.json();
                console.log('AuthContext - Register failed:', errorData);
                return { success: false, message: errorData.message || '회원가입 실패' };
            }
        } catch (error) {
            console.error('AuthContext - Register error:', error);
            return { success: false, message: '서버 연결 오류가 발생했습니다.' };
        }
    };

    // 로그아웃 함수
    const logout = async () => {
        console.log('AuthContext - Logging out user');
        try {
            // 백엔드 로그아웃 API 호출 (선택사항)
            await fetch('http://localhost:8080/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            console.log('AuthContext - Backend logout successful');
        } catch (error) {
            console.error('AuthContext - Backend logout error:', error);
        } finally {
            // 프론트엔드 상태 정리
            setUser(null);
            delete window.sessionUser;

            // 페이지 새로고침으로 완전한 로그아웃 상태 보장
            window.location.href = '/';
        }
    };

    // 초기 사용자 상태 확인 (페이지 새로고침 시)
    useEffect(() => {
        const initializeAuth = () => {
            setLoading(true);

            try {
                // 메모리에서 사용자 정보 확인
                const sessionUser = window.sessionUser;

                if (sessionUser) {
                    // 세션이 유효한지 확인 (24시간 제한)
                    const loginTime = new Date(sessionUser.loginTime);
                    const now = new Date();
                    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

                    if (hoursDiff < 24) {
                        console.log('AuthContext - Restoring user session:', sessionUser);
                        setUser({
                            userId: sessionUser.userId,
                            loginTime: sessionUser.loginTime
                        });
                    } else {
                        console.log('AuthContext - Session expired, clearing user');
                        delete window.sessionUser;
                    }
                }
            } catch (error) {
                console.error('AuthContext - Error initializing auth:', error);
            } finally {
                setLoading(false);
            }
        };

        // 컴포넌트 마운트 시 초기화
        initializeAuth();
    }, []);

    const value = {
        user,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};