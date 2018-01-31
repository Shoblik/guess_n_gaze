$(document).ready(function() {
    model.pickNumber();
    controller.changeImage();
    $('body').keydown(function(event) {
        if (event.keyCode === 13) {
            model.theGuessInput();
        }
    });
    $('.replay').on('click', controller.reset.bind(controller));
});

let imgArray = ['../images/yosemite_background.jpg','../images/j_tree_landscape.jpg','../images/landscape_from_j_tree.jpg','../images/orange_lake.jpg','../images/glacier_mtn_park.jpg'];
const statements = {
    english: {
        instructions: `Pick a number 1-10`,
        low: `too low!`,
        equals: `you got it!`,
        high: `too high!`,
    },
    czech: {
        instructions: `Vyber cislo mezi 1-10`,
        low: `moc malo!`,
        equals: `uhadl si to!`,
        high: `moc vysoko!`
    }
}
let currentLanguage = `english`;

let controller = {
    theDifference: function() {
        let difference = model.theGuess - model.theNumber;
        if (difference < 0) {
            difference *= -1;
        }
        difference = 10 - difference;
        return `${(difference * 7)}%`;
    },
    reset: function() {
        this.changeImage();
        model.pickNumber();
    },
    changeImage: function() {
        view.resetView();
        setTimeout(() => {
            let randomNum = Math.floor(Math.random() * imgArray.length);
            $('.circleDiv').css({
                'background-image': `url(${imgArray[randomNum]})`,
            });
            imgArray.splice(randomNum, 1);
            if (imgArray.length === 0) {
                let images = ['../images/yosemite_background.jpg','../images/j_tree_landscape.jpg','../images/landscape_from_j_tree.jpg','../images/orange_lake.jpg','../images/glacier_mtn_park.jpg'];
                imgArray = images;

            }
        }, 1000);
    }
};

let model = {
    theNumber: null,
    theGuess: null,
    pickNumber: function () {
        this.theNumber = Math.floor((Math.random() * 8) + 1);
    },
    theGuessInput: function () {
        this.theGuess = Number($('#guess_input').val());
        this.checkTheGuess();
    },
    checkTheGuess: function () {
        view.historyColumn(this.theGuess);
        view.clearInput();
        if (this.theGuess != '') {
            if (this.theGuess < 1 || this.theGuess > 10) {
                view.guessOutOfRange();
                view.circleSize();
            }
            else if (this.theGuess > this.theNumber) {
                view.guessTooHigh();
                view.circleSize();
            }
            else if (this.theGuess < this.theNumber) {
                view.guessTooLow();
                view.circleSize();
            }
            else if (this.theGuess == this.theNumber) {
                view.userGuessedIt();
            }
        }
    }
}
let view = {
    guessTooHigh: function() {
        $('#response_div').html(`<h2>${statements[currentLanguage].high}</h2>`);
    },
    guessTooLow: function() {
        $('#response_div').html(`<h2>${statements[currentLanguage].low}</h2>`);
    },
    guessOutOfRange: function() {
        $('#response_div').html(`<h2>${statements[currentLanguage].instructions}</h2>`);
    },
    userGuessedIt: function() {
        $('#response_div').html(`<h2>${statements[currentLanguage].equals}</h2>`);
        $('.backgroundImg').css('opacity', '1');
        $('.circleDiv').css({
            'width': '300%',
            'background-position': 'center',
            'border-radius': '0',
            'margin-top': "0",
            'width': '100vw',
            'height': '100%',
            'transition': '.6s'
        });
        $('.replay').css({
            'display':'block',
            'margin':'15px auto',
            });
    },
    circleSize: function() {
        $('.circleDiv').css({
            'padding-top': controller.theDifference(),
            'width': controller.theDifference(),
        })
    },
    resetView: function() {
        $('#response_div').html(`<h2>${statements[currentLanguage].instructions}</h2>`);
        $('.circleDiv').css({
            'width': '0%',
            'padding-top': '0%',
            'border-radius': '100%',
            'height': 'auto',
            'background-position': '53% 0%',
            'transition': '.8s'
        });
        $('.replay').css('display','none');
        $('.rightColumn').empty();
    },
    historyColumn: function(userGuess) {
        console.log('user guess ', userGuess);
        let numberDiv = $('<div>').css({
            height: '80px',
            width: '100%',
            backgroundImage: 'url(../images/'+ userGuess +'_0.svg)',
        }).addClass('numberDiv');
        console.log('url(../images/'+ userGuess +'.svg)');
        $('.rightColumn').prepend(numberDiv);
    },
    clearInput: function() {
        $('#guess_input').val('');
    }
}

