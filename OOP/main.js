$(document).ready(function() {
    model.pickNumber();
    controller.changeImage();
    $('body').keydown(function(event) {
        if (event.keyCode === 13) {
            model.theGuessInput();
        }
    });
    $('.replay').on('click', controller.reset.bind(controller));
    $('#langInput').on('change', controller.langInputHandler);

});
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
            let randomNum = Math.floor(Math.random() * model.imgArray.length);
            $('.circleDiv').css({
                'background-image': `url(${model.imgArray[randomNum]})`,
            });
            model.imgArray.splice(randomNum, 1);
            if (model.imgArray.length === 0) {
                let images = ['../images/yosemite_background.jpg','../images/j_tree_landscape.jpg','../images/landscape_from_j_tree.jpg','../images/orange_lake.jpg','../images/glacier_mtn_park.jpg'];
                model.imgArray = images;

            }
        }, 1000);
    },
    langInputHandler: function() {
        let newLang = $('#langInput').val();
        model.currentLanguage = newLang;
        switch(model.modalText) {
            case null:
                view.guessOutOfRange();
                break;
            case 'out':
                view.guessOutOfRange();
                break;
            case 'found':
                view.userGuessedIt();
                break;
            case 'high':
                view.guessTooHigh();
                break;
            case 'low':
                view.guessTooLow();
                break;
        }
    }
};

let model = {
    theNumber: null,
    theGuess: null,
    currentLanguage: `english`,
    modalText: null,
    imgArray: ['../images/yosemite_background.jpg','../images/j_tree_landscape.jpg','../images/landscape_from_j_tree.jpg','../images/orange_lake.jpg','../images/glacier_mtn_park.jpg'],
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
                model.modelText = 'out';
            }
            else if (this.theGuess > this.theNumber) {
                view.guessTooHigh();
                view.circleSize();
                model.modalText = 'high';
            }
            else if (this.theGuess < this.theNumber) {
                view.guessTooLow();
                view.circleSize();
                model.modalText = 'low'
            }
            else if (this.theGuess == this.theNumber) {
                view.userGuessedIt();
                model.modalText = 'found'
            }
        }
    }
}
let view = {
    guessTooHigh: function() {
        $('#response_div').html(`<h2>${view.statements[model.currentLanguage].high}</h2>`);
    },
    guessTooLow: function() {
        $('#response_div').html(`<h2>${view.statements[model.currentLanguage].low}</h2>`);
    },
    guessOutOfRange: function() {
        $('#response_div').html(`<h2>${view.statements[model.currentLanguage].instructions}</h2>`);
    },
    userGuessedIt: function() {
        $('#response_div').html(`<h2>${view.statements[model.currentLanguage].equals}</h2>`);
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
        model.modalText = null;
        $('#response_div').html(`<h2>${view.statements[model.currentLanguage].instructions}</h2>`);
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
    },
    statements: {
        english: {
            instructions: `Pick a number 1-10`,
            low: `too low!`,
            equals: `you got it!`,
            high: `too high!`,
        },
        czech: {
            instructions: `Vyberte číslo 1-10`,
            low: `moc malo!`,
            equals: `uhadl jsi to!`,
            high: `moc vysoko!`
        },
        spanish: {
            instructions: `Elija un número 1-10`,
            low: `¡demasiado baja!`,
            equals: `¡lo tienes!`,
            high: `¡demasiado alto!`
        },
        chinese: {
            instructions: `选一个数字1-10`,
            low: `太低！`,
            equals: `你说对了！`,
            high: `太高！`
        },
        norwegian: {
            instructions: `Velg et nummer 1-10`,
            low: `for lavt!`,
            equals: `du har det!`,
            high: `for høy!`
        },
        russian: {
            instructions: `Выберите номер 1-10`,
            low: `слишком низко!`,
            equals: `Ты понял!`,
            high: `слишком высоко!`
        },
        french: {
            instructions: `Choisissez un numéro 1-10`,
            low: `trop bas!`,
            equals: `tu l'as eu!`,
            high: `trop haut!`
        },
        portuguese: {
            instructions: `Escolha um número 1-10`,
            low: `muito baixo!`,
            equals: `você entendeu!`,
            high: `muito alto!`
        },
        japanese: {
            instructions: `1〜10の数字を選ぶ`,
            low: `低すぎる！`,
            equals: `あなたはそれを持っています！`,
            high: `高すぎる！`
        },
    }
}

