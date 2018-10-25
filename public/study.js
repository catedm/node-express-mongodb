var cards;
var cardsArray;
var url = `http://localhost:3030/api/decks/${window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}/cards`;
fetch(url)
  .then(res => res.json())
  .then(data => cardsArray = data);

var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{
    'header': 1
  }, {
    'header': 2
  }], // custom button values
  [{
    'list': 'ordered'
  }, {
    'list': 'bullet'
  }],
  [{
    'script': 'sub'
  }, {
    'script': 'super'
  }], // superscript/subscript
  [{
    'indent': '-1'
  }, {
    'indent': '+1'
  }], // outdent/indent
  [{
    'direction': 'rtl'
  }], // text direction

  [{
    'size': ['small', false, 'large', 'huge']
  }], // custom dropdown
  [{
    'header': [1, 2, 3, 4, 5, 6, false]
  }],

  [{
    'color': []
  }, {
    'background': []
  }], // dropdown with defaults from theme
  [{
    'font': []
  }],
  [{
    'align': []
  }],

  ['clean'] // remove formatting button
];

document.querySelector('.study-now').addEventListener('click', function(e) {
  cards = cardIterator(cardsArray);

  this.innerText = "Studying...";
  this.disabled = true;

  // Set first card
  nextCard();
});

document.querySelector('.study-container').addEventListener('click', function(e) {
  if (e.target.classList.contains('show-answer')) {
    document.querySelector('.show-answer').style.display = 'none';
    document.querySelector('.card-back').style.display = 'block';
    document.querySelector('.next-card').style.display = 'inline';
  } else if (e.target.classList.contains('edit-card')) {
    document.querySelector('.next-card').style.display = 'none';
    document.querySelector('.exit-study').style.display = 'none';
    document.querySelector('.edit-card').style.display = 'none';
    document.querySelector('.show-answer').style.display = 'none';
    document.querySelector('.save-card').style.display = 'inline';
    document.querySelector('.cancel-edit').style.display = 'inline';
    document.querySelector('.card-back').style.display = 'block';
    back.enable(true);
  } else if (e.target.classList.contains('cancel-edit')) {
    document.querySelector('.exit-study').style.display = 'inline';
    document.querySelector('.edit-card').style.display = 'inline';
    document.querySelector('.show-answer').style.display = 'inline';
    document.querySelector('.save-card').style.display = 'none';
    document.querySelector('.cancel-edit').style.display = 'none';
    document.querySelector('.card-back').style.display = 'none';
    back.enable(false);
  } else if (e.target.classList.contains('exit-study')) {
    window.location.reload();
  } else if (e.target.classList.contains('next-card')) {
    nextCard();
  }
});


function nextCard() {
  const currentCard = cards.next().value;

  if (currentCard !== undefined) {
    document.querySelector('.study-container').innerHTML = `
    <div class="card-front uk-grid-collapse uk-margin-bottom" uk-grid>
      <div class="add-card-form-container uk-width-expand@m">
        <div class="card-body uk-padding">
          <!-- Create the editor container -->
          <div id="front">
          </div>
        </div>
      </div>
    </div>
    <div class="card-back uk-grid-collapse" uk-grid>
      <div class="add-card-form-container uk-width-expand@m">
        <div class="card-body uk-padding">
          <!-- Create the editor container -->
          <div id="back">
          </div>
        </div>
      </div>
    </div>
    <p class="uk-text-right">
      <button class="exit-study uk-button uk-button-default">Exit Study</button>
      <button class="edit-card uk-button uk-button-primary">Edit Card</button>
      <button class="cancel-edit uk-button uk-button-default">Cancel</button>
      <button class="save-card uk-button uk-button-primary">Save Card</button>
      <button class="show-answer uk-button uk-button-primary">Show Answer</button>
      <button class="next-card uk-button uk-button-primary">Next</button>
    </p>
    `;


    front = new Quill('#front', {
      modules: {
        syntax: true,
        toolbar: toolbarOptions
      },
      theme: 'snow'
    });

    back = new Quill('#back', {
      modules: {
        syntax: true,
        toolbar: toolbarOptions
      },
      theme: 'snow'
    });

  front.setContents(JSON.parse(currentCard.front));
  back.setContents(JSON.parse(currentCard.back));
  back.enable(false);

} else {
  // No more cards
  window.location.reload();
}
}

// Card Iterator
function cardIterator(cards) {
  let nextIndex = 0;

  return {
    next: function() {
      return nextIndex < cards.length ? {
        value: cards[nextIndex++],
        done: false
      } : {
        done: true
      }
    }
  };
}
