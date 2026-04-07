// ==UserScript==
// @name         cardmarket-auto-sort
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Append parameters to Cardmarket Singles pages
// @author       LordBurrito
// @match        https://www.cardmarket.com/en/Magic/Products/Singles/*
// @match        https://www.cardmarket.com/en/Magic/Cards/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/LordBurrito/cardmarket-autosort-js/main/cardmarket-auto-sort.user.js
// @downloadURL  https://raw.githubusercontent.com/LordBurrito/cardmarket-autosort-js/main/cardmarket-auto-sort.user.js
// ==/UserScript==

(function () {
    'use strict';

    const url = window.location.href;

    const setPageRegex = /^https:\/\/www\.cardmarket\.com\/en\/Magic\/Products\/Singles\/[^\/\?]+(?:\?.*)?$/;
    const cardPageRegex = /^https:\/\/www\.cardmarket\.com\/en\/Magic\/(?:Products\/Singles\/[^\/\?]+\/[^\/\?]+|Cards\/[^\/\?]+)(?:\?.*)?$/;

    if (setPageRegex.test(url)) {
        const u = new URL(url);

        if (u.searchParams.get('mode') !== 'gallery' || u.searchParams.get('sortBy') !== 'price_desc') {
            u.searchParams.set('mode', 'gallery');
            u.searchParams.set('sortBy', 'price_desc');
            window.location.replace(u.toString());
            return;
        }
    }

    if (cardPageRegex.test(url)) {
        addActionButtons();
    }

    function addActionButtons() {
        if (document.getElementById('tm-cardmarket-buttons')) return;

        const container = document.createElement('div');
        container.id = 'tm-cardmarket-buttons';

        Object.assign(container.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '999999',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        });

        const sellerButton = createButton(
            '🇬🇧',
            'UK sellers',
            () => toggleParam('sellerCountry', '13'),
            isParamActive('sellerCountry', '13')
        );

        const foilButton = createButton(
            '⭐',
            'Foils only',
            () => toggleParam('isFoil', 'Y'),
            isParamActive('isFoil', 'Y')
        );

        container.appendChild(sellerButton);
        container.appendChild(foilButton);
        document.body.appendChild(container);
    }

    function isParamActive(name, value) {
        const u = new URL(window.location.href);
        return u.searchParams.get(name) === value;
    }

    function toggleParam(name, value) {
        const u = new URL(window.location.href);

        if (u.searchParams.get(name) === value) {
            u.searchParams.delete(name);
        } else {
            u.searchParams.set(name, value);
        }

        window.location.href = u.toString();
    }

    function createButton(text, label, onClick, active = false) {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = text;
        button.title = label;
        button.setAttribute('aria-label', label);
        button.addEventListener('click', onClick);

        Object.assign(button.style, {
            width: '44px',
            height: '44px',
            fontSize: '22px',
            lineHeight: '1',
            background: active ? '#2da44e' : '#1f6feb',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
        });

        return button;
    }
})();