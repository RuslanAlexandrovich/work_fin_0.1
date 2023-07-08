
class NewsFeed {
  constructor() {
    this.newsArray = [];
  }

  get newsCount() {
    return this.newsArray.length;
  }
// Ограничение длинны текста новости
  limitTextLength(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  displayNews() {
    const container = document.getElementById('news-container');
    container.innerHTML = '';
    let username = getCookie("username");
    if(username){
    username = decodeURIComponent(username);
    username = new TextDecoder().decode(base64ToBytes(username));
    }
    // username  = base64ToBytes(username);
    this.newsArray.forEach((news, index) => {
      console.log(`Item ${index}`, news);
      let editLink = username === news.username ? `<a href='/news/${news.id}/edit'>&#9998;</a>`: `<a style='color: #777'>&#9998;</a>`;
      let removeLink = username === news.username ? `<div class="close-button" data-news-index=${index} onclick=removeNewsFrom(${news.id})>&#10006;</div>` : `<div style='color: #777'>&#10006;</div>`;
      const card = document.createElement('div');
      card.classList.add('news-card');
      card.innerHTML = `
      <div class="header_plus">
      <h3 style="margin: 0;"><a style="text-decoration: none;" href='/news/${news.id}'>${news.title}</a></h3>
      <div class="head_card">
      <div class="edit_button" data-news-index="${index}">${editLink}</div>
        <div class="close-button" data-news-index="${index}">${removeLink}</div>
        </div></div>
        <p class="text_news_style";>${this.limitTextLength(news.content, 200)}</p>
        <div class="tags">${news.tags}</div>
        <div class="date">${news.date}</div>
        <div class="date">${news.username}</div>
      `;
      container.appendChild(card);
      
    });

    

    // Добавление обработчиков событий для кнопок удаления
    const closeButtonElements = document.getElementsByClassName('close-button');
    for (let i = 0; i < closeButtonElements.length; i++) {
      const closeButton = closeButtonElements[i];
      closeButton.addEventListener('click', () => {
        const newsIndex = parseInt(closeButton.getAttribute('data-news-index'));
        this.removeNews(newsIndex);
        this.displayNews(); // Перерисовка новостей после удаления
      });
    }
  }

  

  addNews() {
    const titleInput = document.getElementById('news-title-input');
    const contentTextArea = document.getElementById('news-content-textarea');
    const tagsInput = document.getElementById('news-tags-input');
    let username = getCookie("username");
    if(username){
    username = new TextDecoder().decode(base64ToBytes(username));
    }
    const title = titleInput.value;
    const content = contentTextArea.value;
    const tags = tagsInput.value.split(' ');
    const news = {
      title: title,
      content: content,
      tags: tags,
      username: username,
      date: new Date().toLocaleDateString(),
    };
    console.log(username);
    console.log(news);
    if(!username)
    {
      alert("You should sign in before!");
      return;
    }
    // Отправка POST-запроса на сервер для сохранения новости
    fetch('/news', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(news)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Новость успешно сохранена:', data);
        console.log(this);
        // Добавление новости в массив новостей
        this.newsArray.push(data);

        // Очистка полей ввода
        titleInput.value = '';
        contentTextArea.value = '';
        tagsInput.value = '';

        // Обновление новостей на экране
        this.displayNews();
      })
      .catch(error => {
        console.error('Ошибка при сохранении новости', error);
      });
  }

  removeNews(index) {
    if (index >= 0 && index < this.newsArray.length) {
      // const newsId = this.newsArray[index]._id;
      const newsId = this.newsArray[index].id;
      console.log(index);
//удаление новости по ЛОГИНУ
      const username = getCookie("username");
      if(!news.username)
    {
      alert("You should sign in before!");
      return;
    }
      
      fetch(`/news/${newsId}`, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(data => {
          console.log('Новость успешно удалена:', data);
          // Удаление новости из массива новостей
          this.newsArray.splice(index, 1);

          // Обновление новостей на экране
          this.displayNews();
        })
        .catch(error => {
          console.error('Ошибка при удалении новости', error);
        });
    }
  }

  sortNewsByDate() {
    this.newsArray.sort((a, b) => b.date - a.date);
  }

  searchNewsByTag(tag) {
    return this.newsArray.filter((news) => news.tags.includes(tag));
  }

  
}

// Приклад використання класу
const newsFeed = new NewsFeed();


document.addEventListener("DOMContentLoaded", ()=>{
fetch('/news')
.then(response => response.json())
.then(data => {
  // Добавление полученных новостей в массив новостей
  newsFeed.newsArray = data;

  // Вывод всех новостей на экран
  newsFeed.displayNews();
})
.catch(error => {
  console.error('Ошибка при получении новостей', error);
});
let submitBtn = document.getElementById("send_form");

submitBtn.addEventListener("click", (e)=>{
  newsFeed.addNews()});

});

function removeNewsFrom(index) {

    const newsId = index;
    console.log(index);
    
    fetch(`/news/${newsId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        console.log('Новость успешно удалена:', data);
        // Удаление новости из массива новостей

        // Обновление новостей на экране
        location = "/";
      })
      .catch(error => {
        console.error('Ошибка при удалении новости', error);
      });
  }

  
  function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
function base64ToBytes(base64) {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

function bytesToBase64(bytes) {
  const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join("");
  return btoa(binString);
}
function base64ToBytes(base64) {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}