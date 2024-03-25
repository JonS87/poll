const pollTitle = document.getElementById('poll__title');
const pollAnswers = document.getElementById('poll__answers');
const xhr = new XMLHttpRequest()
const xhr2 = new XMLHttpRequest()

xhr.addEventListener('readystatechange', () => {
  if (xhr.readyState === xhr.DONE) {
    let response = JSON.parse(xhr.responseText);

    pollTitle.textContent = response['data']['title'];
    //console.log(response);
    for (let item in response['data']['answers']) {
      pollAnswers.insertAdjacentHTML('beforeend', `
        <button class='poll__answer' data-id=${item}>
          ${response['data']['answers'][item]}
        </button>
      `);
    };

    const pollAnswer = document.querySelectorAll('.poll__answer');
    pollAnswer.forEach((item) => {
      item.addEventListener('click', () => {
        xhr2.addEventListener('readystatechange', () => {
          if (xhr2.readyState === xhr2.DONE) {
            let res = JSON.parse(xhr2.responseText)['stat'];
            
            pollAnswer.forEach((itemDelete) => {
              itemDelete.remove();
            });

            let result = res.reduce((acc, item) => {
              acc += parseFloat(item['votes']);
              return acc;
            }, 0);

            for (let item in res) {
              pollAnswers.insertAdjacentHTML('beforeend', `
                <div class='poll__answer' data-id=${item}>
                  ${res[item]['answer']}: <b>${(parseFloat(res[item]['votes']) / result * parseFloat(100)).toFixed(2)}%</b>
                </div>
              `);
            };

            console.log(res);
          }
        });

        xhr2.open('POST', 'https://students.netoservices.ru/nestjs-backend/poll');
        xhr2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr2.send(`vote=${response['id']}&answer=${item.getAttribute('data-id')}`)
        alert('Спасибо, ваш голос засчитан!');
      });
    });
  }
})

xhr.open('GET', 'https://students.netoservices.ru/nestjs-backend/poll')
xhr.send()