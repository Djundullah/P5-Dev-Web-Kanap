import { getProducts } from "./script";

// constante qui va récuperer l'adresse affichée
const location = window.location;
console.log("location", location);
// constante qui va afficher une nouvelle URL "copiée"
const url = new URL(location);
console.log("url", url);
// constante qui va afficher l'id du produit
const id = url.searchParams.get("id");
console.log("id", id);

let itemImage = document.getElementsByClassName("item__img")[0];
// obligation de mettre le 0 pour pouvoir accéder aux données de la class
console.log("itemImage", itemImage);

let price = document.getElementById("price");
console.log("price", price);

let title = document.getElementById("title");
console.log("name", title);

let description = document.getElementById("description");

let colors = document.getElementById("colors");

async function getProductsById() {
  // on cherche dans les données le produit avec le bon id
  fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    // si on récupére des données
    .then((data) => {
      // création de la balise img dans le DOM
      let image = document.createElement("img");
      // attribution du src et du alt à l'image
      image.alt = data.altTxt;
      image.src = data.imageUrl;
      // création de l'enfant dans la div
      itemImage.appendChild(image);

      // on peut afficher le prix avec innerHTML ou aussi innerText
      price.innerText = data.price;

      // on peut afficher le nom du produit avec innerHTML
      title.innerHTML = data.name;

      // on affiche la description avec innerHTML
      description.innerHTML = data.description;

      // pour chaque couleur dans la data
      let i = 0;
      for (i = 0; i < data.colors.length; i++) {
        // pour chaque element i on crée option dans le DOM
        colors.innerHTML += `<option value="${data.colors[i]}">${data.colors[i]}</option>`;
      }
    });
}

// la fonction qui va récuperer la valeur dans l'input quantity
function getValueOfQuantity() {
  // l'id quantity dans le DOM (l'input)
  let quantity = document.getElementById("quantity");

  // la regex
  const quantityNb = /^[0-9]$|^[1-9][0-9]$|^(100)$/;

  // condition, si la valeur est vide ou que la quantité est plus petite que zéro, on stop la fonction
  if (quantity.value.trim() == "" || quantityNb.test(quantity.value) <= 0) {
    return;

    // sinon on récupère la valeur
  } else if (quantityNb.test(quantity.value) >= 0) {
    // on va chercher les valeurs affichées dans l'input graca à 'input'
    quantity.addEventListener("input", getValueOfQuantity, false);
  }
  // return quantity;

  console.log("valueQuantity", quantity.value);
}
// La fonction qui va récuperer la valeur dans le select
async function getValueOfColor() {
  let color = document.getElementById("colors");
  // on cherche dans les données le produit avec le bon id
  fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    // si on récupére des données
    .then(
      (data) => {
        color.addEventListener("click", getValueOfColor, false);

        let dataColors = data.colors;

        let isOk = true;

        let i = 0;
        for (i = 0; i < data.colors.length; i++) {
          if (dataColors[i] !== color.value) isOk = false;
          else if (dataColors[i] === color.value) isOk = true;
          console.log("isOk", isOk);
          console.log("Colors", color.value);
          // console.log("getValueOfColor", color.value);
          // on va récuperer les valeurs à chaque changements d'évenement avec le "change"

          if (isOk == true) {
            console.log("TRUE");
            color.addEventListener("click", getValueOfColor, false);
          }
        }
        console.log("getValueOfColor", color.value);

        // return getValueOfColor();
      }
      //  else
      //     // on va récuperer les valeurs à chaque changements d'évenement avec le "change"
      //     color.addEventListener("change", getValueOfColor, false);
      // // return color;
      // console.log("getValueOfColor", data.colors);
      // console.log("getValueOfColor", color.value);
    );
}

function addPanier() {
  const btnAddToCart = document.getElementById("addToCart");

  btnAddToCart.addEventListener("click", getValueOfQuantity, getValueOfColor());
}

function init() {
  getValueOfQuantity();
  getProductsById();
  getValueOfColor();
  addPanier();
}

init();
