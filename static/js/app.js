$(document).ready(function() {
    // Function to populate the crypto list
    function populateCryptoList() {
        $.get('/top_ten_prices', function(data) {
            var cryptoList = '';
            data.forEach(function(crypto) {
                var price = parseFloat(crypto.quote.USD.price).toFixed(10);
                var percentChange24h = parseFloat(crypto.quote.USD.percent_change_24h).toFixed(2);
                var changeSymbol = percentChange24h >= 0 ? '▲' : '▼'; // Use up arrow for positive change and down arrow for negative change
                var colorClass = percentChange24h >= 0 ? 'text-success' : 'text-danger'; // Use green color for positive change and red color for negative change

                price = parseFloat(price).toString();
                if (price.length > 10) {
                    price = price.slice(0, 10);
                }

                cryptoList += `
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${crypto.symbol}" id="crypto-${crypto.symbol}">
                        <label class="form-check-label" for="crypto-${crypto.symbol}">
                            <img class="coin-logo" src="https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png" alt="${crypto.name} Logo" style="width: 30px; height: 30px;"> ${crypto.name} <span class="crypto-price">$${price}</span><br><span class="${colorClass} percent-change"> ${changeSymbol} ${Math.abs(percentChange24h)}%</span>
                        </label>
                    </div>
                `;
            });
            $('#top-ten-cryptos-list').html(cryptoList);
            updateSelectedCryptos(getSelectedCryptos());
        });
    }

    // Function to populate the remaining crypto list
    function populateRemainingCryptoList() {
        $.get('/remaining_prices', function(data) {
            var cryptoList = '';
            data.forEach(function(crypto) {
                var price = parseFloat(crypto.quote.USD.price).toFixed(10);
                var percentChange24h = parseFloat(crypto.quote.USD.percent_change_24h).toFixed(2);
                var changeSymbol = percentChange24h >= 0 ? '▲' : '▼'; // Use up arrow for positive change and down arrow for negative change
                var colorClass = percentChange24h >= 0 ? 'text-success' : 'text-danger'; // Use green color for positive change and red color for negative change

                price = parseFloat(price).toString();
                if (price.length > 10) {
                    price = price.slice(0, 10);
                }

                cryptoList += `
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${crypto.symbol}" id="crypto-${crypto.symbol}">
                        <label class="form-check-label" for="crypto-${crypto.symbol}">
                            <img class="coin-logo" src="https://s2.coinmarketcap.com/static/img/coins/64x64/${crypto.id}.png" alt="${crypto.name} Logo" style="width: 30px; height: 30px;"> ${crypto.name} <span class="crypto-price">$${price}</span><br><span class="${colorClass} percent-change"> ${changeSymbol} ${Math.abs(percentChange24h)}%</span>
                        </label>
                    </div>
                `;
            });
            $('#remaining-cryptos-list').html(cryptoList);
            updateSelectedCryptos(getSelectedCryptos());
        });
    }

    populateCryptoList();
    populateRemainingCryptoList();
    startDataRefresh(); // Start periodic data refresh

    // Function to start data refresh at regular intervals
    function startDataRefresh() {
        setInterval(function() {
            updatePrices(); // Call function to update prices
        }, 60000); // Refresh every 1 minute (60000 milliseconds)
    }

 // Function to update prices for a given set of data
function updatePricesForData(data) {
    data.forEach(function(crypto) {
        var price = parseFloat(crypto.quote.USD.price).toFixed(10);
        var priceElement = $(`#crypto-${crypto.symbol}`).siblings('label').find('.crypto-price');
        var priceText = priceElement.text();
        var selected = $(`#crypto-${crypto.symbol}`).prop('checked'); // Check if the cryptocurrency is selected

        // Store the current text color
        var textColorClass = priceElement.css('color');

        // Update only the price text
        priceElement.text(price);

        // Preserve selection
        if (selected) {
            // If the cryptocurrency was selected, re-check it after updating the price
            $(`#crypto-${crypto.symbol}`).prop('checked', true);
        }

        // Reapply the stored text color
        priceElement.css('color', textColorClass);

        // Update percent change and apply text color
        var percentChangeElement = $(`#crypto-${crypto.symbol}`).siblings('label').find('.percent-change');
        var percentChange = parseFloat(crypto.quote.USD.percent_change_24h).toFixed(2);
        var isPositiveChange = percentChange >= 0;
        var textColorClass = isPositiveChange ? 'text-success' : 'text-danger';

        // Apply text color to crypto name, price, and percent change
        var cryptoNameElement = $(`#crypto-${crypto.symbol}`).siblings('label').find('.coin-logo');
        cryptoNameElement.css('color', textColorClass);
        priceElement.css('color', textColorClass);
        percentChangeElement.removeClass('text-success text-danger').addClass(textColorClass);
    });
}

// Function to update cryptocurrency prices
function updatePrices() {
    // Store the current background color of the widget
    var currentWidgetColor = $('.cryptoprice_widget').css('background-color');

    // Store the current text color of the announcement bar
    var currentAnnouncementBarTextColor = $('.cryptoprice_announcement_bar span').css('color');

    // Store the current text color of the widget
    var currentWidgetTextColor = $('#widget-display').find('*').css('color');

    // Function to update percent change
    function updatePercentChange() {
        // Update top ten percent change
        $.get('/top_ten_prices', function(data) {
            updatePercentChangeForData(data);
        });

        // Update remaining percent change
        $.get('/remaining_prices', function(data) {
            updatePercentChangeForData(data);
        });
    }

    // Update top ten prices
    $.get('/top_ten_prices', function(data) {
        updatePricesForData(data);
        // Update percent change
        updatePercentChange();
        // Reapply styles after updating content
        updateAnnouncementBar(getSelectedCryptos(), $('input[name="announcement-color"]:checked').val());
        updateWidget(getSelectedCryptos(), $('input[name="widget-color"]:checked').val());
        // Reapply alignment after updating content
        alignTable($('input[name="alignment"]:checked').val());
        // Restore the background color of the widget
        $('.cryptoprice_widget').css('background-color', currentWidgetColor);
        // Restore the text color of the announcement bar
        $('.cryptoprice_announcement_bar span').css('color', currentAnnouncementBarTextColor);
        // Restore the text color of the widget
        $('#widget-display').find('*').css('color', currentWidgetTextColor);
    });

    // Update remaining prices
    $.get('/remaining_prices', function(data) {
        updatePricesForData(data);
        // Update percent change
        updatePercentChange();
        // Reapply styles after updating content
        updateAnnouncementBar(getSelectedCryptos(), $('input[name="announcement-color"]:checked').val());
        updateWidget(getSelectedCryptos(), $('input[name="widget-color"]:checked').val());
        // Reapply alignment after updating content
        alignTable($('input[name="alignment"]:checked').val());
        // Restore the background color of the widget
        $('.cryptoprice_widget').css('background-color', currentWidgetColor);
        // Restore the text color of the announcement bar
        $('.cryptoprice_announcement_bar span').css('color', currentAnnouncementBarTextColor);
        // Restore the text color of the widget
        $('#widget-display').find('*').css('color', currentWidgetTextColor);
    });
}

    // Event listener for form submission
    $('#preferences-form').submit(function(event) {
        event.preventDefault();
        updateSelectedCryptos(getSelectedCryptos());
    });

    // Function to get selected cryptos
    function getSelectedCryptos() {
        return $('input[type=checkbox]:checked').map(function() {
            return $(this).val();
        }).get();
    }

// Function to update selected cryptos
function updateSelectedCryptos(selectedCryptos) {
    // Store the current background color of the widget
    var widgetBackgroundColor = $('.cryptoprice_widget').css('background-color');

    if (selectedCryptos.length > 0) {
        // Update announcement bar display
        updateAnnouncementBar(selectedCryptos, $('input[name="announcement-color"]:checked').val());
        // Update widget display and pass the background color
        updateWidget(selectedCryptos, widgetBackgroundColor);

        // Reapply style changes for announcement bar
        updateAnnouncementBarColors($('input[name="crypto-price-color"]').val());
        // Reapply text color changes for widget
        updateWidgetTextColor($('#widget-text-color').val());
        // Reapply alignment
        alignTable($('input[name="alignment"]:checked').val());
    } else {
        // Clear announcement bar display
        $('#announcement-bar-display').html('');
        // Clear widget display
        $('#widget-display').html('');
    }

    // Reapply the stored background color to the widget
    $('.cryptoprice_widget').css('background-color', widgetBackgroundColor);
}


    // Function to update Announcement bar display
    function updateAnnouncementBar(selectedCryptos, color) {
        var announcementBarHTML = '';
        if (selectedCryptos.length > 0) {
            announcementBarHTML += `<div class="cryptoprice_announcement_bar" id="announcement-bar" style="background-color: ${color};">`;
            selectedCryptos.forEach(function(crypto) {
                var logoSrcElement = $(`#crypto-${crypto}`).siblings('label').find('.coin-logo');
                if (logoSrcElement.length > 0) {
                    var logoSrc = logoSrcElement.attr('src');
                    var priceElement = $(`#crypto-${crypto}`).siblings('label').find('.crypto-price');
                    var priceText = priceElement.text();
                    var percentChangeText = $(`#crypto-${crypto}`).siblings('label').find('.percent-change').text();
                    var isPositiveChange = percentChangeText.includes('▲'); // Check if percent change indicates positive change

                    // Determine text color based on percent change
                    var textColorClass = isPositiveChange ? 'text-success' : 'text-danger';

                    announcementBarHTML += `
                        <a class="nav-link" href="#">
                            <img src="${logoSrc}" alt="${crypto} Logo" class="crypto-logo">
                            <span style="color: ${color};">${crypto}</span> <span style="color: ${color};">${priceText}</span> &nbsp;<span class="${textColorClass}">${percentChangeText}</span>&nbsp;`;
                }
            });
            announcementBarHTML += `</div>`;
        } else {
            $('#announcement-bar-display').html('');
        }

        $('#announcement-bar-display').html(announcementBarHTML);
        startHorizontalScroll();
    }

// Function to update widget display
function updateWidget(selectedCryptos, backgroundColor) {
    var widgetHTML = '';
    
    if (selectedCryptos.length > 0) {
        // Generate widget HTML
        widgetHTML += `<table class="table cryptoprice_widget" style="background-color: ${backgroundColor};"><tbody>`;
    
        selectedCryptos.forEach(function(crypto) {
            // Get cryptocurrency data
            var logoSrcElement = $(`#crypto-${crypto}`).siblings('label').find('.coin-logo');
            if (logoSrcElement.length > 0) {
                var logoSrc = logoSrcElement.attr('src');
                var priceText = $(`#crypto-${crypto}`).siblings('label').find('.crypto-price').text();
                var percentChangeText = $(`#crypto-${crypto}`).siblings('label').find('.percent-change').text();
                var isPositiveChange = percentChangeText.includes('▲'); // Check if percent change indicates positive change

                // Determine text color based on percent change
                var textColorClass = isPositiveChange ? 'text-success' : 'text-danger';

                widgetHTML += `
                    <tr>
                        <td><img src="${logoSrc}" alt="${crypto} Logo" class="crypto-logo" style="padding-top: 5px"></td>
                        <td>${crypto}</td>
                        <td>${priceText} <br style="padding-top: 5px"> <span class="${textColorClass}">${percentChangeText}</span>&nbsp;</td>
                    </tr>
                `;
            }
        });
        widgetHTML += `</tbody></table>`;
    }

    // Update widget display
    $('#widget-display').html(widgetHTML);

    // Update background color of the widget
    $('.cryptoprice_widget').css('background-color', backgroundColor);
}



// Function to update the background color of the announcement bar
function updateAnnouncementBarColor(color) {
    $('#announcement-bar-display').css('background-color', color);
}

// Event listener for announcement bar color change
$('input[name="announcement-color"]').on('input', function() {
    var color = $(this).val();
    updateAnnouncementBarColor(color);
});



// Event listener for color change for both crypto and price
$('input[name="crypto-price-color"]').on('input', function() {
    var color = $(this).val();
    updateAnnouncementBarColors(color);
});

// Function to update announcement bar colors for both crypto and price
function updateAnnouncementBarColors(color) {
    // Update color for both crypto and price
    $('.cryptoprice_announcement_bar span').css('color', color);
}




// Event listener for widget text color change
$(document).on('input', '#widget-text-color', function() {
    var color = $(this).val();
    updateWidgetTextColor(color); // Call function to update widget text color
});

// Function to update widget text color
function updateWidgetTextColor(color) {
    // Update text color of all elements inside widget display
    $('#widget-display').find('*').css('color', color);
}




// Event listener for widget bar color change
$(document).on('input', '#widget-color', function() {
    var color = $(this).val(); // Change to $(this).val() to get the selected color
    updateWidgetBackgroundColor(color); // Call the new function to update background color
});

// Function to update the background color of the widget
function updateWidgetBackgroundColor(color) {
    $('.cryptoprice_widget').css('background-color', color);
}






    // Function to handle alignment based on selected radio button
    $(document).on('change', 'input[name="alignment"]', function() {
        var alignment = $('input[name="alignment"]:checked').val();
        alignTable(alignment); // Call the alignment function with the selected alignment
    });

    // Alignment function
    function alignTable(alignment) {
        var table = $('#widget-display table');
        if (alignment === 'left') {
            table.css({
                'margin': 'auto',
                'margin-right': 'auto',
                'margin-left': '0'
            }); // Align left
        } else if (alignment === 'center') {
            table.css({
                'margin': 'auto',
                'margin-right': 'auto',
                'margin-left': 'auto'
            }); // Align center
        } else if (alignment === 'right') {
            table.css({
                'margin': 'auto',
                'margin-right': '0',
                'margin-left': 'auto'
            }); // Align right
        }
    }

    // Function to start horizontal scroll animation
    function startHorizontalScroll() {
        const container = document.getElementById('announcement-bar');
        const containerWidth = container.scrollWidth;
        const containerInnerWidth = container.clientWidth;

        // Set interval duration (milliseconds)
        const intervalDuration = 20; // Adjust interval duration for speed control

        // Set scroll amount
        let scrollAmount = 1; // Adjust scroll amount for speed control

        // Check if container width is greater than inner width
        if (containerWidth > containerInnerWidth) {
            // Define function for scrolling
            function scroll() {
                // Check if container width is greater than or equal to scroll amount
                if (container.scrollLeft < containerWidth - containerInnerWidth) {
                    container.scrollLeft += scrollAmount; // Scroll right
                } else {
                    container.scrollLeft = 0; // Reset scroll position to beginning
                }
            }

            // Start interval for scrolling
            let scrollInterval; // Define scroll interval variable

            // Function to start scrolling interval
            function startScrollInterval() {
                scrollInterval = setInterval(scroll, intervalDuration); // Start scrolling
            }

            // Function to stop scrolling interval
            function stopScrollInterval() {
                clearInterval(scrollInterval); // Stop scrolling
            }

            // Start scrolling interval initially
            startScrollInterval();

                        // Pause scrolling on mouse hover
        container.addEventListener('mouseenter', stopScrollInterval);

        // Resume scrolling on mouse leave
        container.addEventListener('mouseleave', startScrollInterval);
    }
    }


    // search function
$('#search-input').on('input', function() {
    var searchText = $(this).val().toLowerCase();
    filterCryptos(searchText);
});

function filterCryptos(searchText) {
    // Loop through each cryptocurrency item in the remaining-cryptos-list container
    $('#remaining-cryptos-list .form-check').each(function() {
        var cryptoName = $(this).text().toLowerCase(); // Get the text of the cryptocurrency item
        if (cryptoName.includes(searchText)) {
            $(this).show(); // Show the item if it matches the search query
        } else {
            $(this).hide(); // Hide the item if it doesn't match the search query
        }
    });
}



});