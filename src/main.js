import './css/index.css';
import IMask from 'imask';
import swal from 'sweetalert';

// Personalizing card
const cardBgColor1 = document.querySelector('.cc-bg svg > g g:nth-child(1) path');
const cardBgColor2 = document.querySelector('.cc-bg svg > g g:nth-child(2) path');
const cardLogo = document.querySelector('.cc-logo span:nth-child(2) img');

const setCardType = type => {
    const colors = {
        visa: ['#436d99', '#2d57f2'],
        mastercard: ['#df6f29', '#c69347'],
        discover: ['#FFC632', '#F73A67'],
        default: ['#323238', '#323238']
    };

    cardBgColor1.setAttribute('fill', colors[type][0]);
    cardBgColor2.setAttribute('fill', colors[type][1]);
    cardLogo.setAttribute('src', `cc-${type}.${type === 'discover' ? 'png' : 'svg'}`);
};
globalThis.setCardType = setCardType;

// Creating masks
const cardNumber = document.getElementById('card-number');
const cardNumberPattern = {
    mask: [
        {
            mask: '0000 0000 0000 0000',
            regex: /^4\d{0,15}/,
            cardType: 'visa'
        },
        {
            mask: '0000 0000 0000 0000',
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardType: 'mastercard'
        },
        {
            mask: '0000 0000 0000 0000',
            regex: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
            cardType: 'discover'
        },
        {
            mask: '0000 0000 0000 0000',
            cardType: 'default'
        }
    ],
    dispatch: (appended, dynamicMasked) => {
        const number = (dynamicMasked.value + appended).replace(/\D/g, '');

        return dynamicMasked.compiledMasks.find(({ regex }) => number.match(regex));
    }
};
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);
/*
[
    {
        mask: '0000 000000 00000',
        regex: /^3[47]\d{0,13}/,
        cardtype: 'american express'
    },
    {
        mask: '0000 0000 0000 0000',
        regex: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
        cardtype: 'discover'
    },
    {
        mask: '0000 000000 0000',
        regex: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
        cardtype: 'diners'
    },
    {
        mask: '0000 0000 0000 0000',
        regex: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
        cardtype: 'mastercard'
    },
    {
        mask: '0000 000000 00000',
        regex: /^(?:2131|1800)\d{0,11}/,
        cardtype: 'jcb15'
    },
    {
        mask: '0000 0000 0000 0000',
        regex: /^(?:35\d{0,2})\d{0,12}/,
        cardtype: 'jcb'
    },
    {
        mask: '0000 0000 0000 0000',
        regex: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
        cardtype: 'maestro'
    },
    {
        mask: '0000 0000 0000 0000',
        regex: /^4\d{0,15}/,
        cardtype: 'visa'
    },
    {
        mask: '0000 0000 0000 0000',
        regex: /^62\d{0,14}/,
        cardtype: 'unionpay'
    },
]
*/

const expirationDate = document.getElementById('expiration-date');
const expirationDatePattern = {
    mask: 'MM{/}YY',
    blocks: {
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        },
        YY: {
            mask: IMask.MaskedRange,
            from: parseInt(String(new Date().getFullYear()).slice(2)),
            to: parseInt(String(new Date().getFullYear()).slice(2)) + 10
        }
    }
};
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const securityCode = document.getElementById('security-code');
const securityCodeMasked = IMask(securityCode, {
    mask: '000'
});

// Changing card
const cardShowNumber = document.querySelector('.cc-number');
cardNumberMasked.on('accept', () => {
    cardShowNumber.innerText = cardNumberMasked.value.length > 0 ? cardNumberMasked.value : '0000 0000 0000 0000';
    cardNumber.style.borderColor = cardNumberMasked.value.length === 19 ? '#116011' : '#323238';
    setCardType(cardNumberMasked.masked.currentMask.cardType);
    console.log(cardNumberMasked.masked.currentMask.cardType);
});

const cardName = document.getElementById('card-holder');
const cardShowName = document.querySelector('.cc-holder .value');
cardName.addEventListener('input', () => {
    cardName.value = cardName.value.replace(/[0-9]/g, '');
    cardShowName.innerText = cardName.value.length > 0 ? cardName.value : 'Nome Completo';
    cardName.style.borderColor = cardName.value.match(/[a-zA-Z] [a-zA-Z]/) ? '#116011' : '#323238';
});

const cardShowExpirationDate = document.querySelector('.cc-extra .value');
expirationDateMasked.on('accept', () => {
    cardShowExpirationDate.innerText = expirationDateMasked.value.length > 0 ? expirationDateMasked.value : '00/00';
    expirationDate.style.borderColor = expirationDateMasked.value.length === 5 ? '#116011' : '#323238';
});

const cardShowSecurityCode = document.querySelector('.cc-security .value');
securityCodeMasked.on('accept', () => {
    cardShowSecurityCode.innerText = securityCodeMasked.value.length > 0 ? securityCodeMasked.value : '000';
    securityCode.style.borderColor = securityCodeMasked.value.length === 3 ? '#116011' : '#323238';
});

// form functionality
const inputs = [securityCode, cardName, expirationDate, cardNumber];
const button = document.getElementById('submitButton');

inputs.forEach(input => {
    // on a input in each input, verify if the color of the actual input and others if green (that is, if it is duly filled) and if all inputs are duly filled, unlock button submit
    input.addEventListener('input', () => {
        const enableButton = inputs.reduce((enable, input) => {
            return enable && input.style.borderColor === 'rgb(17, 96, 17)';
        }, true);

        if (enableButton) {
            button.classList.add('activeButton');
            button.disabled = false;
        } else {
            button.classList.remove('activeButton');
            button.disabled = true;
        }
    });
});

const form = document.querySelector('form');
form.addEventListener('submit', e => {
    e.preventDefault();

    let userFirstName = '';
    for (let letter of cardName.value) {
        if (letter === ' ') break;
        else userFirstName += letter;
    }

    swal(`Yo ${userFirstName.toLowerCase()}!`, 'Seu cartão foi cadastrado na nossa base de dados com sucesso!', 'success').then(() => {
        // resetting fields
        inputs.forEach(input => {
            input.value = '';
            input.style.borderColor = '#323238';
        });

        cardShowName.innerText = 'NOME COMPLETO';
        cardShowSecurityCode.innerText = '000';
        cardShowNumber.innerText = '0000 0000 0000 0000';
        cardShowExpirationDate.innerText = '00/00';
        setCardType('default');

        button.classList.remove('activeButton');
        button.disabled = true;
    });
});

// cleaning inputs on load
window.onload = () => {
    cardName.value = '';
    securityCode.value = '';
    cardNumber.value = '';
    expirationDate.value = '';
};
