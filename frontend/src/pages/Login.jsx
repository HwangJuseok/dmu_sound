import React, { useState } from 'react';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/auth/login/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, userPw })
    });

    if (response.redirected) {
      window.location.href = response.url;
    } else {
      const data = await response.json();
      setError(data.message || '로그인 실패');
    }
  };

  return (
    <div>
      <h1>로그인</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="아이디" required />
        <input type="password" value={userPw} onChange={(e) => setUserPw(e.target.value)} placeholder="비밀번호" required />
        <button type="submit">로그인</button>
      </form>
      <a href="/oauth2/authorization/google">Google로 로그인</a><br />
      <a href="/auth/register">회원가입 하기</a>
    </div>
  );
};

export default Login;