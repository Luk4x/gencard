import './css/index.css';

const cardBgColor1 = document.querySelector('.cc-bg svg > g g:nth-child(1) path');
const cardBgColor2 = document.querySelector('.cc-bg svg > g g:nth-child(2) path');
const cardLogo = document.querySelector('.cc-logo span:nth-child(2) img');

const setCardType = type => {
    const colors = {
        visa: ['#436d99', '#2d57f2'],
        mastercard: ['#df6f29', '#c69347'],
        default: ['black', 'gray']
    };

    cardBgColor1.setAttribute('fill', colors[type][0]);
    cardBgColor2.setAttribute('fill', colors[type][1]);
    cardLogo.setAttribute('src', `cc-${type}.svg`);
};
globalThis.setCardType = setCardType;

