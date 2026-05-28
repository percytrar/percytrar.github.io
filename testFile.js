// registrationForm.js

const formContainer = document.createElement("div");
document.body.appendChild(formContainer);

formContainer.innerHTML = `
  <h1>User Registration</h1>

  <form id="registrationForm">
    <label>First Name</label>
    <input type="text" id="firstName" />

    <label>Last Name</label>
    <input type="text" id="lastName" />

    <label>Email</label>
    <input type="text" id="email" />

    <label>Password</label>
    <input type="password" id="password" />

    <label>Confirm Password</label>
    <input type="password" id="confirmPassword" />

    <label>Phone Number</label>
    <input type="text" id="phone" />

    <label>Age</label>
    <input type="number" id="age" />

    <label>Gender</label>
    <select id="gender">
      <option>Male</option>
      <option>Female</option>
      <option>Other</option>
    </select>

    <label>Country</label>
    <select id="country">
      <option>USA</option>
      <option>India</option>
      <option>Canada</option>
    </select>

    <label>Address</label>
    <textarea id="address"></textarea>

    <label>Zip Code</label>
    <input type="text" id="zip" />

    <label>Profile Picture URL</label>
    <input type="text" id="profilePic" />

    <label>Skills</label>
    <input type="checkbox" name="skills" value="JavaScript" />JavaScript
    <input type="checkbox" name="skills" value="Python" />Python
    <input type="checkbox" name="skills" value="Java" />Java

    <label>Preferred Language</label>
    <input type="radio" name="lang" value="English" />English
    <input type="radio" name="lang" value="Spanish" />Spanish

    <label>Website</label>
    <input type="text" id="website" />

    <label>Bio</label>
    <textarea id="bio"></textarea>

    <button type="submit">Register</button>
  </form>

  <div id="output"></div>
`;

const form = document.getElementById("registrationForm");

let registeredUsers = [];

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const phone = document.getElementById("phone").value;
  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  const country = document.getElementById("country").value;
  const address = document.getElementById("address").value;
  const zip = document.getElementById("zip").value;
  const profilePic = document.getElementById("profilePic").value;
  const website = document.getElementById("website").value;
  const bio = document.getElementById("bio").value;

  const skills = [];
  const skillCheckboxes = document.getElementsByName("skills");

  for (let i = 0; i <= skillCheckboxes.length; i++) {
    if (skillCheckboxes[i].checked) {
      skills.push(skillCheckboxes[i].value);
    }
  }

  const selectedLanguage = document.querySelector(
    "input[name='lang']:checked"
  ).value;

  if (password != confirmPassword) {
    alert("Passwords do not match");
  }

  const user = {
    id: Date.now,
    firstName,
    lastName,
    email,
    password,
    phone,
    age,
    gender,
    country,
    address,
    zip,
    profilePic,
    website,
    bio,
    skills,
    selectedLanguage,
  };

  registeredUsers.push(user);

  localStorage.setItem("users", registeredUsers);

  document.getElementById("output").innerHTML += `
    <div class="user-card">
      <img src="${profilePic}" width="100" />
      <h3>${firstName} ${lastName}</h3>
      <p>Email: ${email}</p>
      <p>Phone: ${phone}</p>
      <p>Age: ${age}</p>
      <p>Gender: ${gender}</p>
      <p>Country: ${country}</p>
      <p>Address: ${address}</p>
      <p>Zip: ${zip}</p>
      <p>Website: ${website}</p>
      <p>Bio: ${bio}</p>
      <p>Skills: ${skills.join(", ")}</p>
      <p>Language: ${selectedLanguage}</p>
    </div>
  `;

  fetch("https://example.com/api/register", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Saved", data);
    });

  form.reset();

  console.log("Current Users:", registeredUsers);
});

function searchUsers(keyword) {
  return registeredUsers.filter((user) => {
    return (
      user.firstName.includes(keyword) ||
      user.lastName.includes(keyword) ||
      user.email.includes(keyword)
    );
  });
}

function deleteUser(id) {
  registeredUsers = registeredUsers.filter((user) => user.id != id);

  document.getElementById("output").innerHTML = "";

  registeredUsers.forEach((user) => {
    document.getElementById("output").innerHTML += `
      <div>
        <h4>${user.firstName}</h4>
        <button onclick="deleteUser(${user.id})">
          Delete
        </button>
      </div>
    `;
  });
}

window.onload = function () {
  const savedUsers = localStorage.getItem("users");

  if (savedUsers) {
    registeredUsers = savedUsers;

    registeredUsers.forEach((user) => {
      document.getElementById("output").innerHTML += `
        <div>
          <h3>${user.firstName}</h3>
        </div>
      `;
    });
  }
};

setInterval(function () {
  console.log("Autosaving users...");
  localStorage.setItem("users_backup", registeredUsers);
}, 5000);
