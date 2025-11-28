const backendURL = "http://localhost:4000";

// ---------- VALIDATION ----------
function validateLoginField(name, value) {
  let error = "";

  if (name === "username") {
    if (!value.trim()) error = "Username is required";
    else if (value.length < 3)
      error = "Username must be at least 3 characters long";
  }

  if (name === "password") {
    if (!value) error = "Password is required";
    else if (value.length < 6)
      error = "Password must be at least 6 characters long";
  }

  return error;
}

// ---------- LOGIN FUNCTION ----------
async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const messageBox = document.getElementById("message");

  // Validate fields
  const usernameError = validateLoginField("username", username);
  const passwordError = validateLoginField("password", password);

  document.getElementById("username-error").textContent = usernameError;
  document.getElementById("password-error").textContent = passwordError;

  if (usernameError || passwordError) {
    messageBox.style.color = "red";
    messageBox.textContent = "Please fix errors before logging in.";
    return;
  }

  try {
    const res = await fetch(`${backendURL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.success) {
      messageBox.style.color = "green";
      messageBox.textContent = "Login successful!";
      alert("Welcome, " + username + "!");

      //  Redirect to homepage after successful login
      window.location.href = "../homepage/homepage.html";
    } else {
      messageBox.style.color = "red";
      messageBox.textContent = data.message || "Invalid credentials!";
    }
  } catch (err) {
    console.error("Login error:", err);
    messageBox.style.color = "red";
    messageBox.textContent = "Server error. Please try again later.";
  }
}



