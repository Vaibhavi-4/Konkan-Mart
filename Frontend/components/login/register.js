const backendURL = "http://localhost:4000";
const passwordInput = document.getElementById("password");
const allFields = { password: passwordInput ? passwordInput.value : "" };


// ---- VALIDATION ----
function validateField(name, value, allFields = {}) {
  let error = "";

  if (name === "fullname") {
    if (!value.trim()) error = "Full name is required";
    else if (value.length < 3)
      error = "Full name must be at least 3 characters long";
  }

  if (name === "email") {
    if (!value.trim()) error = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(value)) error = "Invalid email format";
  }

  if (name === "username") {
    if (!value.trim()) error = "Username is required";
    else if (value.length < 3)
      error = "Username must be at least 3 characters long";
    else if (value.length > 20)
      error = "Username cannot exceed 20 characters";
  }

  if (name === "password") {
    if (!value) error = "Password is required";
    else if (value.length < 6)
      error = "Password must be at least 6 characters long";
    else if (!/[A-Z]/.test(value))
      error = "Password must include one uppercase letter";
    else if (!/[0-9]/.test(value))
      error = "Password must include one number";
  }

  if (name === "confirmPassword") {
    if (!value) error = "Please confirm your password";
    else if (value !== allFields.password)
      error = "Passwords do not match";
  }

  return error;
}

// ---- REALTIME VALIDATION ----
function attachRealtimeValidation(formId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll("input");

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      const allFields = {
        password: document.getElementById("password").value,
      };
      const error = validateField(input.name, input.value, allFields);
      const errorSpan = document.getElementById(`${input.name}-error`);
      errorSpan.textContent = error;
      errorSpan.style.color = error ? "red" : "green";
    });
  });
}

// ---- REGISTER FUNCTION ----
async function register() {
  const fullname = document.getElementById("fullname").value;
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const messageBox = document.getElementById("message");

  const allFields = { password };
  const fields = { fullname, email, username, password, confirmPassword };
  let hasError = false;

  // Validate all before submitting
  for (const [name, value] of Object.entries(fields)) {
    const error = validateField(name, value, allFields);
    document.getElementById(`${name}-error`).textContent = error;
    if (error) hasError = true;
  }

  if (hasError) {
    messageBox.style.color = "red";
    messageBox.textContent = "Please fix all errors before submitting.";
    return;
  }

  try {
    const res = await fetch(`${backendURL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullname, email, username, password }),
    });

    const data = await res.json();

    if (data.success) {
      messageBox.style.color = "green";
      messageBox.textContent = "Account created successfully!";
      alert("Account created successfully!");
      window.location.href = "login.html";
    } else {
      messageBox.style.color = "red";
      messageBox.textContent = data.message || "Registration failed!";
    }
  } catch (err) {
    console.error("Register error:", err);
    messageBox.style.color = "red";
    messageBox.textContent = "Server error. Please try again later.";
  }
}

// ---- INITIATE ----
window.onload = () => {
  attachRealtimeValidation("registerForm");
};
