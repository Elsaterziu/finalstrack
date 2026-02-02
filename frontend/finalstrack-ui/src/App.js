import { login } from "./api/authApi";

function App() {
  const handleLogin = async () => {
    try {
      const res = await login("admin@test.com", "123456");
      console.log("LOGIN OK:", res);
      localStorage.setItem("accessToken", res.accessToken);
    } catch (err) {
      console.error("LOGIN ERROR:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>FinalsTrack Frontend</h1>
      <button onClick={handleLogin}>Test Login</button>
    </div>
  );
}

export default App;
