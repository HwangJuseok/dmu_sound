import React, { useState } from 'react';
import "../styles/Register.css";
const Register = () => {
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, userPw, userName })
    });

    const result = await response.json();
    setMessage(result.message);
    setSuccess(result.success);
  };

  return (
      <div className="register-container">
        <h1>회원가입</h1>
        <form onSubmit={handleSubmit}>
          <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="아이디" required />
          <input type="password" value={userPw} onChange={(e) => setUserPw(e.target.value)} placeholder="비밀번호" required />
          <input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="이름" required />
          <button type="submit">가입하기</button>
        </form>
        {message && (
          <div className={`register-message ${success ? "success" : "error"}`}>
            <p>{message}</p>
            {success ? <a href="/auth/login">로그인하러 가기</a> : null}
          </div>
        )}
      </div>

  );
};

export default Register;