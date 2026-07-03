function renderMovieDetailsContent(movie){

    return `
        <button class="btn-back" id="backMovie">
            ← Voltar
        </button>

        <div class="movie-banner">
            <img src="${movie.banner}" alt="${movie.title}">
        </div>

        <h1 class="movie-title">
            ${movie.title}
        </h1>

        <div class="movie-meta">

            <div class="meta-item imdb">
                IMDb <span>★ ${movie.imdb}</span>
            </div>

            <div class="meta-item">
                ${movie.duration}
            </div>

            <div class="meta-item">
                ${movie.genre}
            </div>

        </div>
    `;
}