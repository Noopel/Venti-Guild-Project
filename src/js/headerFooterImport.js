import jQuery from "jquery"

const headerContainer = document.querySelector("#headerContainer")

if(headerContainer) {
    jQuery.$(headerContainer).load("/html/header.html")
}