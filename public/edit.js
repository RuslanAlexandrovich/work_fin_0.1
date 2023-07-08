function editNews() {
    const titleInput = document.getElementById('news-title-input');
    const contentTextArea = document.getElementById('news-content-textarea');
    const tagsInput = document.getElementById('news-tags-input');
    const idInput = document.getElementById('news-id-input');

    const title = titleInput.value;
    const content = contentTextArea.value;
    const tags = tagsInput.value.split(' ');
    const id = idInput.value;

    const news = {
        id: id,
      title: title,
      content: content,
      tags: tags,
      date: new Date().toLocaleDateString(),
    };
    console.log(news);
    // Отправка POST-запроса на сервер для сохранения новости
    fetch(`/news/${news.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(news)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Новость успешно изменена:', data);
        console.log(this);
        // Добавление новости в массив новостей
        document.location.href = "/";
      })
      .catch(error => {
        console.error('Ошибка при сохранении новости', error);
      });
  }
let btn= document.getElementById("send_form");
btn.addEventListener("click", (e)=>{
    e.preventDefault();
    console.log("edit!");
editNews();
  })