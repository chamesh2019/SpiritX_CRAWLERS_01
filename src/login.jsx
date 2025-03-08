import React, { useState } from "react";
import {
  usernameValidator,
  passwordValidator,
} from "./Validators";

export function Login() {
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isUsernameFocus, setIsUsernameFocus] = useState(false);
  const [isPasswordFocus, setIsPasswordFocus] = useState(false);

  const handleUsernameChange = (event) => {
    setIsUsernameValid(usernameValidator(event.target.value));
  };

  const handlePasswordChange = (event) => {
    setIsPasswordValid(passwordValidator(event.target.value));
  };

  const showToast = (content, status) => {
    let toast = document.querySelector(".toast");
    let toastContent = document.getElementById("toast-content");
    if (toastContent) {
      toastContent.innerText = content;
    }
    toast.classList.remove("hidden");

    if (status === 1) {
      document.querySelector(".alert")?.classList.add("alert-success");
    } else {
      document.querySelector(".alert")?.classList.add("alert-error");
    }

    setTimeout(() => {
      toast.classList.add("hidden");
      document.querySelector(".alert")?.classList.remove("alert-success");
      document.querySelector(".alert")?.classList.remove("alert-error");
    }, 3000);
  };

  const submitForm = () => {
    let data = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
    };
    // Send data to the server
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          showToast(data.message, 1);
          localStorage.setItem("token", data.token);
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        }
        if (data.status === "error") {
          showToast(data.message, 0);
        }
      })
      .catch(() => {
        showToast("Something went wrong, please try again later", 0);
      });
  };

  return (
    <>
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <div className="toast hidden">
          <div className="alert alert-info">
            <span id="toast-content"></span>
          </div>
        </div>

        <div
          className="p-6 flex flex-col items-center justify-center border rounded-lg border-gray-500"
          style={{ width: "90%", maxWidth: "500px" }}
        >
          <h1 className="text-2xl font-bold text-center">Secure Connect <br />Login</h1>
          <br />
          <fieldset className="fieldset w-2/3">
            <legend className="fieldset-legend">Username</legend>
            <input
              id="username"
              type="text"
              className={`input w-full outline-none focus:ring-0 focus:outline-none ${
                isUsernameFocus
                  ? !isUsernameValid
                    ? "input-error"
                    : "input-success"
                  : ""
              }`}
              onChange={handleUsernameChange}
              onFocus={() => setIsUsernameFocus(true)}
              placeholder="Username"
            />
            <p
              className={`fieldset-label text-error ${
                isUsernameFocus && !isUsernameValid ? "" : "hidden"
              }`}
            >
              Username must be longer than 6 letters
            </p>
          </fieldset>

          <fieldset className="fieldset w-2/3">
            <legend className="fieldset-legend">Password</legend>
            <input
              id="password"
              type="password"
              className={`input w-full outline-none focus:ring-0 focus:outline-none ${
                isPasswordFocus
                  ? !isPasswordValid
                    ? "input-error"
                    : "input-success"
                  : ""
              }`}
              onChange={(event) => {
                handlePasswordChange(event);
              }}
              onFocus={() => setIsPasswordFocus(true)}
              placeholder="Password"
            />

            <p
              className={`fieldset-label text-error ${
                isPasswordFocus && !isPasswordValid ? "" : "hidden"
              }`}
            >
              Password must be longer than 8 characters
            </p>
          </fieldset>

          <p className="m-2">
            Don't have an account? <a href="/signup" className="text-primary">Sign up</a>
          </p>

          <button
            className="btn w-2/3 bg-primary"
            disabled={!isUsernameValid || !isPasswordValid}
            onClick={submitForm}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
}
