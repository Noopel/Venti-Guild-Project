import jQuery from "jquery"

const headerContainer = document.querySelector("#headerContainer")

if(headerContainer) {
    $(headerContainer).load("/html/header.html")
}