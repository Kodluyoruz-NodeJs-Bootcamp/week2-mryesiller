//Alert functions to check login status
const hideAlert = () => {
  const el = document.querySelector(".alert")
  if (el) el.parentElement.removeChild(el)
}

//Alert functions to check login status
const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup)
  window.setTimeout(hideAlert, time * 1000);
}

//User HTML settings logout function
const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/user/logout",
    })

    if (res.data.status === "success") {
      showAlert("success", "Log out successfully!");
      window.setTimeout(() => {
        location.assign("/")
      }, 1500)
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    window.setTimeout(() => {
      location.assign("/")
    }, 1500)
  }
}

//Check data on database and get data of Users from database
const data = async () => {
  const res = await axios({
    method: "GET",
    url: "users/data",
  })
  var div = document.querySelector(".text")
  var listusers = document.querySelector("#list_users")
  const text = []
  let listitems = ""
  for (let i = 0; i < res.data.users.length; i++) {
    text.push({
      name: res.data.users[i].name,
      surname: res.data.users[i].surname,
      username: res.data.users[i].username,
    })
  }
  for (items of text) {
    listitems +=
      "<li>" +
      "Name:" +
      items.name +
      " " +
      "Surname:" +
      items.surname +
      " " +
      "Username:" +
      items.username +
      "</li>"
  }
  div.style.visibility = "visible"
  listusers.innerHTML = listitems
};
