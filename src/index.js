const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyCollection = document.querySelector("#toy-collection")
const formEl = document.querySelector(".add-toy-form")
let addToy = false
const state = {
  toys: [],
  selectedToy: null
}

// YOUR CODE HERE
addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
  } else {
    toyForm.style.display = 'none'
  }
})


// OR HERE!
//Add a single Toy
const addAToy = (toy) => {
  const toyDiv = document.createElement('div')
  toyDiv.className = "card"
  toyDiv.innerHTML =
  `
  <h2>${toy.name}</h2>
  <img src=${toy.image} class="toy-avatar" />
  <p>${toy.likes} Likes </p>
  <button data-id= ${toy.id} class="like-btn">Like <3</button>
  `
  toyCollection.appendChild(toyDiv)
}
// Add multiple toys
const addToys = () => {
  toyCollection.innerHTML = ""
  state.toys.forEach(toy => addAToy(toy))
}

// toy form
toyForm.addEventListener('submit', (event) =>{
  event.preventDefault()
  const toyName = formEl.name.value
  const image = formEl.image.value
  createToy(toyName, image)
  .then(resp => state.toys.push(resp))
  .then(addToys)
  formEl.reset()
})
// like event listener
const addLikeEventListener = () => {
  document.addEventListener('click', event => {
    if (event.target.className === "like-btn"){
    const id = parseInt(event.target.dataset.id)
    const foundToy = state.toys.find(toy => toy.id === id)
    state.selectedToy = foundToy
    state.selectedToy.likes++
    likeToy(state.selectedToy)
    .then(addToys)

    }
  })
}
//server stuff
//get
const getToys = () => {
  return fetch('http://localhost:3000/toys')
    .then(resp => resp.json())
}

//create
const createToy = (name, image) => {
  return fetch(`http://localhost:3000/toys/`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({name: name, image: image, likes: 0})
   }).then(resp => resp.json())
}

// like
const likeToy = (toy) => {
  return fetch(`http://localhost:3000/toys/${toy.id}`, {
     method: 'PATCH',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({likes: toy.likes})
   }).then(resp => resp.json())
}
//initialize
const initialize = () => {
  getToys()
  .then(toys => {
    state.toys = toys
    addToys()
  })
  addLikeEventListener()
}
initialize ()
