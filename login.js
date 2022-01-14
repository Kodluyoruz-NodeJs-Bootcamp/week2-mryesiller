//Alert functions to check login status
const hideAlert = () => {
  const el = document.querySelector(".alert")
  if (el) el.parentElement.removeChild(el)
}

//Alert functions to check login status
const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup)
  window.setTimeout(hideAlert, time * 1000)
};

//Login function on html
const login = async (username, password) => {
    try {
      const res = await axios({
        method: 'POST',
        url: '/user/login',
        data: {
          username,
          password
        }
      });
  
      if (res.data.status === 'success') {
        showAlert('success', 'Logged in successfully!');
        window.setTimeout(() => {
          location.assign('/users')
        }, 1500)
      }
    } catch (err) {
      showAlert('error', err.response.data.message)
      window.setTimeout(() => {
        location.assign('/');
      }, 1500)
    }
  };

  const loginForm = document.querySelector("#form-login");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    login(username,password)  
  })

