const promise0 = axios.get(
  "https://api.nytimes.com/svc/books/v3/lists/current/hardcover-graphic-books.json?api-key=ICC9xiMKjph9039DEICZ2cOcrnZyJeay"
);

const promise1 = axios.get(
  "https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=ICC9xiMKjph9039DEICZ2cOcrnZyJeay"
);

const promise2 = axios.get(
  "https://api.nytimes.com/svc/books/v3/lists/current/hardcover-nonfiction.json?api-key=ICC9xiMKjph9039DEICZ2cOcrnZyJeay"
);
console.log(promise2);

// BELOW CODE USES SHUFFLE FROM STACK OVERFLOW AT https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

let books;
let htmlToUpdate = "";
let htmlGridToUpdate = "";
let imgsToUpdate = "";

const updateHtml = () => {
  htmlGridToUpdate = "";
  htmlToUpdate = "";
  imgsToUpdate = "";
  for (const book of books) {
    // test output
    // console.log(book);
    // let foxNewsBook = false;
    // if (book.author.includes("Carlson")) {
    //   foxNewsBook = true;
    // }
    const descArr = book.description.split(" ");
    let shortDesc = descArr.slice(0, 6).join(" ");

    let favorited = false;
    if (
      localStorage.getItem("favoritedBooks") &&
      localStorage.getItem("favoritedBooks").includes(book.primary_isbn13)
    ) {
      favorited = true;
    }

    let card = `<div class="card mb-3">
        <div class="row g-0">
          <div class="col-md-4" id="colBookImage">
          <a href="${book.buy_links[2].url}">
            <img
              src="${book.book_image}"
              class="img-fluid rounded-start"
              alt="Book Cover"
            />
            </a>
          </div>
          <div class="col-md-8">
            <div class="card-body">
            <div>
            <img src="images/favBkMark.png" alt="bookmark" id="bookmark" title="favorite book" 
            class="${
              favorited ? "favorited" : ""
            }" onclick="favoriteClicked(event, '${book.primary_isbn13}')"/>
            </div>
            <div>
            <img src="images/audioPhs.png" alt="headphones" id="startOrStopImg" title="selected playlist" 
            onclick="audioClicked()"
            />
            </div>
            <a href="${book.buy_links[2].url}">
              <h2 class="card-title">${book.title}</h2>  
              </a>           
              <h3 class="card-author">by ${book.author}</h3>
              <p class="card-text" id="colDescription">
                ${shortDesc}...
              </p>
            </div>
          </div>
          </div>
        </div>`;

    // if (!foxNewsBook) {
    htmlToUpdate += card;

    let grid = `<div class="col-md-3 col-sm-6 gridItem">
        <a href="${book.buy_links[2].url}" class="book-image-link">
            <img
              src="${book.book_image}"
              class="img-fluid book-image"
              alt="Book Cover"
            />
         </a>
        <div class="bookDetails">
        <a href="${book.buy_links[2].url}">
            <p class="bookDescription" id="colDescription">
            ${shortDesc}...
            </p>
            <h2 class="bookTitle">${book.title}</h2>
        </a>
        <h3 class="bookAuthor">by ${book.author}</h3>
        </div>
    </div>`;

    htmlGridToUpdate += grid;

    imgsToUpdate += `<img
        src="${book.book_image}"
        alt="Book Cover: ${book.title}"
        style="margin-right: 3.5px"
    />`;
    // }
  }

  // console.timeEnd("html");

  document.getElementById("myAPIContent").innerHTML = htmlToUpdate;
  document.getElementById("bestNonfictionSellersTitleBarImgs").innerHTML =
    imgsToUpdate;
};

const favoriteClicked = (event, isbn) => {
  //CODE BELOW I WROTE AND ABANDONED NOT REALIZING IT WORKED
  // if (!window.localStorage.favoriteFavorites) {
  //   window.localStorage.favoriteFavorites = "";
  // }
  // let favoritedFavorites = window.localStorage.favoriteFavorites.split(",");
  // if (favoritedFavorites.includes(isbn)) {
  //   alert("Off Bookmark List!");
  //   favoritedFavorites = favoritedFavorites.filter(
  //     (isbnFromArray) => isbnFromArray !== isbn
  //   );
  // } else {
  //   favoritedFavorites.push(isbn);
  //   alert("Bookmarked!");
  // }
  // window.localStorage.favoriteFavorites = favoritedFavorites.join(",");

  // console.log(isbn);
  let favoritedBooksString = localStorage.getItem("favoritedBooks");
  if (!favoritedBooksString) {
    favoritedBooksString = "";
  }
  let favoritedBooksArr = favoritedBooksString.split(",");
  if (favoritedBooksArr.includes(isbn)) {
    // console.log("String from storage", favoritedBooksString);
    // console.log("Arr from storage", favoritedBooksArr);
    const updatedBooksArr = favoritedBooksArr.filter(
      (isbnFromArray) => isbnFromArray !== isbn
    );
    // console.log("Updated Books Array", updatedBooksArr);
    const updatedBooksString = updatedBooksArr.join(",");
    // console.log("Update Books String", updatedBooksString);
    localStorage.setItem("favoritedBooks", updatedBooksString);
    alert("Removed From Favorites");
  } else {
    alert("Favorited!");
    favoritedBooksArr.push(isbn);
    const updatedBooksString = favoritedBooksArr.join(",");
    localStorage.setItem("favoritedBooks", updatedBooksString);
  }

  updateHtml();
};

(async () => {
  // console.time("api call");
  const [response0, response1, response2] = await Promise.all([
    promise0,
    promise1,
    promise2,
  ]);
  // console.timeEnd("api call");

  books = shuffle([
    ...response0.data.results.books,
    ...response1.data.results.books,
    ...response2.data.results.books,
  ]).filter((book) => {
    return !(
      book.publisher.toLowerCase().includes("fox news") ||
      book.publisher.toLowerCase().includes("post hill press") ||
      book.publisher.toLowerCase().includes("defiance press") ||
      book.publisher.toLowerCase().includes("kindle direct") ||
      book.publisher.toLowerCase().includes("regnery") ||
      book.publisher.toLowerCase().includes("liberty hill") ||
      book.publisher.toLowerCase().includes("salem books") ||
      book.publisher.toLowerCase().includes("henry holt") ||
      book.publisher.toLowerCase().includes("republic book") ||
      book.publisher.toLowerCase().includes("center street") ||
      book.publisher.toLowerCase().includes("hoover institution") ||
      book.publisher.toLowerCase().includes("princeton university") ||
      book.publisher.toLowerCase().includes("broadside books") ||
      book.publisher.toLowerCase().includes("all seasons press") ||
      book.publisher.toLowerCase().includes("threshold editions") ||
      book.description.toLowerCase().includes("republican senator") ||
      book.description.toLowerCase().includes("radical left") ||
      book.description.toLowerCase().includes("conservative author") ||
      book.description.toLowerCase().includes("right-wing") ||
      book.description.toLowerCase().includes("republican representative") ||
      book.description.toLowerCase().includes("republican leader") ||
      book.description.toLowerCase().includes("traditionalist") ||
      book.author.toLowerCase().includes("donald trump") ||
      book.author.toLowerCase().includes("mike pence") ||
      book.author.toLowerCase().includes("rush limbaugh") ||
      book.author.toLowerCase().includes("ted cruz") ||
      book.author.toLowerCase().includes("dan crenshaw") ||
      book.author.toLowerCase().includes("josh hawley") ||
      book.author.toLowerCase().includes("kevin mccarthy") ||
      book.author.toLowerCase().includes("tom cotton") ||
      book.author.toLowerCase().includes("mark meadows") ||
      book.author.toLowerCase().includes("peter navarro") ||
      book.author.toLowerCase().includes("jared kushner") ||
      book.author.toLowerCase().includes("newt gingrich") ||
      book.author.toLowerCase().includes("tucker carlson") ||
      book.author.toLowerCase().includes("kyrsten sinema") ||
      book.author.toLowerCase().includes("joseph manchin") ||
      book.author.toLowerCase().includes("joe manchin") ||
      book.author.toLowerCase().includes("clarence thomas") ||
      book.author.toLowerCase().includes("brett kavanaugh") ||
      book.author.toLowerCase().includes("chris christie") ||
      book.author.toLowerCase().includes("kellyanne conway") ||
      book.author.toLowerCase().includes("sean hannity") ||
      book.author.toLowerCase().includes("maria bartiromo") ||
      book.author.toLowerCase().includes("hershel walker") ||
      book.author.toLowerCase().includes("lindsey graham") ||
      book.author.toLowerCase().includes("tim scott")
    );

    // if (book.description.toLowerCase().includes("fox news")) {
    //   return false;
    // } else {
    //   return true;
    // }
  });
  // console.time("html");

  updateHtml();
})();

//CODE BELOW TO TOGGLE LIST & GRID VIEW
function viewToggleChanged(event) {
  document.getElementById("myAPIContent").innerHTML = event.target.checked
    ? htmlGridToUpdate
    : htmlToUpdate;
}

//CODE BELOW TO START & STOP PLAYLIST ONCLICK OF HEADPHONES IMAGE
const audioClicked = () => {
  var audio = document.getElementById("audio");
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
};

//AUDIO & SOUND EFFECT IN SELECTED PLAYLIST COURTESY YOUTUBE AUDIO LIBRARY
//AS COMPILED INTO ONE PLAYLIST (IN ALPHA ORDER - I THINK) BY LA'TONIA MERTICA
// Best Horizon, Gone by The Westerlies
//Book The Rental Wit It by RAGE
//Can't Stand Decimals by Alge
//Chimez by Dan Henig
//Cover by Patrick Patrikios
//Disk Drive Insert and Spinning (sound effect - added as transition signal between songs)
//Into It by Kwon
//Lemme See About It by Max McFerren
//Mitigated Suffering by Alge
//Scrapbook by Silent Partner\
//She No Dull Beat by Nana Kwabena
//Stranger In The Way by RAGE
//Timpani Beat by Nana Kwabena
//Wok Hard by Mike Relm
//BackStory: Songs and sound effect curated by keywords relevant to my journey in code/web dev to fulfill the duties and experience the benefits of being a full stack JS developer
