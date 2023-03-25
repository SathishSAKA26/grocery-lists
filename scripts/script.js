"use strict";

// Select Elements
const alertEl = document.querySelector(".alert");
const form = document.querySelector(".grocery-from");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editID = "";

// event listeners
// submit from
form.addEventListener("submit", addItem);

// clear items
clearBtn.addEventListener("click", clearItems);
// load items
window.addEventListener("DOMContentLoaded", setupItems);

// Functions
function addItem(e) {
  e.preventDefault();
  // console.log(grocery.value);
  const value = grocery.value;

  const id = new Date().getTime().toString();
  // console.log(id);
  if (value && !editFlag) {
    createListItem(id, value);
    // add display alert
    displayAlert("item added to the list 🤗", "success");
    // show container
    container.classList.add("show-container");
    // add to local storage
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
  } else if (value && editFlag) {
    // update edit value
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    // edit localStorage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("please enter value 🤔", "danger");
  }
}

// display alert
function displayAlert(text, action) {
  alertEl.textContent = text;
  alertEl.classList.add(`alert-${action}`);

  // remove alert
  setTimeout(function () {
    alertEl.textContent = "";
    alertEl.classList.remove(`alert-${action}`);
  }, 2000);
}

// delete function
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item is a remove 🤪", "danger");
  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
}
// edit function
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "edit";
}
// set back to default
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}
// clear item
function clearItems() {
  const items = document.querySelectorAll(".item");

  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
}

// local storage
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  // console.log(grocery);
  let items = getLocalStorage();

  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
  // console.log(items);
}
// remove local storage item
function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}
// edit local storage
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// local storage function
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
// setup item
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

function createListItem(id, value) {
  const element = document.createElement("article");
  // add class
  element.classList.add("item");
  // add id
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = ` <p class="title">${value}</p>
  <div class="button-container">
    <button type="button" class="edit-btn">
      <i class="fa-solid fa-pen-nib"></i>
    </button>
    <button type="button" class="delete-btn">
      <i class="fa-solid fa-trash"></i>
    </button>
  </div>`;

  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);
  // add append child
  list.appendChild(element);
}
