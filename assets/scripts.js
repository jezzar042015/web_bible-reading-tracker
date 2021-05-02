

window.onload = function () {
    var booknames = document.getElementsByClassName("book-title-container");

        for (let i = 0; i < booknames.length; i++) {

            var bookID = booknames[i].id.substring(2,booknames[i].id.length);

            // assign onclick events/listener        
                booknames[i].onclick = function () {
                    expandBookSection (this.id.substring(2,this.id.length));
                }
            
            // add progress bars
                booknames[i].insertAdjacentHTML('beforeend', 
                    '<div class="book-progress" id="p-' + bookID + '"></div>');
            
            // update width
                updateProgressBar (bookID);

        }
    
    // assigning on click event on the summary switch
    document.getElementById("summary-toggle").onclick = 
        toggleSummaryDisplay;
    
    //initiating local storage to store progress
    initiateTrackingStorage();


}

function expandBookSection (bookID) {
    
    // var currentSelection = document.getElementById("c-" + bookID);
    currentSelection = document.querySelector("#c-" + bookID);
    var currentDisplay = currentSelection.style.display;
    

    if (currentDisplay == "flex") { 
        currentSelection.style.display = "none" 
    } 
    else {
        collapseAll(); 
        currentSelection.style.display = "flex";
    }
    
    //adding the chapters
        var chapters = currentSelection.dataset.chapters;
        addChapters(bookID,chapters);
     
    //indicate the completed chapters on selected section        
        indicateCompletedChapters(bookID);

    
}

function collapseAll () {

    var books = document.getElementsByClassName("chapters-wrapper");

    for (let i = 0; i < books.length; i++) {
        document.getElementById(books[i].id).style.display = "none"; 
    }
}

function addChapters (bookID,chaptersCount) {

    var targetDiv = document.getElementById("c-" + bookID);

    var html = '';

    for (let i = 1; i <= chaptersCount; i++) {
        html = html + '<div class="chapter-number" id="' + bookID + '-' + i + '"><span class="chap-num-text">' + i + '</span></div>';
    }

    //add the chapters/numbers dynamically
        targetDiv.innerHTML = html;

    //add click listening events
    for (let i = 1; i <= chaptersCount; i++) {
        document.getElementById(bookID + '-' + i).onclick = function () {
            
            //check if this chapter has class "completed-chapter"

            if (this.classList.contains("completed-chapter") == false) {
                addCompletedChapter(this.id);
            }    else {
                unreadChapter(this.id);
            }

            updateProgressBar(bookID);
        }
    }

}


function initiateTrackingStorage() {
    if (localStorage.getItem('read-chapters')==null) {
        localStorage.setItem('read-chapters','[]')            
    }
}

// console.log(localStorage.getItem("user"));
// console.log(localStorage.getItem("read-chapters"));


function indicateCompletedChapters (bookID){
    var completedChapters = JSON.parse(localStorage.getItem("read-chapters"));

    for (let i = 0; i < completedChapters.length; i++)
    {
        var curChap = completedChapters[i];
       
        if (bookID == curChap.substring(0,curChap.indexOf('-'))) {
            document.getElementById(completedChapters[i]).classList.add("completed-chapter");
        }
    }

        
}


function updateProgressBar(bookID) {

    //get the total chapters
        var completedCount = countCompletedChapters(bookID)
        var totalChapters = 
            document.getElementById("c-"+bookID).dataset.chapters; 
        var progressBarDiv = document.getElementById("p-" + bookID);

        var progressRate = completedCount/totalChapters * 100;
        progressBarDiv.style.width = progressRate + '%';
}

function countCompletedChapters(bookID) {
    var completedChapters = JSON.parse(localStorage.getItem("read-chapters"));
    var count = 0;

    for (let i = 0; i < completedChapters.length; i++)
    {
        if (bookID == completedChapters[i].substring(0,completedChapters[i].indexOf('-'))) {
            count++;
        }
    }

    return count;
}

function addCompletedChapter (newChapter) {
    var completedChapters = JSON.parse(localStorage.getItem("read-chapters"));
    completedChapters.push(newChapter);

    //updating the local storage
    localStorage.setItem('read-chapters',JSON.stringify(completedChapters));

    document.getElementById(newChapter).classList.add("completed-chapter");
}

function unreadChapter (chapterToRemove) {
    var completedChapters = JSON.parse(localStorage.getItem("read-chapters"));

    //get the index of the chapter to remove
        let i = completedChapters.indexOf(chapterToRemove);
    //use splice to remove the chapter
        completedChapters.splice(i,1);
    //updating the local storage
        localStorage.setItem('read-chapters',JSON.stringify(completedChapters));
    //remove the class "completed-chapter" from the chapter
    document.getElementById(chapterToRemove).classList.remove("completed-chapter");

}


function toggleSummaryDisplay () {
    
    var summarySwitch = document.getElementById("summary-toggle");
    var summaryDiv = document.getElementById("summary-wrapper");

    if (summarySwitch.classList.contains("fa-caret-down") === true) {
        summarySwitch.classList.remove("fa-caret-down");
        summarySwitch.classList.add("fa-caret-up");

        summaryDiv.style.display = "block";
    }   

    else {
        summarySwitch.classList.remove("fa-caret-up");
        summarySwitch.classList.add("fa-caret-down");

        summaryDiv.style.display = "none";
    }


}