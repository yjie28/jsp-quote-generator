const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

/* for testing purposes, if there's too many error returned, stop making the api call */
let errorCounter = 0;

const showLoadingSpinner = () => {
  loader.hidden = false;
  quoteContainer.hidden = true;
};

const removeLoadingSpinner = () => {
  if (!loader.hidden) {
    quoteContainer.hidden = false;
    loader.hidden = true;
  }
};

const showErrorMessage = () => {
  quoteText.innerText = 'Oops, something is wrong! Please refresh the Page. ';
  authorText.hidden = true;
  twitterBtn.classList.add('disabled');
  newQuoteBtn.classList.add('disabled');
};

/* for keeping track of last and current quote */
let currentQuote = '';
let lastQuote = '';

// Get Quote From API
const getQuote = async () => {
  showLoadingSpinner();

  /* for CORS 
    original repo: https://github.com/Rob--W/cors-anywhere/

    fetch requests uses CORS policy. Might encounter CORS problem when using free 
    APIs because they might NOT be properly configured to send CORS headers. 
    (we are calling the forismatic API from our localhost in this case. )
  */
  const proxyUrl = 'https://peaceful-plateau-08683.herokuapp.com/';

  const apiUrl =
    'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';

  try {
    const response = await fetch(proxyUrl + apiUrl);
    const data = await response.json();

    // Exclude quote by Donald Trump :)
    if (data.quoteAuthor.split(' ').join('').toLowerCase() === 'donaldtrump') {
      getQuote();
    }

    // we don't want repeated quotes for 2 times in a row
    currentQuote = data.quoteText;

    // if current quote is equal to last quote and last quote is not empty, get new quote
    if (currentQuote === lastQuote && lastQuote) {
      getQuote();
    } else {
      // if author is blank, add 'Unknown'
      if (!data.quoteAuthor) {
        authorText.innerText = '- Unknown';
      } else {
        authorText.innerText = '- ' + data.quoteAuthor;
      }

      // Reduce font size for long quotes
      if (currentQuote.length > 120) {
        quoteText.classList.add('long-quote');
      } else {
        quoteText.classList.remove('long-quote');
      }
      quoteText.innerText = data.quoteText;

      lastQuote = currentQuote;

      // Stop Loading and Show Quote
      removeLoadingSpinner();
      errorCounter = 0; // clear errorCount after a successful load
    }
  } catch (error) {
    if (errorCounter > 20) {
      removeLoadingSpinner();
      showErrorMessage();
    } else {
      errorCounter++;
      getQuote();
    }
  }
};

// Tweet Quote
const tweetQuote = () => {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} ${author}`;
  window.open(twitterUrl, '_blank');
};

// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// On Load
getQuote();
