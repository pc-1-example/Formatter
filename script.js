// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы DOM
    const formatSelector = document.getElementById('formatSelector');
    const codeInput = document.getElementById('codeInput');
    const outputContainer = document.getElementById('outputContainer');
    const resetButton = document.getElementById('resetButton');

    // Примеры кода для каждого формата
    const examples = {
        'Markdown': `
# Заголовок
Это **жирный** текст, а это *курсив*.

- Элемент списка 1
- Элемент списка 2

[Ссылка на Google](https://google.com)
        `.trim(),
        'Mermaid': `
graph TD;
    A[Начало] --> B{Есть вопрос?};
    B -- Да --> C[Ответить];
    B -- Нет --> D[Завершить];
    C --> D;
        `.trim(),
        'LaTeX': `
Формула Эйлера:
$$e^{i\\pi} + 1 = 0$$

Квадратное уравнение:
$$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$
        `.trim(),
        'PlantUML': `
@startuml
Alice -> Bob: Запрос аутентификации
Bob --> Alice: Ответ
@enduml
        `.trim(),
        'Vega-Lite': `
{
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "description": "Простая гистограмма.",
  "data": {
    "values": [
      {"a": "A", "b": 28}, {"a": "B", "b": 55}, {"a": "C", "b": 43},
      {"a": "D", "b": 91}, {"a": "E", "b": 81}, {"a": "F", "b": 53}
    ]
  },
  "mark": "bar",
  "encoding": {
    "x": {"field": "a", "type": "ordinal"},
    "y": {"field": "b", "type": "quantitative"}
  }
}
        `.trim(),
        'AsciiDoc': `
= Заголовок документа
Автор <author@example.com>

Это пример документа в AsciiDoc.

== Секция

* Элемент списка
* Еще один элемент

[source,python]
----
print("Hello, AsciiDoc!")
----
        `.trim()
    };

    // Функция для рендеринга вывода
    const renderOutput = () => {
        const format = formatSelector.value;
        const code = codeInput.value;
        outputContainer.innerHTML = ''; // Очищаем контейнер

        try {
            switch (format) {
                case 'Markdown':
                    outputContainer.innerHTML = marked.parse(code);
                    break;
                case 'Mermaid':
                    mermaid.render('mermaid-svg', code, (svgCode) => {
                        outputContainer.innerHTML = svgCode;
                    });
                    break;
                case 'LaTeX':
                    outputContainer.innerHTML = code;
                    MathJax.typesetPromise([outputContainer]);
                    break;
                case 'PlantUML':
                    // Для PlantUML нужен сервер, используем официальный
                    const encodedCode = encodeURIComponent(code)
                        .replace(/@/g, '%40') // Простое кодирование для URL
                        .replace(/</g, '%3C').replace(/>/g, '%3E').replace(/&/g, '%26').replace(/ /g, '%20');
                    // Это упрощенная версия кодировщика PlantUML, может не работать для сложных диаграмм
                    // Для надежности лучше использовать полную библиотеку-кодировщик
                    const plantUmlUrl = `http://www.plantuml.com/plantuml/svg/SyfFqR2pk2_GK0000`; // Это заглушка, реальное кодирование сложнее
                    outputContainer.innerHTML = `<p>Для рендеринга PlantUML требуется специальное кодирование. Простой предпросмотр не реализован.</p><p>Код:</p><pre>${code}</pre>`;
                    break;
                case 'Vega-Lite':
                    const spec = JSON.parse(code);
                    vegaEmbed('#outputContainer', spec, { actions: false });
                    break;
                case 'AsciiDoc':
                    const asciidoctor = Asciidoctor();
                    outputContainer.innerHTML = asciidoctor.convert(code);
                    break;
            }
        } catch (error) {
            outputContainer.innerHTML = `<pre style="color: red;">Ошибка рендеринга:\n${error.message}</pre>`;
        }
    };

    // Функция для загрузки примера
    const loadExample = () => {
        const format = formatSelector.value;
        if (examples[format]) {
            codeInput.value = examples[format];
            renderOutput();
        }
    };

    // Заполняем селектор и устанавливаем начальное состояние
    Object.keys(examples).forEach(format => {
        const option = document.createElement('option');
        option.value = format;
        option.textContent = format;
        formatSelector.appendChild(option);
    });

    // Проверяем URL на наличие параметра для выбора формата
    const urlParams = new URLSearchParams(window.location.search);
    const formatFromUrl = urlParams.get('format');
    if (formatFromUrl && examples[formatFromUrl]) {
        formatSelector.value = formatFromUrl;
    }

    // Инициализация
    mermaid.initialize({ startOnLoad: false });
    loadExample();

    // Добавляем обработчики событий
    codeInput.addEventListener('input', renderOutput);
    formatSelector.addEventListener('change', loadExample);
    resetButton.addEventListener('click', loadExample);
});
