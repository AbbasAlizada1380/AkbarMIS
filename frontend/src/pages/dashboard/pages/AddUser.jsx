import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { createUser, getUsers } from "../services/UserServices";

const AddUser = () => {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [roles] = useState([{ id: 1, name: "reception" }]);
  const [users, setUsers] = useState([]);

  // Fetch users on component mount
  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      // Adjust based on your service response structure
      setUsers(res || []);
      console.log(res);
      
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "رمز عبور مطابقت ندارد!",
        text: "لطفاً رمز عبور و تکرار آن را یکسان وارد کنید.",
        confirmButtonText: "باشه",
      });
      return;
    }

    try {
      // Use your service function to create the user
      const newUser = await createUser({
        fullname: form.fullname,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      Swal.fire({
        icon: "success",
        title: "کاربر اضافه شد!",
        text: `${newUser.fullname} با نقش ${newUser.role} ثبت شد.`,
      });

      // Reset the form
      setForm({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
      });

      // Refresh user list
      fetchUsers();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "خطا در ثبت کاربر",
        text:
          err.response?.data?.message || err.message || "مشکلی پیش آمده است.",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 mt-10">
      <h2 className="text-xl font-bold text-center mb-6 text-gray-700">
        افزودن کاربر جدید
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Fullname */}
        <div className="relative">
          <input
            type="text"
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder=" "
            required
          />
          <label className="absolute text-gray-500 text-sm left-3 top-2 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">
            نام کامل
          </label>
        </div>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder=" "
            required
          />
          <label className="absolute text-gray-500 text-sm left-3 top-2 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">
            ایمیل
          </label>
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder=" "
            required
          />
          <label className="absolute text-gray-500 text-sm left-3 top-2 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">
            رمز عبور
          </label>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder=" "
            required
          />
          <label className="absolute text-gray-500 text-sm left-3 top-2 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm">
            تکرار رمز عبور
          </label>
        </div>

        {/* Role */}
        <div className="relative">
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">انتخاب نقش</option>
            {roles.map((r) => (
              <option key={r.id} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition-all"
        >
          افزودن کاربر
        </button>
      </form>

      {/* Users Table */}
      <table className="w-full mt-6 border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Full Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) &&
            users.map((user) => (
              <tr key={user.id}>
                <td className="p-2 border">{user.fullname}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">{user.role}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddUser;
