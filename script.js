const myLibrary = [];

function Book(title,author,read,ID) {
  // the constructor...
  this.title=title;
  this.author=author;
  this.read=read;
  this.ID=crypto.randomUUID();
  this.info=function(){
   console.log(this.title, this.author, this.read ,this.ID);

  };
 
}

function addBookToLibrary(title,author,read,ID) {
  // take params, create a book then store it in the array
  const addBook=new Book(title,author,read,ID);
  myLibrary.push(addBook);
  return addBook;

}
addBookToLibrary();

const theHobbit=new Book('The Hobbit','J.R.R','295');
theHobbit.info();

const book1 = addBookToLibrary("Andrei", "Marin", "DA");
book1.info(); // Afișează informațiile despre carte

const harryPotter=new Book('Harry Poter','J.R.R','200');
harryPotter.info();

console.log(myLibrary);


const addBookBTN=document.querySelector(".button-add-book");
const dialog=document.querySelector(".myDialog");

addBookBTN.addEventListener("click",()=>{
   dialog.showModal();
});
