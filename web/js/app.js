(function () {

    const quotesEl = document.querySelector('.row');
    const loaderEl = document.querySelector('.loader');

    // get the quotes from API
    const getQuotes = async (page, limit) => {
        // var myHeaders = new Headers();
        // var requestOptions = {
        //   method: 'GET',
        //   headers: myHeaders,
        //   redirect: 'follow'
        // };
        const API_URL = `https://api.plantbased.wiki/v1/facts/?page=${page}&limit=${limit}`;
        const response = await fetch(API_URL);
        // handle 404
        if (!response.ok) {
            throw new Error(`An error occurred: ${response.status}`);
        }
        return await response.json();
    }

    // show the quotes
    const showQuotes = (quotes) => {
        quotes.forEach(quote => {
            const quoteEl = document.createElement('div');
            quoteEl.classList.add('col-sm-6', 'col-lg-4', 'mb-4');
            // quoteEl.style.position = 'absolute';
            // quoteEl.style.left = '50%';
            // quoteEl.style.top = '0px';


            // quoteEl.styleList.add('style="position: absolute; left: 50%; top: 0px;"')
            quoteEl.innerHTML = `
                <div class="card p-3">
                    <figure class="p-3 mb-0">
                        <blockquote class="blockquote">
                            <p>${quote.content}</p>
                        </blockquote>
                        <figcaption class="blockquote-footer mb-0 text-muted">
                        <a href="${quote.sourceURL}" target="_blank">${quote.sourceTitle}</a>, <i>${quote.sourceAuthor}</i>

                        </figcaption>
                    </figure>
                </div>
        `;

            quotesEl.appendChild(quoteEl);
        });
    };

    const hideLoader = () => {
        loaderEl.classList.remove('show');
    };

    const showLoader = () => {
        loaderEl.classList.add('show');
    };

    const hasMoreQuotes = (page, limit, total) => {
        const startIndex = (page - 1) * limit + 1;
        return total === 0 || startIndex < total;
    };

    // load quotes
    const loadQuotes = async (page, limit) => {

        // show the loader
        showLoader();

        // 0.5 second later
        setTimeout(async () => {
            try {
                // if having more quotes to fetch
                if (hasMoreQuotes(page, limit, total)) {
                    // call the API to get quotes
                    const response = await getQuotes(page, limit);
                    // show quotes
                    showQuotes(response);
                    // update the total
                    total = 100;
                }
            } catch (error) {
                console.log(error.message);
            } finally {
                hideLoader();
            }
        }, 500);

    };

    // control variables
    let currentPage = 1;
    const limit = 10;
    let total = 0;


    window.addEventListener('scroll', () => {
        const {
            scrollTop,
            scrollHeight,
            clientHeight
        } = document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight - 5 &&
            hasMoreQuotes(currentPage, limit, total)) {
            currentPage++;
            loadQuotes(currentPage, limit);
        }
    }, {
        passive: true
    });

    // initialize
    loadQuotes(currentPage, limit);

})();
