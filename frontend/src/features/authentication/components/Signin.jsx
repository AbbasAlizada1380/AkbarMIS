import React from "react";
import useSignin from "../hooks/useSignin";
import { useSelector } from "react-redux";

const Signin = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleSignin,
    isLoading,
    error,
  } = useSignin();
  const { currentUser } = useSelector((state) => state.user);
  const isActive = currentUser?.isActive; // ✅ safe optional chaining

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSignin}
        className="p-6 bg-white rounded-lg shadow-lg space-y-4 w-80"
      >
        <h2 className="text-xl font-semibold text-center">Sign In</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

        {error && <p className="text-red-600 text-center">{error}</p>}
        {isActive === false && (
          <p className="text-yellow-600 text-center">
            Your account is inactive.
          </p>
        )}
      </form>
    </div>
  );
};

export default Signin;
