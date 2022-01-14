//Alert functions to check login status
const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

//Alert functions to check login status
const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, time * 1000);
};

//Signup/Register function on HTML
const signup = async (name, surname, username, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/user/signup",
      data: {
        name,
        surname,
        username,
        password,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Registered successfully!")
      window.setTimeout(() => {
        location.assign("/login");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message)
    window.setTimeout(() => {
      location.assign("/register")
    }, 1500)
  }
};

const registerForm = document.querySelector("#form-register")

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const firstname = document.getElementById("first_name").value;
  const lastname = document.getElementById("last_name").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  signup(firstname, lastname, username, password)
});
