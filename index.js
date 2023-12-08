import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

import {getFirestore, getDocs, doc,collection, setDoc, deleteDoc,} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

import {getAds, searchInAds} from "./src/config/config.js";
const firebaseConfig = {
  apiKey: "AIzaSyBm9msXFDnZvAJe_Vw1l2xxDkX-9L4OQUI",
  authDomain: "my-olx-bad77.firebaseapp.com",
  projectId: "my-olx-bad77",
  storageBucket: "my-olx-bad77.appspot.com",
  messagingSenderId: "666503542444",
  appId: "1:666503542444:web:7a0b056b6a69a722f39109"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// const sellItems = document.getElementById('sell')
// sellItems?.addEventListener('click' , (event) =>{
//   event.preventDefault()
  
// })
 

const signUpform = document.querySelector("#form");
signUpform?.addEventListener('submit', async (e) => {
  e.preventDefault()
  console.log(e)
  const firstname = e.target[0].value
  const lastname = e.target[1].value
  const email = e.target[2].value
  const password = e.target[3].value

  try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // await addDoc(collection(db, "users"), {
      //     fullname,
      //     email
      // })
      console.log('userCredential --', userCredential)
      await setDoc(doc(db, "users", userCredential.user.uid), {
          firstname,
          lastname,
          email
      });
      window.location.href = './signin.html'

  } catch (e) {
      alert(e.message)
  }
})

const loginForm = document.querySelector("#form");
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault()
  console.log(e)
  const email = e.target[0].value
  const password = e.target[1].value

  
  try {
    const response = await signInWithEmailAndPassword(auth, email, password)
    window.location.href = './index.html'
    
  } catch (e) {
    
  }
})



const logout = document.querySelector("#logout-btn");

logout?.addEventListener('click' , ()=>{
    signOut(auth).then(() => {
        alert("Logout Successfully")
        window.location = './signin.html'
      }).catch((error) => {
        console.log(error);
      });
})

onAuthStateChanged(auth, (user) => {
  if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log('user is logged in')
      console.log(user)
      
      const loginDiv = document.getElementById('login-div')
      const userLogin = document.getElementById('signIn-link')
      userLogin.style.display = 'none'

      const imgDiv = document.createElement('div')
      imgDiv.style.display = 'flex'
      imgDiv.style.alignItems = 'center'
      const userImg = document.createElement('img')
      userImg.src = './src/images/userprofile.png'
      userImg.style.width = '40px'
      const dropArrow = document.createElement('img')
      dropArrow.src = './src/images/down-arrow.png'
      dropArrow.style.width = '20px'

      imgDiv.appendChild(userImg)
      imgDiv.appendChild(dropArrow)
      imgDiv.className = 'profile-dropDown'
      userImg.onclick = toggleMenu

      loginDiv.appendChild(imgDiv)

      getUser(uid)
      // ...
    } else {
      // User is signed out
      // loader.style.display = 'none'
      // auhDiv.style.display = 'block'
      // userDiv.style.display = 'none'
      
      // ...
    }
});

let subMenu = document.getElementById('subMenu')
async function toggleMenu() {
  subMenu.classList.toggle('open-menu');
}

async function getUser(uid) {
  console.log('uid', uid)
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
  if (doc.id === uid) {
      const firstName = doc.data().firstname
      const lastName = doc.data().lastname
      const fullname = `${firstName} ${lastName}`
      console.log(fullname);
      const username = document.getElementById('username-info')
      username.innerHTML = fullname
  }
  });
}



// Index.html ki js ka kaam hai 
onAuthStateChanged(auth, (user) => {
  if (user) {
      renderAds()
  } else {
      // location.href = './signin.html'
  }
})

window.search = async function () {
  const inputValue = document.getElementById('search').value
  if (!inputValue) {
      renderAds()
  } else {
      const ads = await searchInAds(inputValue)
      renderAdItems(ads)
  }
}

async function renderAds() {
  const ads = await getAds()

  renderAdItems(ads)
}

function renderAdItems(ads) {
  const container = document.getElementById('mobile-tags')
  container.innerHTML = ''

  for (var i = 0; i < ads.length; i++) {
      const ad = ads[i]

      const card = document.createElement('div')
      card.className = 'card'
      card.onclick = function () {
          location.href = './src/detail/detail.html?adId=' + ad.id
      }

      const img = document.createElement('img')
      img.src = ad.image
      img.className = 'mobile-installment-img'

      const cardInnerDiv = document.createElement('div')
      cardInnerDiv.style.display = 'flex'
      const cardPartitionFirstDiv = document.createElement('div')
      cardPartitionFirstDiv.style.width = "90%"
      const amount = document.createElement('h4')
      amount.innerHTML = `Rs. ${ad.amount}`
      const title = document.createElement('p')
      title.innerHTML = ad.title

      cardPartitionFirstDiv.append(amount)
      cardPartitionFirstDiv.append(title)

      const cardPartitionSecondDiv = document.createElement('div')
      const favouriteImg = document.createElement('img')
      favouriteImg.src = './src/images/heart.png'

      cardPartitionSecondDiv.append(favouriteImg)

      cardInnerDiv.appendChild(cardPartitionFirstDiv)
      cardInnerDiv.appendChild(cardPartitionSecondDiv)

      


      card.append(img)
      card.append(cardInnerDiv)

      container.append(card)
  }
}

// window.sort = async function (event) {
//   const sortBy = event.target.value

//   if (!sortBy) {
//       renderAds()
//   } else {
//       const ads = await sortAds(sortBy)
//       renderAdItems(ads)
//   }
// }

window.myAds = function () {
  location.href = './src/myAds/myAds.html'
}


export {
  auth,
  onAuthStateChanged,
  getUser,
  getDocs,
  doc,
  collection
}