


function displayFavourite(favourite) {
    const contianer = document.querySelector(".table");
    contianer.innerHTML+=
    `
    <div class="row">
        <div class="column">${favourite.id}</div>
        <div class="column">${favourite.categoryName}</div>
        <div class="column">
        <a href=${favourite.link}>${favourite.link}</a>
        </div>
        <div class="column">${favourite.updatedAt}</div>
    </div>
    `;
}
function displayFavouriteList(){
    
    const container = document.querySelector(".table");
    container.innerHTML=
    `<div class="table_header row">
        <div class="column">Id</div>
        <div class="column">Category</div>
        <div class="column">Link</div>
        <div class="column">Updated at</div>
    </div>`;

    fetch('http://127.0.0.1:8080/favourite/get',
    {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response=>response.json())
    .then(list => 
        {
            for (const index in list) {
                displayFavourite(list[index]);
            }
        }
        );
}

displayFavouriteList()