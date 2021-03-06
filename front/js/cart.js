//Fonction qui sauvegarde les éléments du panier
function savePanier(panier) {
  localStorage.setItem("panier", JSON.stringify(panier));
}

//Fonction qui récupère les éléments du panier
function getPanier() {
  let panier = localStorage.getItem("panier");
  if (panier == null) {
    return [];
  } else {
    return JSON.parse(localStorage.getItem("panier"));
  }
}

//Fonction qui retire des éléments du panier ; produit = array
function removeFromPanier(produit) {
  let panier = getPanier();
  let foundProduit = panier.find((p) => p.id == produit.id && p.couleur == produit.couleur);
  panier = panier.filter((p) => p != foundProduit);
  savePanier(panier);
}

//Fonction qui modifie des quantités du panier ; produit = array
function changeQuantity(produit, quantity) {
  let panier = getPanier();
  let foundProduit = panier.find((p) => p.id == produit.id && p.couleur == produit.couleur);
  if (foundProduit != undefined) {
    foundProduit.quantity = quantity;
    if (foundProduit.quantity <= 0) {
      removeFromPanier(foundProduit);
    } else {
      savePanier(panier);
    }
  }
}

//Fonction qui récupère les quantité d'éléments du panier
function getNumberProduit() {
  let panier = getPanier();
  let number = 0;
  for (let produit of panier) {
    number += parseInt(produit.quantity, 10);
  }
  return number;
}

//Fonction qui calcule le prix total du panier
function getPrice() {
  let panier = getPanier();
  let input = document.querySelectorAll("input");
  let prixTarget = document.querySelectorAll("article p:nth-child(3)");
  let total = 0;

  for (let i = 0; i < panier.length; i++) {
    let quantiteTarget = input[i];
    total += quantiteTarget.value * parseInt(prixTarget[i].textContent);
  }
  return total;
}

//Fonction qui récupère la valeur de l'input modifié et appelle la fonction qui modifie la quantité du panier
function updateValue(e) {
  let target = e.target;
  let valeur = target.value;
  let article = target.closest("article");
  let articleId = article.dataset.id;
  let articleColor = article.dataset.color;
  let panierUpdate = { id: articleId, couleur: articleColor, quantity: valeur };
  changeQuantity(panierUpdate, valeur);
  document.getElementById("totalQuantity").innerHTML = getNumberProduit();
  document.getElementById("totalPrice").innerHTML = getPrice();
}

//Fonction qui récupère la valeur de l'input modifié et appelle la fonction qui modifie la quantité du panier
function supprProduit(elt) {
  let target = elt.target;
  let article = target.closest("article");
  let articleId = article.dataset.id;
  let articleColor = article.dataset.color;
  let panierSuppr = { id: articleId, couleur: articleColor };
  removeFromPanier(panierSuppr);
  article.remove();
  document.getElementById("totalQuantity").innerHTML = getNumberProduit();
  document.getElementById("totalPrice").innerHTML = getPrice();
}

fetch("http://localhost:3000/api/products")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {
    for (let j in value) {
      let panier = getPanier();
      for (let i in panier) {
        let idDuPanier = panier[i].id;
        let CouleurDuPanier = panier[i].couleur;
        let QuantiteDuPanier = panier[i].quantity;

        if (value[j]._id == idDuPanier) {
          let lienImage = value[j].imageUrl;
          let nom = value[j].name;
          let prix = value[j].price;

          document.getElementById("cart__items").innerHTML +=
            '<article class="cart__item" data-id="' +
            idDuPanier +
            '" data-color="' +
            CouleurDuPanier +
            '"' +
            ">" +
            '<div class="cart__item__img"' +
            ">" +
            '<img src="' +
            lienImage +
            '" alt="Photographie ' +
            "d" +
            "'" +
            'un canapé">' +
            "</div>" +
            '<div class="cart__item__content"' +
            ">" +
            '<div class="cart__item__content__description"' +
            ">" +
            "<h2>" +
            nom +
            "</h2>" +
            "<p>" +
            CouleurDuPanier +
            "</p>" +
            "<p>" +
            prix +
            "€</p>" +
            "</div>" +
            '<div class="cart__item__content__settings">' +
            ' <div class="cart__item__content__settings__quantity">' +
            "<p>Qté : </p>" +
            '<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="' +
            QuantiteDuPanier +
            '">' +
            "</div>" +
            '<div class="cart__item__content__settings__delete">' +
            '<p class="deleteItem">Supprimer</p>' +
            "</div>" +
            "</div>" +
            "</div>" +
            "</article>";
        }
      }
    }
  })
  .then(function () {
    document.getElementById("totalQuantity").innerHTML = getNumberProduit();
    document.getElementById("totalPrice").innerHTML = getPrice();
  })
  .then(function () {
    let x = document.querySelectorAll("article");
    x.forEach((x) => x.addEventListener("change", updateValue));
    let y = document.querySelectorAll(".deleteItem");
    y.forEach((y) => y.addEventListener("click", supprProduit));
  })
  .then(function () {
    document.getElementById("order").addEventListener("click", creationTableau);
    document.getElementById("order").addEventListener("click", send);
  });

// fin de la partie Panier
//Début de la partie Formulaire

let coordonnees = document.querySelectorAll("input");
coordonnees.forEach((x) => x.addEventListener("change", validation));

// Fonction qui récupère les données des champs du formulaire et les compare au RegEx
function validation(champ) {
  let target = champ.target;
  let valeur = target.value;
  let titreChamp = target.id;
  let messageErreur = target.nextElementSibling;
  const masques = {
    firstName: /^[a-zA-Z](['a-z\s.-]|(\s|-)[A-Z]|){1,30}$/g,
    lastName: /^[a-zA-Z](['a-z\s.-]|\s[A-Z]){1,30}$/g,
    address: /^\d{1,3}[a-zA-Z\s]/,
    city: /^[a-zA-Z\s]{2,30}$/,
    email: /.@.{2,}\.[a-zA-Z]{2,}/,
  };
  const erreur = {
    firstName: "Veuillez saisir un champ correct (sans numéro)",
    lastName: "Veuillez saisir un champ correct (sans numéro)",
    address: "Veuillez saisir un champ correct (commençant par un chiffre)",
    city: "Veuillez saisir un champ correct (sans numéro)",
    email: "Veuillez saisir un champ correct (contenant un @)",
  };
  for (let i in masques) {
    if (i == titreChamp) {
      if (valeur.match(masques[i]) != null) {
        messageErreur.innerHTML = "";
      } else {
        valeur = "";
        messageErreur.innerHTML = erreur[i];
      }
    }
  }
}

// Fonction qui crée l'objet contact
function creationContact() {
  let firstNameValue = document.getElementById("firstName").value;
  let lastNameValue = document.getElementById("lastName").value;
  let addressValue = document.getElementById("address").value;
  let cityValue = document.getElementById("city").value;
  let emailValue = document.getElementById("email").value;

  const contact = {
    firstName: firstNameValue,
    lastName: lastNameValue,
    address: addressValue,
    city: cityValue,
    email: emailValue,
  };
  return contact;
}

//Fonction qui récupère les produits à commander et les met dans un tableau
function creationTableau() {
  let article = document.querySelectorAll("article");
  let produits = [];
  for (let i = 0; i < article.length; i++) {
    produits.push(article[i].dataset.id);
  }
  return produits;
}

function send(e) {
  e.preventDefault();
  let contact = creationContact();
  let products = creationTableau();
  let order = { contact, products };

  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  })
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (res) {
      let orderId = res.orderId;
      let str = "/confirmation.html";
      let url = str + "?id=" + orderId;
      window.location.href = url;
      return orderId;
    });
}
