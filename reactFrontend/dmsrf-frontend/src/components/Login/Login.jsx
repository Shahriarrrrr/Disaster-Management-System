import React, { useState, useContext } from "react"; // ✅ import useContext
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constant";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // ✅ import context

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { updateToken } = useContext(AuthContext); // ✅ get updateToken from context

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/api/token/', {
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (res.status === 200) {
                // ✅ store refresh token as usual
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

                // ✅ use context to update the token and trigger user fetch
                updateToken(res.data.access);

                navigate("/"); // redirect to home
            }
        } catch (error) {
            console.error(error);
            alert("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return ( 
        <div className="hero bg-amber-600 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
            quasi. In deleniti eaque aut repudiandae et a id nisi.
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          {/* Wrap the form fields in a <form> tag */}
          <form onSubmit={handleSubmit} className="card-body">
            <div className="form-control"> {/* Use form-control for proper spacing with DaisyUI */}
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered" // Added input-bordered for DaisyUI styling
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-control"> {/* Use form-control for proper spacing with DaisyUI */}
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered" // Added input-bordered for DaisyUI styling
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">Forgot password?</a> {/* Changed to href="#" for now */}
              </label>
            </div>
            <div className="form-control mt-6">
              <button
                type="submit" // Important: type="submit" for form buttons
                className="btn btn-primary" // Use btn-primary for DaisyUI styling
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    );
};

export default Login;
