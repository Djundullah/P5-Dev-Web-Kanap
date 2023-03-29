var panier = JSON.parse(localStorage.getItem("panier"));
const cartItems = document.getElementById("cart__items");
var articles = [];
var sumPrices = 0;
const quantityNb = /^[1-9]$|^[1-9][0-9]$|^100$/;

function displayCart() {
  if (panier) {
    panier.forEach(async (article) => {
      await fetch(`http://localhost:3000/api/products/${article.id}`)
        .then((reponse) => reponse.json())
        .then((data) => {
          if (!articles.includes(data)) {
            articles.push(data);
          }
          let tagArticle = document.createElement("article");
          tagArticle.className = "cart__item";
          tagArticle.setAttribute("data-id", article.id);
          tagArticle.setAttribute("data-color", article.color);

          // image
          let cart_item_img = document.createElement("div");
          cart_item_img.className = "cart__item__img";

          let img = document.createElement("img");
          img.src = data.imageUrl;
          img.alt = data.altTxt;

          cart_item_img.appendChild(img);

          // content
          let content = document.createElement("div");
          content.className = "cart__item__content";

          // content description
          let contentDescription = document.createElement("div");
          contentDescription.className = "cart__item__content__description";
          let name = document.createElement("h2");
          name.textContent = data.name;
          let color = document.createElement("p");
          color.textContent = article.color;
          let price = document.createElement("p");
          price.textContent = data.price;

          contentDescription.appendChild(name);
          contentDescription.appendChild(color);
          contentDescription.appendChild(price);

          // settings quantity
          let contentSettings = document.createElement("div");
          contentSettings.className = "cart__item__content__settings";

          let settingsQuantity = document.createElement("div");
          settingsQuantity.className =
            "cart__item__content__settings__quantity";
          let qte = document.createElement("p");
          qte.textContent = "Qte : ";
          let input = document.createElement("input");
          input.type = "number";
          input.className = "itemQuantity";
          input.name = "itemQuantity";
          input.min = "1";
          input.max = "100";
          input.value = article.quantite;
          input.addEventListener("change", () => {
            UpdatePanier(input);
          });

          settingsQuantity.appendChild(qte);
          settingsQuantity.appendChild(input);

          //settings delete
          let settingsDelete = document.createElement("div");
          settingsDelete.className = "cart__item__content__settings__delete";
          let supprimer = document.createElement("p");
          supprimer.className = "deleteItem";
          supprimer.textContent = "Supprimer";
          supprimer.addEventListener("click", () => {
            DeleteArticle(supprimer);
          });

          settingsDelete.appendChild(supprimer);

          contentSettings.appendChild(settingsQuantity);
          contentSettings.appendChild(settingsDelete);

          content.appendChild(contentDescription);
          content.appendChild(contentSettings);

          tagArticle.appendChild(cart_item_img);
          tagArticle.appendChild(content);

          cartItems.appendChild(tagArticle);
        })
        .then(() => {
          SetTotalPrice();
        });
    });
  }
}

function CalculTotalPrice() {
  sumPrices = 0;

  panier.forEach((article) => {
    let art = articles.find((a) => {
      return a._id == article.id;
    });
    if (art) {
      sumPrices =
        parseInt(sumPrices) + parseInt(article.quantite) * parseInt(art.price);
    }
  });
}

function SetTotalPrice() {
  CalculTotalPrice();
  //total price
  let total = document.getElementById("totalQuantity");
  total.textContent = panier.length.toString();

  let totalPrice = document.getElementById("totalPrice");
  totalPrice.textContent = sumPrices.toString();
}

function UpdatePanier(htmlElement) {
  if (quantityNb.test(htmlElement.value)) {
    //recuperer l'element html
    var tagArticle = htmlElement.closest(".cart__item");

    //mettre a jour le bon element du panier
    let articleIndex = panier.findIndex((localStorageArticle) => {
      if (
        localStorageArticle.id == tagArticle.getAttribute("data-id") &&
        localStorageArticle.color == tagArticle.getAttribute("data-color")
      ) {
        return localStorageArticle;
      }
    });

    if (articleIndex != -1) {
      // mettre a jour l'article avec la nouvelle quantite
      panier[articleIndex].quantite = htmlElement.value;

      // mettre a jour le localStorage
      localStorage.setItem("panier", JSON.stringify(panier));

      SetTotalPrice();
    }
  } else {
    alert("Veuillez selectionner une quantite entre 1-100 et une couleur SVP");
  }
}

function DeleteArticle(htmlElement) {
  var tagArticle = htmlElement.closest(".cart__item");

  let newPanier = panier.filter(
    (article) =>
      article.id != tagArticle.getAttribute("data-id") ||
      article.color != tagArticle.getAttribute("data-color")
  );

  //   logique et/ou
  // true ou true = true
  //     true ou false = true
  //     false ou true = true
  //     false ou false = false

  //     true et true = true
  //     true et false = false
  //     false et true = false
  //     false et false = false

  // mise a jour du panier dans le local storage
  localStorage.setItem("panier", JSON.stringify(newPanier));

  panier = JSON.parse(localStorage.getItem("panier"));

  // retirer l'element de la page
  tagArticle.remove();

  SetTotalPrice();
}

function init() {
  displayCart();
}

init();
