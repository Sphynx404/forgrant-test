$(function () {

	customSelect('.custom-select');

	function customSelect(select) {
		$(select).each(function () {
			let select = $(this);
			let classes = select.attr('class');
			let options = '';

			select.children('option').each(function () {
				let option = $(this);
				let selected = (option.attr('selected')) ? 'is-selected' : '';

				options += `<li class="custom-option ${selected}" data-value="${option.attr('value')}">${option.text()}</li>`;
			});

			let template =
				`<div class="${classes}">
                <span class="custom-select-trigger">${select.attr('placeholder')}</span>
                <ul class="custom-options">${options}</ul>
            </div>`;

			select.hide().wrap('<div class="custom-select-wrapper"></div>');
			select.after(template);
		});

		$('.custom-option').each(function () {
			let option = $(this);
			if (option.hasClass('is-selected')) {
				option.parent().prev().addClass('is-active');
				option.parents('.custom-select').children('.custom-select-trigger').text(option.text());
			}
		});



		$('.custom-select-trigger').on('click', function (event) {
			$('html').one('click', function () {
				$('.custom-select').removeClass('is-visible');
			});
			$(this).parent().toggleClass('is-visible');
			event.stopPropagation();
		});



		$('.custom-option').on('click', function () {
			let option = $(this);
			option.addClass('is-selected').siblings().removeClass('is-selected');

			option.parent().prev().addClass('is-active');

			option.parents('.custom-select-wrapper').find(`option[value="${option.data('value')}"]`).attr('selected', true).change().siblings().attr('selected', false);

			option.parents('.custom-select').removeClass('is-visible').children('.custom-select-trigger').text(option.text());
		});
	};

	let coins = $('.coin');
	let currencySelect = $('select[name="currency"]');
	let currency = currencySelect.find('option:selected').val();
	refreshCoins(coins);



	currencySelect.on('change', function () {
		currency = $(this).find('option:selected').val();
		refreshCoins(coins);
	});

	$('.coin-percent-btn').on('click', function () {
		if ($(this).data('action') === 0) {
			$(this).data('action', 1).toggleClass('is-active');
		} else if ($(this).data('action') === 1) {
			$(this).data('action', 0).toggleClass('is-active');
		}

		let coin = $(this).parents('.coin');
		refreshCoins(coin)
	});

	function refreshCoins(coins) {
		if (coins.length == 1) {
			let coinCode = coins.attr('id');
			let percent = coins.find('.coin-percent-btn').data('action');
			getCoin(coinCode, currency, coins, percent);
		} else {
			coins.each(function (i, e) {
				e = $(e);
				let coinCode = e.attr('id');
				let percent = e.find('.coin-percent-btn').data('action');
				getCoin(coinCode, currency, e, percent);
			});
		}
	};

	function getCoin(coinCode, curr, elem, percent) {
		$.getJSON(`https://apiv2.bitcoinaverage.com/indices/global/ticker/${coinCode}${curr}`, function (data) {
			updateCoin(data, curr, elem, percent)
		});
	};

	function updateCoin(data, curr, elem, percent) {
		let currencySymbol = '';
		let price = 'price';
		let changes = elem.find('.coin-changes');
		switch (curr) {
			case 'USD':
				currencySymbol = '&#36;';
				break;
			case 'EUR':
				currencySymbol = '&euro;';
				break;
			case 'RUB':
				currencySymbol = '&#x584;';
				break;
			case 'GBP':
				currencySymbol = '&pound;';
				break;
		}

		elem.find('.coin-price>span').html(currencySymbol + data.ask);

		if (percent) {
			currencySymbol = '%';
			price = 'percent';
		}


		elem.find('[data-change="hour"]>span').html(data.changes[price].hour + currencySymbol);
		elem.find('[data-change="day"]>span').html(data.changes[price].day + currencySymbol);
		elem.find('[data-change="week"]>span').html(data.changes[price].week + currencySymbol);
		elem.find('[data-change="month"]>span').html(data.changes[price].month + currencySymbol);


		prettyChanges(changes);
	};

	function prettyChanges(changes) {
		changes.find('li').each(function (i, e) {
			e = $(e).find('span');
			let text = e.html();
			let val = parseFloat(text);
			if (val > 0) {
				e.removeClass('is-fall').addClass('is-rise').html('+' + text);
			} else if (val < 0) {
				e.removeClass('is-rise').addClass('is-fall').html(text);
			} else {
				e.removeClass('is-rise is-fall').html(0);
			}
		});
	};










});