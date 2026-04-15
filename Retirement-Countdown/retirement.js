/**
 * A program that uses your current financials (Principal[savings], interest-rate, monthly-income) and the date
 * to calculate when you will be able to retire
 * @author Violet French https://github.com/Pirategirl9000
 * @author Kyler Hanson  https://github.com/kyhans07
 * @see https://github.com/Pirategirl9000/Retirement-Countdown
 */

"use strict";

/**
 * Selects an element using CSS selectors via `querySelector`
 * @param selector the CSS selector
 * @returns {HTMLAnchorElement | HTMLElement | HTMLAreaElement | HTMLAudioElement | HTMLBaseElement | HTMLQuoteElement | HTMLBodyElement | HTMLBRElement | HTMLButtonElement | HTMLCanvasElement | HTMLTableCaptionElement | HTMLTableColElement | HTMLDataElement | HTMLDataListElement | HTMLModElement | HTMLDetailsElement | HTMLDialogElement | HTMLDivElement | HTMLDListElement | HTMLEmbedElement | HTMLFieldSetElement | HTMLFormElement | HTMLHeadingElement | HTMLHeadElement | HTMLHRElement | HTMLHtmlElement | HTMLIFrameElement | HTMLImageElement | HTMLInputElement | HTMLLabelElement | HTMLLegendElement | HTMLLIElement | HTMLLinkElement | HTMLMapElement | HTMLMenuElement | HTMLMetaElement | HTMLMeterElement | HTMLObjectElement | HTMLOListElement | HTMLOptGroupElement | HTMLOptionElement | HTMLOutputElement | HTMLParagraphElement | HTMLPictureElement | HTMLPreElement | HTMLProgressElement | HTMLScriptElement | HTMLSelectElement | HTMLSlotElement | HTMLSourceElement | HTMLSpanElement | HTMLStyleElement | HTMLTableElement | HTMLTableSectionElement | HTMLTableCellElement | HTMLTemplateElement | HTMLTextAreaElement | HTMLTimeElement | HTMLTitleElement | HTMLTableRowElement | HTMLTrackElement | HTMLUListElement | HTMLVideoElement}
 */
const $ = selector => document.querySelector(selector);

/**
 * The input element for the name
 * @type {HTMLInputElement}
 */
const nameIn    = $("#client_name");

/**
 * The input element for the email
 * @type {HTMLInputElement}
 */
const emailIn   = $("#email");

/**
 * The input element for current savings
 * @type {HTMLInputElement}
 */
const investIn  = $("#investment");

/**
 * The input element for how much money goes into your savings monthly
 * @type {HTMLInputElement}
 */
const addIn     = $("#monthly_add");

/**
 * The input element for interest-rate on your savings
 * @type {HTMLInputElement}
 */
const rateIn    = $("#rate");

/**
 * The input element for the date at which you will retire
 * @type {HTMLInputElement}
 */
const dateIn    = $("#retirement_date");

/**
 * The HTML element for outputting errors
 * @type {HTMLDivElement}
 */
const errBox    = $("#error_message");

/**
 * The HTML element for outputting the current status
 * @type {HTMLHeadingElement}
 */
const statusMsg = $("#status_message");

/**
 * The HTML element for outputting the amount in savings
 * @type {HTMLDivElement}
 */
const output    = $("#projection_output");

/**
 * The HTML form where the data is coming from
 * @type {HTMLFormElement}
 */
const form      = $("#projection_form");

/**
 * The HTML button for loading test data
 * @type {HTMLButtonElement}
 */
const testData  = $("#test_data");

/**
 * The interval object id used for calculating and displaying each year increment
 * @type {int|null}
 */
let projectionTimer = null;

/**
 * Formatter for turning currency into en-US format
 * @type {Intl.NumberFormat}
 */
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

/**
 * Processes and validates the entries from the form
 * @param evt the submission event for the form
 */
const processEntries = (evt) => {
    let isValid = true;
    let years = 0;

    evt.preventDefault();

    // Grab the values for validation
    const name = nameIn.value;
    const email = emailIn.value;
    const dateValue = dateIn.value;
    let balance = parseFloat(investIn.value);
    let monthlyIncome = parseFloat(addIn.value);
    let interestRate = parseFloat(rateIn.value);

    resetForm();

    // Ensure the name is not blank
    if (name.trim() === "") {
        $("#name_error").textContent = nameIn.title;
        isValid = false;
    }

    // Make sure the email is valid
    const emailPattern = /^[\w.\-]+@[\w.\-]+\.[a-zA-Z]+$/;
    if (!emailPattern.test(email)) {
        $("#email_error").textContent = emailIn.title;
        isValid = false;
    }

    if (!dateValue.trim()){
        $("#retire_date_error").textContent = dateIn.title;
        isValid = false;
    }  else {
        // Get Date objects for the current data and the date the user inputted for retirement
        const current = new Date();
        const date = new Date(dateValue);

        // How many years we need to calculate for
        years = date.getFullYear() - current.getFullYear();

        if (years <= 0 || years > 75) {
            $("#retire_date_error").textContent = dateIn.title;
            isValid = false;
        }
    }

    // Do checks on all number inputs to ensure they are a number and not less than zero
    if (isNaN(balance) || balance < 0) {
        $("#investment_error").textContent = investIn.title;
        isValid = false;
    } else {
        balance = Number(balance.toFixed(2));
    }

    if (isNaN(monthlyIncome) || monthlyIncome < 0) {
        $("#add_error").textContent = addIn.title;
        isValid = false;
    } else {
        monthlyIncome = Number(monthlyIncome.toFixed(2));
    }

    if (isNaN(interestRate) || interestRate < 0) {
        $("#rate_error").textContent = rateIn.title;
        isValid = false;
    }

    // See if we can start the projection or if they are still missing data
    try {
        if(!isValid) throw new Error("Please correct the entries highlighted below");


        document.body.style.width = "350px";

        // Save their inputs to local storage so we can load them on page reload
        setLocalStorage(name, email, dateValue, balance, monthlyIncome, interestRate);

        // Start performing the calculations for each year until their retirement
        startProjection(name, balance, monthlyIncome, interestRate, years);
    } catch(e) {
        document.body.style.width = "700px";
        errBox.textContent = e.message;
    }
};

/**
 * Starts the interval for calculating the yearly increments
 * @param name  The user's name
 * @param bal   The starting amount in savings
 * @param add   The amount of money that is added into savings monthly
 * @param rate  The interest rate for the savings account
 * @param years The number of years till they retire
 */
const startProjection = (name, bal, add, rate, years) => {
    statusMsg.textContent = `Live Projection: ${name}`;
    statusMsg.style.color = "red";
    let count = 1;

    const startYear = new Date().getFullYear();

    let formattedBal = formatter.format(bal);

    // Print the current year at the start with the starting balance
    output.textContent = `Year ${startYear} = ${formattedBal}`;


    projectionTimer = setInterval(() => {
        for (let i = 0; i < 12; i++){
            // Calculate the new balance for the savings account
            // Add the montly income, then multiply the account by it's interest rate
            bal = ((bal + add) * (1 + (rate / 12 / 100))).toFixed(2);
        }

        // Print the output for the current year
        output.textContent = `Year ${startYear + count}: ${formatter.format(bal)}`;


        // See if we are done with the calculations
        if (count >= years){
            clearInterval(projectionTimer);
            statusMsg.textContent = "Interval Complete!";
            statusMsg.style.color = "red";
        }

        // Increment the current year we are on
        count++;
    }, 1000);
};

/**
 * Saves the input values to local storage
 */
const setLocalStorage = (name, email, date, balance, monthlyAddIn, interestRate) => {
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("date", date);
    localStorage.setItem("balance", balance);
    localStorage.setItem("monthlyAddIn", monthlyAddIn);
    localStorage.setItem("interestRate", interestRate);
}

/**
 * Tries to load any values from local storage
 */
const loadLocalStorage = () => {
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const date = localStorage.getItem("date");
    const balance = localStorage.getItem("balance");
    const monthlyAddIn = localStorage.getItem("monthlyAddIn");
    const interestRate = localStorage.getItem("interestRate");

    if (name) nameIn.value = name;
    if (email) emailIn.value = email;
    if (date) dateIn.value = date;
    if (balance) investIn.value = balance;
    if (monthlyAddIn) addIn.value = monthlyAddIn;
    if (interestRate) rateIn.value = interestRate;
}

/**
 * Loads test data for the program
 */
const setTestData = () => {
    resetForm();
    nameIn.value = "John Doe";
    emailIn.value = "johnDoe@gmail.com";
    investIn.value = "100000";
    addIn.value = "500";
    rateIn.value = "5.5";

    // Set the retirement date to be in ten years from now
    const retirementDate = new Date();
    retirementDate.setFullYear(retirementDate.getFullYear() + 10);

    // Convert it to ISO string without the T in it
    dateIn.value = retirementDate.toISOString().split("T")[0];
};

/**
 * Resets the form and the interval
 */
const resetForm = () => {

    // Reset the form and interval
    form.reset();
    clearInterval(projectionTimer);

    // Reset all error spans to have their asterisks again
    document.querySelectorAll(".error").forEach(elem =>elem.textContent = "*")

    document.body.style.width = "350px";

    statusMsg.style.color = "red";
    statusMsg.textContent = "";
    output.textContent = "";
    nameIn.focus();
};

/**
 * Adds event listeners for the form and testData button on document load
 */
document.addEventListener("DOMContentLoaded", () => {
    form.addEventListener("submit", processEntries);
    form.addEventListener("reset", resetForm);
    testData.addEventListener("click", setTestData);

    loadLocalStorage();
});