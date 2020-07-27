const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

// Show Loading
const loading = () => {
  loader.hidden = false;
  quoteContainer.hidden = true;
};

// Hide Loading
/* complete as to finish fetching the quote */
const complete = () => {
  if (!loader.hidden) {
    quoteContainer.hidden = false;
    loader.hidden = true;
  }
};

// Get Quote From API
const getQuote = async () => {
  loading();

  /* for CORS 
    original repo: https://github.com/Rob--W/cors-anywhere/
  */
  const proxyUrl = 'https://peaceful-plateau-08683.herokuapp.com/';

  const apiUrl =
    'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';

  try {
    const response = await fetch(proxyUrl + apiUrl);
    const data = await response.json();

    // Exclude quote by Donald Trump :)
    if (data.quoteAuthor === 'Donald Trump') {
      getQuote();
    }

    // if author is blank, add 'Unknown
    if (!data.quoteAuthor) {
      authorText.innerText = '- Unknown';
    } else {
      authorText.innerText = '- ' + data.quoteAuthor;
    }

    // Reduce font size for long quotes
    if (data.quoteText.length > 120) {
      quoteText.classList.add('long-quote');
    } else {
      quoteText.classList.remove('long-quote');
    }
    quoteText.innerText = data.quoteText;

    // Stop Loading and Show Quote
    complete();
  } catch (error) {
    getQuote();
  }
};

// Tweet Quote
const tweetQuote = () => {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
  window.open(twitterUrl, '_blank');
};

// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// On Load
getQuote();
