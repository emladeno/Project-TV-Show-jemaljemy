//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const divRoot = document.getElementById("root");
  const templateMovie = document.getElementById("episodes-template");
  episodeList.forEach((episode) => {
    const episodeMovie = templateMovie.content.cloneNode(true);

    const movieTitle = episodeMovie.querySelector(
      ".episode-card-header .episode-title"
    );
    const imgMovie = episodeMovie.querySelector(
      ".episode-card-body .episode-image"
    );
    const summaryMovie = episodeMovie.querySelector(
      ".episode-card-body .episode-summary"
    );

    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    movieTitle.textContent = ` ${episode.name} - ${episodeCode}`;

    imgMovie.src = episode.image.medium
      ? episode.image.medium
      : "./levels/example-screenshots/example-level-100.png";
    imgMovie.alt = `Thumbnail for ${episode.name}`;

    summaryMovie.innerHTML = episode.summary;

    const tvmazeLink = document.createElement("p");
    tvmazeLink.innerHTML = `<a href="${episode.url}">See more on TVMaze.com</a>`;
    episodeMovie.querySelector(".episode-card-body").appendChild(tvmazeLink);

    divRoot.append(episodeMovie);
  });
}

window.onload = setup;
