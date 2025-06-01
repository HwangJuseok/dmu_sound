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

    // 상태 변경 디버깅 - 더 자세한 로그
    useEffect(() => {
        console.log('=== AuthContext State Change ===');
        console.log('User:', user);
        console.log('User ID:', user?.userId);
        console.log('User Code:', user?.usercode);
        console.log('Loading:', loading);
        console.log('============================');
    }, [user, loading]);

    // 로그인 함수 수정 - usercode 저장 문제 해결
    const login = async (userId, userPw) => {
        try {
            console.log('🔐 AuthContext - Attempting login with:', { userId });

            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ userId, userPw })
            });

            console.log('📡 AuthContext - Login response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ AuthContext - Login successful, response:', data);

                if (data.success) {
                    // ⚠️ 중요: 백엔드 응답에서 usercode를 정확히 가져오기
                    const userData = {
                        userId: userId,
                        usercode: data.usercode || data.userCode, // 백엔드가 userCode로 보낼 수도 있음
                        loginTime: new Date().toISOString()
                    };

                    // usercode가 없으면 경고 출력
                    if (!userData.usercode) {
                        console.warn('⚠️ WARNING: usercode is missing from backend response!');
                        console.log('Backend response keys:', Object.keys(data));
                        console.log('Full backend response:', data);
                    }

                    console.log('👤 Setting user data:', userData);
                    setUser(userData);

                    // 메모리에 사용자 정보 저장 (세션 유지용)
                    window.sessionUser = userData;

                    // localStorage에도 백업 저장
                    try {
                        localStorage.setItem('userSession', JSON.stringify(userData));
                        console.log('💾 Saved to localStorage:', userData);
                    } catch (e) {
                        console.warn('LocalStorage not available:', e);
                    }

                    return { success: true };
                } else {
                    console.log('❌ AuthContext - Login failed:', data.message);
                    return { success: false, message: data.message };
                }
            } else {
                const errorData = await response.json();
                console.log('❌ AuthContext - Login failed:', errorData);
                return { success: false, message: errorData.message || '로그인 실패' };
            }
        } catch (error) {
            console.error('💥 AuthContext - Login error:', error);
            return { success: false, message: '서버 연결 오류가 발생했습니다.' };
        }
    };

    // 회원가입 함수
    const register = async (userId, userPw, userName) => {
        try {
            console.log('📝 AuthContext - Attempting register with:', { userId, userName });

            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ userId, userPw, userName })
            });

            console.log('📡 AuthContext - Register response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('✅ AuthContext - Register successful:', result);
                return result;
            } else {
                const errorData = await response.json();
                console.log('❌ AuthContext - Register failed:', errorData);
                return { success: false, message: errorData.message || '회원가입 실패' };
            }
        } catch (error) {
            console.error('💥 AuthContext - Register error:', error);
            return { success: false, message: '서버 연결 오류가 발생했습니다.' };
        }
    };

    // 로그아웃 함수
    const logout = async () => {
        console.log('🚪 AuthContext - Logging out user');
        try {
            // 백엔드 로그아웃 API 호출 (선택사항)
            await fetch('http://localhost:8080/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            console.log('✅ AuthContext - Backend logout successful');
        } catch (error) {
            console.error('❌ AuthContext - Backend logout error:', error);
        } finally {
            // 프론트엔드 상태 정리
            setUser(null);
            delete window.sessionUser;

            // localStorage도 정리
            try {
                localStorage.removeItem('userSession');
            } catch (e) {
                console.warn('LocalStorage cleanup error:', e);
            }

            // 페이지 새로고침으로 완전한 로그아웃 상태 보장
            window.location.href = '/';
        }
    };

    // 사용자 상태 확인 함수 (디버깅용)
    const checkAuthStatus = () => {
        console.log('🔍 Current Auth Status:');
        console.log('- User:', user);
        console.log('- SessionUser:', window.sessionUser);
        console.log('- Loading:', loading);

        try {
            const stored = localStorage.getItem('userSession');
            console.log('- LocalStorage:', stored ? JSON.parse(stored) : null);
        } catch (e) {
            console.log('- LocalStorage: Not available');
        }
    };

    // 초기 사용자 상태 확인 (페이지 새로고침 시) - usercode 복원 로직 개선
    useEffect(() => {
        const initializeAuth = () => {
            console.log('🚀 AuthContext - Initializing auth...');
            setLoading(true);

            try {
                let sessionUser = null;

                // 1. 메모리에서 사용자 정보 확인
                if (window.sessionUser) {
                    sessionUser = window.sessionUser;
                    console.log('📝 Found session in memory:', sessionUser);
                }

                // 2. localStorage에서 백업 확인
                if (!sessionUser) {
                    try {
                        const stored = localStorage.getItem('userSession');
                        if (stored) {
                            sessionUser = JSON.parse(stored);
                            console.log('💾 Found session in localStorage:', sessionUser);

                            // 메모리에도 복원
                            window.sessionUser = sessionUser;
                        }
                    } catch (e) {
                        console.warn('LocalStorage read error:', e);
                    }
                }

                // 3. usercode 검증 강화
                if (sessionUser && sessionUser.userId) {
                    // usercode가 없으면 경고 출력
                    if (!sessionUser.usercode) {
                        console.warn('⚠️ Session found but usercode is missing!');
                        console.log('Session data:', sessionUser);
                    }

                    // 세션이 유효한지 확인 (24시간 제한)
                    const loginTime = new Date(sessionUser.loginTime);
                    const now = new Date();
                    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

                    if (hoursDiff < 24) {
                        console.log('✅ AuthContext - Restoring user session:', sessionUser);
                        setUser({
                            userId: sessionUser.userId,
                            usercode: sessionUser.usercode, // usercode가 undefined일 수 있음
                            loginTime: sessionUser.loginTime
                        });
                    } else {
                        console.log('⏰ AuthContext - Session expired, clearing user');
                        delete window.sessionUser;
                        try {
                            localStorage.removeItem('userSession');
                        } catch (e) {
                            console.warn('LocalStorage cleanup error:', e);
                        }
                        setUser(null);
                    }
                } else {
                    console.log('❌ AuthContext - No valid session found');
                    setUser(null);
                }
            } catch (error) {
                console.error('💥 AuthContext - Error initializing auth:', error);
                setUser(null);
            } finally {
                setLoading(false);
                console.log('🏁 AuthContext - Initialization complete');
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
        logout,
        checkAuthStatus // 디버깅용 함수 추가
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};