const state = {};
const allShowsUrl = "https://api.tvmaze.com/shows";

const fetchShows = async () => {
    if (state.allShows) {
        console.log("Using cached show data.");
        return state.allShows;
    }
    const response = await fetch(allShowsUrl);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const showData = await response.json();
    state.allShows = showData;
    return showData;
};

const fetchEpisodes = async (showId) => {
    const response = await fetch(
        `https://api.tvmaze.com/shows/${showId}/episodes`
    );
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
};

const showEpisodesView = () => {
    const showsContainer = document.querySelector(".shows-container");
    const episodesContainer = document.getElementById("episodes-container");
    const backButton = document.getElementById("back-to-shows-btn");
    const selectShow = document.getElementById("select-show");
    const selectMovie = document.getElementById("select-movie");
    const searchInput = document.getElementById("search-input");
    const episodeCount = document.getElementById("selectedMovie");

    showsContainer.style.display = "none";
    episodesContainer.style.display = "grid";

    backButton.style.display = "inline-block";
    selectShow.style.display = "inline-block";
    selectMovie.style.display = "inline-block";
    searchInput.style.display = "inline-block";
    episodeCount.style.display = "inline-block";
};

const showShowsView = () => {
    const showsContainer = document.querySelector(".shows-container");
    const episodesContainer = document.getElementById("episodes-container");
    const backButton = document.getElementById("back-to-shows-btn");
    const selectShow = document.getElementById("select-show");
    const selectMovie = document.getElementById("select-movie");
    const searchInput = document.getElementById("search-input");
    const episodeCount = document.getElementById("selectedMovie");

    showsContainer.style.display = "grid";
    episodesContainer.style.display = "none";
    
    backButton.style.display = "none";
    selectShow.style.display = "inline-block"; 
    selectMovie.style.display = "none";
    searchInput.style.display = "inline-block";
    episodeCount.style.display = "none";
};

const populateShowDropdown = (shows) => {
    const selectShow = document.getElementById("select-show");

    if (!selectShow) {
        console.error("select-show element not found!");
        return;
    }

    selectShow.innerHTML = "";
    const defaultShowOption = document.createElement("option");
    defaultShowOption.value = "";
    defaultShowOption.textContent = "--Select A Show--";
    selectShow.append(defaultShowOption);

    shows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

    shows.forEach((show) => {
        const option = document.createElement("option");
        option.value = show.id;
        option.textContent = show.name;
        selectShow.append(option);
    });
};

function makePageForShows(shows) {
    showShowsView();
    const showsContainer = document.querySelector(".shows-container");
    showsContainer.innerHTML = "";

    shows.forEach((show) => {
        const showCard = document.createElement("div");
        showCard.className = "show-card";

        const showName = document.createElement("h1");
        showName.className = "show-name";
        showName.textContent = show.name;
        showCard.append(showName);

        const imgShow = document.createElement("img");
        imgShow.className = "show-image";
        imgShow.src = show.image?.medium ? show.image.medium : "./path/to/placeholder.png";
        imgShow.alt = `image for ${show.name}`;
        showCard.append(imgShow);

        const summaryShow = document.createElement("p");
        summaryShow.className = "show-summary";
        summaryShow.innerHTML = show.summary;
        showCard.append(summaryShow);

        const detailsList = document.createElement("ul");
        detailsList.className = "show-details";
        detailsList.innerHTML = `
            <li><strong>Genres:</strong> ${show.genres.join(", ")}</li>
            <li><strong>Status:</strong> ${show.status}</li>
            <li><strong>Rating:</strong> ${show.rating.average}</li>
            <li><strong>Runtime:</strong> ${show.runtime} mins</li>
        `;
        showCard.append(detailsList);
        
        showName.addEventListener('click', async () => {
            const episodes = await fetchEpisodes(show.id);
            makePageForEpisodes(episodes);
        });

        showsContainer.append(showCard);
    });
}

function makePageForEpisodes(episodeList) {
    showEpisodesView()
    const episodesContainer = document.getElementById("episodes-container");
    const selectMovie = document.getElementById("select-movie");
    const paragraphD = document.getElementById("selectedMovie");

    episodesContainer.innerHTML = "";
    selectMovie.innerHTML = '<option value="">--Show All Episodes--</option>';
    
    paragraphD.textContent = `Displaying ${episodeList.length}/${episodeList.length} episodes`;

    episodeList.forEach((episode) => {
        const episodeCard = document.createElement("div");
        episodeCard.className = "episode-card";
        episodeCard.setAttribute("data-episode-code", `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`);

        const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
        
        const title = document.createElement("h2");
        title.textContent = `${episode.name} - ${episodeCode}`;
        episodeCard.appendChild(title);

        const img = document.createElement("img");
        img.className = "episode-image";
        img.src = episode.image?.medium ? episode.image.medium : "./levels/example-screenshots/example-level-100.png";
        img.alt = `Thumbnail for ${episode.name}`;
        episodeCard.appendChild(img);

        const summary = document.createElement("p");
        summary.className = "episode-summary";
        summary.innerHTML = episode.summary;
        episodeCard.appendChild(summary);

        const tvmazeLink = document.createElement("a");
        tvmazeLink.href = episode.url;
        tvmazeLink.textContent = "See more on TVMaze.com";
        episodeCard.appendChild(tvmazeLink);

        episodesContainer.append(episodeCard);

        const option = document.createElement("option");
        option.value = episodeCode;
        option.textContent = `${episodeCode} - ${episode.name}`;
        selectMovie.append(option);
    });
    updateEpisodeCount(episodeList.length, episodeList.length);
}

const updateEpisodeCount = (displayed, total) => {
    const paragraphD = document.getElementById("selectedMovie");
    paragraphD.textContent = `Displaying ${displayed}/${total} episodes`;
};

const setup = async () => {
    const rootElem = document.getElementById("root");
    rootElem.innerHTML = '';

    const controlsContainer = document.createElement("div");
    controlsContainer.id = "controls-container";
    rootElem.append(controlsContainer);

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.id = "search-input";
    searchInput.placeholder = "Search shows or episodes...";
    controlsContainer.append(searchInput);

    const selectShow = document.createElement("select");
    selectShow.id = "select-show";
    controlsContainer.append(selectShow);

    const selectMovie = document.createElement("select");
    selectMovie.id = "select-movie";
    controlsContainer.append(selectMovie);

    const defOption = document.createElement("option");
    defOption.value = "";
    defOption.textContent = "--Show All Episodes--";
    selectMovie.append(defOption);

    const paragraphD = document.createElement("p");
    paragraphD.id = "selectedMovie";
    paragraphD.textContent = "Displaying 0/0 episodes";
    controlsContainer.append(paragraphD);

    const backButton = document.createElement("button");
    backButton.textContent = "Back to Shows";
    backButton.id = "back-to-shows-btn";
    controlsContainer.append(backButton);

    const mainContentContainer = document.createElement("section");
    mainContentContainer.id = "main-content";
    rootElem.append(mainContentContainer);

    const showsContainer = document.createElement("div");
    showsContainer.className = "shows-container";
    mainContentContainer.append(showsContainer);

    const episodesContainer = document.createElement("div");
    episodesContainer.id = "episodes-container";
    episodesContainer.style.display = "none";
    mainContentContainer.append(episodesContainer);

    try {
        const allShows = await fetchShows();
        state.allShows = allShows;
        state.allEpisodes = []; 
        
        populateShowDropdown(allShows); 
        makePageForShows(allShows);
        
        backButton.addEventListener('click', () => {
            makePageForShows(state.allShows);
            searchInput.value = ""; 
            searchInput.placeholder = "Search shows...";
            selectShow.value = ""; 
        });

        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            const episodesContainer = document.getElementById("episodes-container");
            if (episodesContainer.style.display === "none") {
                const filteredShows = state.allShows.filter(show =>
                    show.name.toLowerCase().includes(searchTerm) ||
                    show.summary?.toLowerCase().includes(searchTerm) ||
                    show.genres.some(genre => genre.toLowerCase().includes(searchTerm))
                );
                makePageForShows(filteredShows);
            } else {
                let displayedCount = 0;
                const allEpisodeCards = episodesContainer.querySelectorAll(".episode-card");
                const totalCount = state.allEpisodes.length;

                allEpisodeCards.forEach(card => {
                    const episodeCode = card.getAttribute("data-episode-code");
                    const episode = state.allEpisodes.find(ep => `S${String(ep.season).padStart(2, "0")}E${String(ep.number).padStart(2, "0")}` === episodeCode);
            
                    if (episode && (episode.name.toLowerCase().includes(searchTerm) || episode.summary?.toLowerCase().includes(searchTerm))) {
                        card.style.display = "block";
                        displayedCount++;
                    } else {
                        card.style.display = "none";
                }
            });
             updateEpisodeCount(displayedCount, totalCount);
            }
        });

        selectShow.addEventListener('change', async (event) => {
            const showId = event.target.value;
            if (showId) {
                const episodes = await fetchEpisodes(showId);
                state.allEpisodes = episodes; 
                makePageForEpisodes(episodes);
                searchInput.value = ""; 
                searchInput.placeholder = "Search episodes...";
            }
        });

        selectMovie.addEventListener('change', (event) => {
            const selectedCode = event.target.value;
            const episodesContainer = document.getElementById("episodes-container");
            const allEpisodeCards = episodesContainer.querySelectorAll(".episode-card");
            let displayedCount = 0;
            const totalCount = state.allEpisodes.length;

            allEpisodeCards.forEach(card => {
                const episodeCode = card.getAttribute("data-episode-code");
                if (selectedCode === "" || episodeCode === selectedCode) {
                    card.style.display = "block";
                    displayedCount++;
                } else {
                    card.style.display = "none";
                }
            });
            updateEpisodeCount(displayedCount, totalCount);
        });

    } catch (error) {
        console.error("An error occurred while fetching data:", error);
        rootElem.innerHTML = `<p>Error loading data. Please try again.</p>`;
    }
};
window.onload = setup;