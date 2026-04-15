/**
 * This module is focused on creating an easy to work with interface with the DOM
 * @author Violet French: https://github.com/Pirategirl9000
 */

/**
 * Selects a DOM element based on a CSS selector
 * @param selector The CSS selector of the requested element
 * @returns {HTMLAnchorElement | HTMLElement | HTMLAreaElement | HTMLAudioElement | HTMLBaseElement | HTMLQuoteElement | HTMLBodyElement | HTMLBRElement | HTMLButtonElement | HTMLCanvasElement | HTMLTableCaptionElement | HTMLTableColElement | HTMLDataElement | HTMLDataListElement | HTMLModElement | HTMLDetailsElement | HTMLDialogElement | HTMLDivElement | HTMLDListElement | HTMLEmbedElement | HTMLFieldSetElement | HTMLFormElement | HTMLHeadingElement | HTMLHeadElement | HTMLHRElement | HTMLHtmlElement | HTMLIFrameElement | HTMLImageElement | HTMLInputElement | HTMLLabelElement | HTMLLegendElement | HTMLLIElement | HTMLLinkElement | HTMLMapElement | HTMLMenuElement | HTMLMetaElement | HTMLMeterElement | HTMLObjectElement | HTMLOListElement | HTMLOptGroupElement | HTMLOptionElement | HTMLOutputElement | HTMLParagraphElement | HTMLPictureElement | HTMLPreElement | HTMLProgressElement | HTMLScriptElement | HTMLSelectElement | HTMLSlotElement | HTMLSourceElement | HTMLSpanElement | HTMLStyleElement | HTMLTableElement | HTMLTableSectionElement | HTMLTableCellElement | HTMLTemplateElement | HTMLTextAreaElement | HTMLTimeElement | HTMLTitleElement | HTMLTableRowElement | HTMLTrackElement | HTMLUListElement | HTMLVideoElement}
 */
function get(selector) {
    return document.querySelector(selector);
}

/**
 * Sets the text content of an HTML element with a corresponding CSS selector
 * @param selector The CSS selector of the object whose text is to be changed
 * @param text The new textContent for the element
 */
function setText(selector, text) {
    get(selector).textContent = text;
}

/**
 * Sets the value of an HTML element with a corresponding CSS selector
 * @param selector The CSS selector of the object whose value is to be changed
 * @param value The new value for the element
 */
function setValue(selector, value) {
    get(selector).value = value;
}

/**
 * Gets the value of a DOM element based on its CSS selector
 * @param selector The CSS selector of the object whose value is to be grabbed
 * @returns {string | any | number}
 */
function getValue(selector) {
    return get(selector).value;
}

/**
 * Grabs an element and clears it's value, if it has one, otherwise it will clear it's textContent
 * @param selector The CSS selector of the object which will be cleared
 */
function clear(selector) {
    const elem = get(selector);
    if (elem.value) elem.value = "";
    else elem.textContent = "";
}

/**
 * Grabs an element and focuses on it based on a CSS selector
 * @param selector The CSS selector of the object to set focus to
 */
function focus(selector) {
    get(selector).focus();
}

/**
 * Grabs and element and selects it based on a CSS selector
 * @param selector The CSS selector of the object to select
 */
function select(selector) {
    get(selector).select();
}

/**
 * Adds a function to run on DOMContentLoaded
 * @param func The function to run when DOMContentLoaded
 */
function load(func) {
    document.addEventListener("DOMContentLoaded", func);
}

/**
 * Adds a click listener to an object based on its CSS selector which calls a given function
 * @param selector The CSS selector for the object who is being given a click listener
 * @param func The function to run on-click
 */
function addClick(selector, func) {
    get(selector).addEventListener("click", func);
}

export {get, setText, setValue, getValue, clear, 
    focus, select, load, addClick};