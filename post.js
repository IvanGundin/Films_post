const myButton = document.getElementById("getData");
const films = document.getElementById("films");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const pagination = document.querySelector(".pagination");
const ul = document.querySelector(".ul");

let current_page = 1;
let total_page = 3;
let active_page = "";

function create_pages(current_page) {
        ul.innerHTML = "";
        let before_page = current_page - 2;
        let after_page = current_page + 2;
        if (current_page == 2) before_page = current_page - 1;
        if (current_page == 1) before_page = current_page;
        if (current_page == total_page - 1) after_page = current_page + 1;
        if (current_page == total_page) after_page = current_page;

        for (let i = before_page; i <= after_page; i++) {
                if (current_page == i) {
                        active_page = "active_page";
                } else {
                        active_page = "";
                }
                ul.innerHTML += `<li onclick="create_pages(${i}); getPosts(${i})"><a href="#" class="page_number ${active_page}">${i}</a></li>`;
        };
};

prev.onclick = function () {
        current_page--;
        create_pages(current_page);
        getPosts(current_page);
}
if (current_page <= 1) {
        prev.style.display = "none";
} else {
        prev.style.display = "block";
};

next.onclick = function () {
        current_page++;
        create_pages(current_page);
        getPosts(current_page);
}
if (current_page >= total_page) {
        next.style.display = "none";
} else {
        next.style.display = "block";
};

create_pages(current_page);

async function getPosts(current_page) {
        const title = document.getElementById('title').value;
        const type = document.getElementById('type').value;
        const response = await fetch(`https://www.omdbapi.com/?apikey=2fe8aa7d&plot=full&page=${current_page}&s=${title}&type=${type}`);
        const data = await response.json();
        try {
                total_page = data.totalResults;
                films.innerHTML = "";
                data.Search.some(function (film, i) {
                        films.innerHTML += `
                                <div class="cards">
                                   <div class="cards-img">
                                      <img src=${film?.Poster} alt='img_alt'></img>
                                   </div>
                                   <div class="cards-content">
                                        <p class="cards-type">${film?.Type}</p>
                                        <p class="cards-title">${film?.Title}</p>
                                        <p class="cards-year">${film?.Year}</p>
                                        <button type='button' onclick='getCard("${film.imdbID}")' id="getCard">Details</button>
                                   </div>
                                </div>`;
                        pagination.setAttribute('style', 'display:flex; justify-content: center;');
                        return i === 2;
                });
        }
        catch (err) {
                alert("Movie not found!");
                location.reload();
        }
};

myButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (current_page < total_page) {
                getPosts(current_page);
                current_page++;
        }
});

async function getCard(imdbID) {
        const response = await fetch(`https://www.omdbapi.com/?apikey=2fe8aa7d&plot=full&i=${imdbID}`);
        const data = await response.json();
        try {
                films.innerHTML = "";
                films.innerHTML += `
                <div class="details">
                    <div class="name-details">Film info:</div>
                        <div class="card-content-details">
                           <div class="card-img">
                              <img src=${data?.Poster} alt='img_alt'></img>
                           </div>
                           <div class="card-details">
                             <div class="text-details">
                                <p class="card-title">Title:</p>
                                <p class="card-released">Released:</p>
                                <p class="card-genre">Genre:</p>
                                <p class="card-country">Country:</p>
                                <p class="card-director">Director:</p>
                                <p class="card-writer">Writer:</p>
                                <p class="card-actors">Actors:</p>
                                <p class="card-awards">Awards:</p>
                              </div>
                             <div class="dynamic-text-details">
                                <p>${data?.Title}</p>
                                <p>${data?.Released}</p>
                                <p>${data?.Genre}</p>
                                <p>${data?.Country}</p>
                                <p>${data?.Director}</p>
                                <p>${data?.Writer}</p>
                                <p>${data?.Actors}</p>
                                <p>${data?.Awards}</p>
                              </div>
                           </div>
                        </div>
                    </div>
                </div>`;
        }
        catch (err) {
                alert("Info movie not found!");
                location.reload();
        }
};