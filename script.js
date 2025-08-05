//You can edit ALL of the code here
const state = {};
const allEpisodes = "https://api.tvmaze.com/shows/82/episodes";

const fetchEpisodes = async () => {
  const response = await fetch(allEpisodes);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const templateMovie = document.getElementById("episodes-template");

  rootElem.innerHTML = "";

  // Drop-down and search UI
  const divDropDown = document.createElement("div");
  divDropDown.className = "search-container";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = "search-input";
  searchInput.placeholder = "Search Episodes..";
  divDropDown.append(searchInput);

  const label = document.createElement("label");
  label.textContent = "Select An Episode ";
  label.setAttribute("for", "select-movie");

  const selectMovie = document.createElement("select");
  selectMovie.id = "select-movie";

  const defOption = document.createElement("option");
  defOption.value = "";
  defOption.textContent = "--Show All Episodes--";
  selectMovie.append(defOption);

  const paragraphD = document.createElement("p");
  paragraphD.id = "selectedMovie";
  paragraphD.textContent = "All Episodes Displayed.";

  divDropDown.append(label);
  divDropDown.append(selectMovie);
  divDropDown.append(paragraphD);
  rootElem.append(divDropDown);

  // Generate episode cards
  episodeList.forEach((episode) => {
    const episodeMovie = templateMovie.content.cloneNode(true);

    const movieTitle = episodeMovie.querySelector(
      ".episode-card-header .episode-title"
    );
    const imgMovie = episodeMovie.querySelector(".episode-image");
    const summaryMovie = episodeMovie.querySelector(".episode-summary");

    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    movieTitle.textContent = `${episode.name} - ${episodeCode}`;

    const option = document.createElement("option");
    option.value = episodeCode;
    option.textContent = `${episodeCode} - ${episode.name}`;
    selectMovie.append(option);

    imgMovie.src = episode.image?.medium
      ? episode.image.medium
      : "./levels/example-screenshots/example-level-100.png";
    imgMovie.alt = `Thumbnail for ${episode.name}`;

    summaryMovie.innerHTML = episode.summary;

    // Add .episode class and data-episode-code
    const episodeCard = episodeMovie.querySelector(".episode-card");
    episodeCard.classList.add("episode");
    episodeCard.setAttribute("data-episode-code", episodeCode);

    // TVMaze link
    const tvmazeLink = document.createElement("p");
    tvmazeLink.innerHTML = `<a href="${episode.url}">See more on TVMaze.com</a>`;
    episodeMovie.querySelector(".episode-card-body").appendChild(tvmazeLink);

    rootElem.append(episodeMovie);
  });

  // Select menu filtering
  selectMovie.addEventListener("change", function () {
    const selectedMovie = this.value;

    if (selectedMovie === "") {
      paragraphD.textContent = "All Episodes Selected";
      document.querySelectorAll(".episode").forEach((div) => {
        div.style.display = "block";
      });
    } else {
      const selectedOptionText = this.options[this.selectedIndex].textContent;
      paragraphD.textContent = `You selected: ${selectedOptionText}`;

      document.querySelectorAll(".episode").forEach((div) => {
        div.style.display = "none";
      });

      const targetEpisodeDiv = document.querySelector(
        `[data-episode-code="${selectedMovie}"]`
      );
      if (targetEpisodeDiv) {
        targetEpisodeDiv.style.display = "block";
      }
    }
  });

  // Search input filtering
  searchInput.addEventListener("input", function () {
    const searchItem = this.value.toLowerCase();
    const allEpisodes = document.querySelectorAll(".episode");
    let count = 0;

    allEpisodes.forEach((episodeDiv) => {
      const episodeCode = episodeDiv
        .getAttribute("data-episode-code")
        .toLowerCase();
      const episodeName = episodeDiv
        .querySelector("h2")
        .textContent.toLowerCase();

      if (
        episodeCode.includes(searchItem) ||
        episodeName.includes(searchItem)
      ) {
        episodeDiv.style.display = "block";
        count++;
      } else {
        episodeDiv.style.display = "none";
      }
    });

    paragraphD.textContent = `Displaying ${count}/${episodeList.length} episodes`;
  });
}

const setup = async () => {
  const rootElem = document.getElementById('root');
  rootElem.innerHTML = '<h1> Loading Episodes in course...</h1>';
  try {
    const arrayEpisodes = await fetchEpisodes() 
    state.arrayEpisodes = arrayEpisodes; 
    makePageForEpisodes(arrayEpisodes);
  } catch (error) {
    console.error('An error occurred while fetching data:', error);
          rootElem.innerHTML = `
      <div style="text-align: center; color: red;">
        <h1>Oops! Something went wrong.</h1>
        <p>Could not load the episode data. Please try again later.</p>
      </div>
    `;
  }
}

window.onload = setup;
