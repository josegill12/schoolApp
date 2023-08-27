console.log("Let's Go");

let list = {
  schools: [],
};

const allButtons = document.querySelectorAll(".addToSchoolListBtn");

allButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const schoolId = e.id;
    list.schools.push(schoolId);
  });
});

const submit = document.querySelector("#submit");

submit.addEventListener("click", async (e) => {
  let res = await fetch("/school/list", {
    method: "POST",
    body: JSON.stringify(list),
    headers: {
      "Content-Type": "application/json",
    },
  });
});
let response = await res.json();
if (response) {
  list = {
    schools: [],
  };
  window.location = '/school/list'
}
