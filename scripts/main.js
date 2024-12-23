const scriptUrl = new URL(import.meta.url);
const caller = scriptUrl.searchParams.get('caller');

import { PGlite } from 'https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.2.15/dist/index.js';


let pglite; // Global instance
let isInitialized = false;

export async function loadData(sqlFile) {
  if (!sqlFile) { return; }

  try {
    if (!isInitialized) {
      pglite = new PGlite();
      isInitialized = true;
    }

    const response = await fetch(sqlFile);
    if (!response.ok) {
      throw new Error(`Failed to load SQL file: ${response.statusText}`);
    }
    
    const sqlCommands = await response.text();

    const commands = sqlCommands
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);

    for (const command of commands) {
      if (command) {  // Only execute non-empty commands
        try {
          await pglite.query(command);
        } catch (cmdError) {
          console.error('Error executing command:', command, cmdError);
        }
      }
    }

    try {
      const testResult = await pglite.query('SELECT 1');
      if (testResult) {
        console.log('DB initialization successful');
        document.querySelectorAll("input.sql-exercise-submit")
          .forEach(button => { button.disabled = false; });
      }
    } catch (testError) {
      console.error('Test query failed:', testError);
    }

  } catch (err) {
    console.error('DB initialization failed:', err);
  }
}

// Make sure the DOM is loaded before initializing
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await specificLoad();
  } catch (err) {
    console.error('Error during initialization:', err);
  }
});

function specificLoad()
{
  if (caller == "index"){loadData('sql/mock_database.sql')}
  else
  {
    //Implement functionality to load different databases for level template
  }
}

async function query(sql, successCallback, errorCallback) {
  if (!pglite || !isInitialized) {
    const error = new Error('Database not initialized');
    if (errorCallback) {
      errorCallback(error);
      return;
    }
    throw error;
  }

  try {
    const result = await pglite.query(sql);
    
    // Transform PGlite result to match the expected format
    const transformedResult = [{
      columns: result.fields ? result.fields.map(f => f.name) : [],
      values: result.rows ? result.rows.map(row => Object.values(row)) : []
    }];

    if (successCallback) {
      successCallback(transformedResult);
    }
    return transformedResult;
  } catch (err) {
    console.error('Query error:', err);
    if (errorCallback) {
      errorCallback(err);
      return;
    }
    throw err;
  }
}

// Transform PGLite results to match sql.js format
function transformResult(pgliteResult) {
  if (!pgliteResult || !pgliteResult.rows) {
    return [{ columns: [], values: [] }];
  }

  const columns = Object.keys(pgliteResult.rows[0] || {});
  const values = pgliteResult.rows.map(row => 
    columns.map(col => row[col])
  );

  return [{
    columns: columns,
    values: values
  }];
}

// Datatable function remains the same
function datatable(data) {
  var tbl = document.createElement("table");
  tbl.className = 'datatable'

  var header_labels = data[0].columns;
  for (var idx in header_labels) {
    var col = document.createElement('col');
    col.className = header_labels[idx];
    tbl.appendChild(col);
  }

  // create header row
  var thead = tbl.createTHead();
  var row = thead.insertRow(0);
  for (var idx in header_labels) {
    var cell = row.insertCell(idx);
    cell.innerHTML = header_labels[idx];
  }

  // fill table body
  var tbody = document.createElement("tbody");
  for (var row_idx in data[0]['values']) {
    var body_row = tbody.insertRow();
    for (var header_idx in header_labels) {
      var body_cell = body_row.insertCell();
      body_cell.appendChild(document.createTextNode(data[0]['values'][row_idx][header_idx]));
    }
  }
  tbl.appendChild(tbody);
  return tbl;
}

// Set difference utility function remains the same
function setdiff(a, b) {
  var seta = new Set(a);
  var setb = new Set(b);
  var res = new Set([...seta].filter(x => !setb.has(x)));
  return res;
}

// SQL Quiz Component
class sqlQuizOption extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    var value = this.getAttribute('data-value') || ''
    var statement = this.getAttribute('data-statement') || '';
    var dataCorrect = this.getAttribute('data-correct') || false;
    var hint = this.getAttribute('data-hint') || '';

    var quizoption = `
    <div class='sqlOption'>
      <label>
        <input type=checkbox name="input"
            data-correct=${dataCorrect}
            value=${value} />
          <div class="optionText">
            ${statement}
            <div class="hintSpan">${hint}</div>
          </div>
      </label>
    </div>
    `
    this.parentNode.querySelector('.sqlQuizOptions').insertAdjacentHTML("beforeend", quizoption);
  }
}

customElements.define('sql-quiz-option', sqlQuizOption);

class sqlQuiz extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    var title = this.getAttribute('data-title') || '';
    var description = this.getAttribute('data-description') || '';

    var homeDiv = document.createElement('div');
    homeDiv.className = 'sqlQuizHomeDiv';

    if (title) {
      var caption = `<div class="sqlQuizTitle">${title}</div>`;
      homeDiv.insertAdjacentHTML("beforeend", caption);
    }

    if (description) {
      var commentbox = `
      <div class="sqlQuizDescription">
        ${description}
      </div>
      `
      homeDiv.insertAdjacentHTML("beforeend", commentbox);
    }

    var form = document.createElement('form');

    // Input Area
    var inputArea = document.createElement('div');
    inputArea.className = 'sqlQuizInputArea';

    var options = document.createElement('div');
    options.className = 'sqlQuizOptions';
    inputArea.appendChild(options);

    var submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Check Answers';
    inputArea.appendChild(submitButton);

    var hintButton = document.createElement('input');
    hintButton.name = "hint";
    hintButton.type = "button";
    hintButton.value = "Show Explanations";
    hintButton.onclick = (e) => {
      document.querySelectorAll('.hintSpan').forEach(i => i.style.display = 'table-row');
    };
    inputArea.appendChild(hintButton);
    form.appendChild(inputArea);

    // Output Area
    var outputArea = document.createElement('div');
    outputArea.className = 'sqlQuizOutputArea';

    var outputBox = document.createElement('output');
    outputBox.name = 'output';
    outputArea.appendChild(outputBox);

    form.appendChild(outputArea);
    form['onsubmit'] = (e) => {
      e && e.preventDefault();
      var value = Array.prototype.filter.call(form.input, i => i.checked).map(i => i.value);
      var correct = Array.prototype.filter.call(form.input, i.dataset.correct === "true").map(i => i.value);
      var mistakes = setdiff(correct, value).size + setdiff(value, correct).size;
      var res = mistakes >= 2 ? mistakes + " mistakes" :
          mistakes == 1 ? mistakes + " mistake" : "All correct!"
      form.output.innerHTML = `<div class='returnOkay'>${res}</div>`;
    };

    homeDiv.append(form);
    this.append(homeDiv);
  }
}

customElements.define('sql-quiz', sqlQuiz);

// SQL Exercise Component
class sqlExercise extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    var question = this.getAttribute('data-question') || '';
    var comment = this.getAttribute('data-comment') || '';
    var defaultText = this.getAttribute('data-default-text') || '';
    var solution = this.getAttribute('data-solution') || '';
    var orderSensitive = this.getAttribute('data-orderSensitive') || false;

    var homeDiv = document.createElement('div');
    homeDiv.className = 'sqlExHomeDiv';

    if (question) {
      var caption = `<div class="sqlExQuestion">${question}</div>`;
      homeDiv.insertAdjacentHTML("beforeend", caption);
    }

    if (comment) {
      var commentbox = `<div class = 'sqlExComment'>${comment}</div>`;
      homeDiv.insertAdjacentHTML("beforeend", commentbox);
    }

    var form = document.createElement('form');

    // Input Area
    var inputArea = document.createElement('div');
    inputArea.className = 'sqlExInputArea';

    var textArea = document.createElement('textarea');
    textArea.textContent = defaultText;
    textArea.name = 'input';
    inputArea.appendChild(textArea);

    var editor = CodeMirror.fromTextArea(textArea, {
      mode: 'text/x-sql',
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      textWrapping: false,
      autoRefresh: true,
      theme: 'neat',
      viewportMargin: Infinity
    });

    editor.setSize('100%', 'auto');
    editor.refresh();

    var runButton = `<input class="sql-exercise-submit" type="submit" value="Run &#x21e9;" disabled>`;
    inputArea.insertAdjacentHTML("beforeend", runButton);

    form['onsubmit'] = async (e) => {
      e && e.preventDefault();
      var result_div = document.createElement('div');

      var handleSubmit = async (submission_data) => {
        result_div.className = 'returnOkay';

        if (solution) {
          var verdict_div = document.createElement('div');
          result_div.appendChild(verdict_div);

          try {
            const solution_data = await query(solution);
            var submission_u = submission_data[0].values;
            var solution_u = solution_data[0].values;
            if (!orderSensitive) {
                submission_u.sort();
                solution_u.sort();
            }
            var verdict = arraysEqual(submission_u, solution_u) ? "Correct" : "Incorrect";
            verdict_div.innerText = verdict;
          } catch (err) {
            console.error('Error checking solution:', err);
            verdict_div.innerText = 'Error checking solution';
          }
        }
        
        if (submission_data.length > 0) {
          result_div.appendChild(datatable(submission_data));
        } else {
          result_div.insertAdjacentHTML("beforeend", `No data returned`);
        }
      }

      var handleError = (e) => {
        result_div.className = 'returnError';
        result_div.innerText = e.message;
      }

      try {
        const results = await query(editor.getValue());
        await handleSubmit(results);
      } catch (err) {
        handleError(err);
      }
      
      outputBox.innerHTML = '';
      outputBox.appendChild(result_div);
    };

    var resetButton = document.createElement('input');
    resetButton.type = 'button';
    resetButton.value = 'Reset';
    resetButton.onclick = (e) => {
      editor.setValue(defaultText);
      outputBox.textContent = '';
    };
    inputArea.appendChild(resetButton);
    form.appendChild(inputArea);

    // Output Area
    var outputArea = document.createElement('div');
    outputArea.className = 'sqlExOutputArea';

    var outputBox = document.createElement('output');
    outputBox.name = 'output';
    outputArea.appendChild(outputBox);
    form.appendChild(outputArea);

    homeDiv.appendChild(form);
    this.appendChild(homeDiv);
  }
}

customElements.define('sql-exercise', sqlExercise);

function arraysEqual(a,b) {
  if (a instanceof Array && b instanceof Array) {
    if (a.length != b.length) {
      return false;
    }
    for (var i=0; i<a.length; i++) {
      if (!arraysEqual(a[i],b[i]))
        return false;
    }
    return true;
  } else {
    return a == b;
  }
}