const urlParams = new URLSearchParams(window.location.search);
const caller = urlParams.get('caller');

import { PGlite } from 'https://cdn.jsdelivr.net/npm/@electric-sql/pglite@0.2.15/dist/index.js';


let pglite;
let isInitialized = false;
let solution_string = '';

// Load data from a SQL file(string) and execute the commands
export async function loadData(sqlCommandsString) {
  if (!sqlCommandsString) {
    console.error('No SQL commands provided.');
    return;
  }

  try {
    sqlCommandsString = String(sqlCommandsString);

    if (!isInitialized) {
      pglite = new PGlite();
      isInitialized = true;
    }

    // Split the input string into individual SQL commands
    const commands = sqlCommandsString
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);

    const batchSize = 50; // Adjust batch size as needed
    for (let i = 0; i < commands.length; i += batchSize) {
      const batchCommands = commands.slice(i, i + batchSize);

      for (const command of batchCommands) {
        if (command) {
          try {
            await pglite.query(command);
          } catch (cmdError) {
            console.error('Error executing command:', command, cmdError);
          }
        }
      }

      // Yield control to the event loop to keep the UI responsive
      await new Promise(resolve => setTimeout(resolve, 0));
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

// Initialize the database and load data when the DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await specificLoad();
  } catch (err) {
    console.error('Error during initialization:', err);
  }
});

// Determine the specific data to load based on the caller
async function specificLoad() {
  if (caller === "index") {
    try {
      const response = await fetch('sql/mock_database.sql');
      if (!response.ok) {
        throw new Error(`Failed to load SQL file: ${response.statusText}`);
      }
      const sqlString = await response.text();
      await loadData(sqlString);
    } catch (err) {
      console.error('Error loading SQL file:', err);
    }
  } else 
  {
    try {
      let link;
      switch (caller) {
        case "1":
          link = await extrapolateData(1);
          break;
        case "2":
          link = await extrapolateData(2);
          break;
        case "3":
          link = await extrapolateData(3);
          break;
        case "4":
          link = await extrapolateData(4);
          break;
        case "5":
          link = await extrapolateData(1);
          break;
        case "6":
          link = await extrapolateData(2);
          break;
        case "7":
          link = await extrapolateData(3);
          break;
        case "8":
          link = await extrapolateData(4);
          break;
        case "9":
          link = await extrapolateData(3);
          break;
        case "10":
          link = await extrapolateData(4);
          break;

        default:
          window.location.href = 'index.html?caller=index';
      }
      await loadData(link);
      await SetSolution(parseInt(caller, 10));
    } catch (err) {
      console.error('Error processing level data:', err);
    }
  }
}

// Extrapolate and autopopulate data for each level
async function extrapolateData(lvl) {
  // Level 1 ----------------------------------------------------------------------------------
  if (lvl === 1) {
    let fileUrl = 'sql/level1.sql';
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      let fileContents = await response.text();
      let colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'black', 'white', 'brown'];
      let sizes = Array.from({ length: 10 }, (_, i) => i + 1);
      let weights = Array.from({ length: 21 }, (_, i) => parseFloat((1 + i * 0.1).toFixed(1)));

      // Generate values list 
      let valuesList = Array.from({ length: 10000 }, () => {
        let color = colors[Math.floor(Math.random() * colors.length)];
        let size = sizes[Math.floor(Math.random() * sizes.length)];
        let weight = weights[Math.floor(Math.random() * weights.length)];
        return `('${color}', ${size}, ${weight})`;
      }).join(',\n');

      let insertStatement = `INSERT INTO Marble (Color, Size, Weight) VALUES\n${valuesList};`;

      return fileContents + '\n' + insertStatement;
    } catch (error) {
      console.error('Error:', error);
      return '';
    }
  }

  // Level 2 ----------------------------------------------------------------------------------
  if (lvl === 2) {
    let fileUrl = 'sql/level2.sql';
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      let fileContents = await response.text();

      let shapes = ['square', 'star', 'umbrella', 'triangle'];
      let difficulties = Array.from({ length: 100 }, (_, i) => i + 1);
      let valuesList = [];
      let solutionRow = null;

      for (let i = 1; i <= 1000; i++) {
        let shape = shapes[Math.floor(Math.random() * shapes.length)];
        let difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        let isWet = Math.random() < 0.5;

        // Ensure solution row is unique
        if (!solutionRow && shape === 'star' && isWet === true && difficulty === Math.min(...difficulties)) {
          solutionRow = i;
        }

        if (i === 1000 && !solutionRow) {
          // If no solution row was created, make this the solution row
          shape = 'star';
          difficulty = Math.min(...difficulties);
          isWet = true;
          solutionRow = i;
        }

        valuesList.push(`(${i}, '${shape}', ${difficulty}, ${isWet})`);
      }

      let insertStatement = `INSERT INTO Honeycomb (id, Shape, Difficulty, iswet) VALUES\n${valuesList.join(',\n')};`;

      return fileContents + '\n' + insertStatement + `\n-- Solution ID: ${solutionRow}`;
    } catch (error) {
      console.error('Error:', error);
      return '';
    }
  }

  return '';
}


async function SetSolution(lvl) {
  if (lvl === 1) {
    const sql_query = `
      SELECT COUNT(*) AS count 
      FROM marble 
      WHERE color = 'red' 
        AND weight <= 2 
        AND size <= 5;
    `;
    
    try {
      // Execute the query using the utility function
      const result = await query(sql_query);
      
      // Check if the result has the expected structure
      if (result.length > 0 && result[0].values.length > 0) {
        const count = result[0].values[0][0];
        solution_string = String(count);
      } else {
        console.error('No rows returned from the count query.');
        solution_string = '0';
      }
    } catch (err) {
      console.error('Error executing count query:', err);
      solution_string = '0';
    }
  }  
  
  else if (lvl === 2) {
    const sql_query = `
      SELECT id 
      FROM Honeycomb 
      WHERE Shape = 'star' 
        AND iswet = true 
      ORDER BY Difficulty ASC 
      LIMIT 1;
    `;
    
    try {
      // Execute the query using the utility function
      const result = await query(sql_query);
      
      // Check if the result has the expected structure
      if (result.length > 0 && result[0].values.length > 0) {
        const id = result[0].values[0][0];
        solution_string = String(id);
      } else {
        console.error('No rows returned from the solution query.');
        solution_string = '0';
      }
    } catch (err) {
      console.error('Error executing solution query:', err);
      solution_string = '0';
    }
  }
}


function NextLevel() 
{
  let currentLevel = parseInt(caller, 10);
  currentLevel++;
  if (localStorage.getItem('currentLevel') < currentLevel) 
  {
    localStorage.setItem('currentLevel', currentLevel);
  }
}

// Query utility function
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
    // Split the input string into individual SQL commands
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0);

    let lastResult;
    for (const command of commands) {
      if (command) {
        try {
          lastResult = await pglite.query(command);
        } catch (cmdError) {
          console.error('Error executing command:', command, cmdError);
          throw cmdError; // Rethrow the error to be caught below
        }
      }
    }

    const result = lastResult;

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

// Datatable utility function
function datatable(data) {
    var tbl = document.createElement("table");
    tbl.className = 'datatable';

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
    const rowLimit = 20;
    const totalRows = data[0]['values'].length;
    
    // Only show up to 20 rows
    for (var row_idx = 0; row_idx < Math.min(rowLimit, totalRows); row_idx++) {
        var body_row = tbody.insertRow();
        for (var header_idx in header_labels) {
            var body_cell = body_row.insertCell();
            body_cell.appendChild(document.createTextNode(data[0]['values'][row_idx][header_idx]));
        }
    }
    tbl.appendChild(tbody);

    // Create a container div to hold both table and message
    var container = document.createElement('div');
    container.appendChild(tbl);

    // Add message if there are more than 20 rows
    if (totalRows > rowLimit) {
        var message = document.createElement('div');
        message.style.marginTop = '10px';
        message.style.fontStyle = 'italic';
        message.style.color = '#666';
        message.textContent = `Output limited to ${rowLimit} rows (${totalRows} total rows)`;
        container.appendChild(message);
    }

    return container;
}

// Set difference utility function
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
  shouldDisableCloning(text) {
      return text.includes('--clone=false');
  }

  cleanSQLForExecution(text) {
      return text.replace(/--.*$/gm, '').trim();
  }

  constructor() {
      super();
  }

  connectedCallback() {
      var question = this.getAttribute('data-question') || '';
      var comment = this.getAttribute('data-comment') || '';
      var defaultText = this.getAttribute('data-default-text') || '';
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
      var form = document.createElement('form');
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
          
          result_div.style.overflow = 'hidden';
          
          var handleSubmit = async (submission_data) => {
              result_div.className = 'returnOkay';
          
              var expected_value = this.getAttribute('data-solution') || solution_string || '';
          
              try {
                  let user_solution_result = await query('SELECT value FROM solution WHERE "user" = 1;');
          
                  var verdict_div = document.createElement('div');
          
                  verdict_div.style.fontWeight = '800';
                  verdict_div.style.fontSize = '1.2em';
                  verdict_div.style.color = '#ED1C24';
          
                  result_div.appendChild(verdict_div);
          
                  if (user_solution_result.length > 0 && user_solution_result[0].values.length > 0) {
                      var user_value = user_solution_result[0].values[0][0];
                  
                      if (user_value == expected_value) {
                          verdict_div.innerText = 'Congratulations! That\'s the correct answer!';
                  
                          const buttonDiv = document.createElement('div');
                          buttonDiv.style.textAlign = 'left';
                          buttonDiv.style.margin = '0';
                          buttonDiv.style.padding = '0';
                  
                          const link = document.createElement('a');
                          link.href = 'play.html?caller=' + (parseInt(caller, 10) + 1);
                          link.style.textDecoration = 'none';
                          
                          const button = document.createElement('button');
                          button.style.padding = '0';
                          button.style.width = '30vw';
                          button.style.minWidth = '200px';
                          button.style.height = '5vh';
                          button.style.minHeight = '20px';
                          button.style.maxHeight = '50px';
                          button.style.borderRadius = '12px';
                          button.style.backgroundColor = '#ED1C24';
                          button.style.color = 'white';
                          button.style.border = 'none';
                          button.style.cursor = 'pointer';
                          button.style.marginTop = '16px';
                          button.style.marginBottom = '16px';
                  
                          const buttonText = document.createElement('b');
                          const p = document.createElement('p');
                          p.style.margin = '0';
                          p.style.padding = '0';
                          p.style.fontSize = 'x-large';
                          p.innerText = 'Next Level';
                  
                          buttonText.appendChild(p);
                          button.appendChild(buttonText);
                          link.appendChild(button);
                          buttonDiv.appendChild(link);
                  
                          verdict_div.appendChild(buttonDiv);
                  
                          button.addEventListener('click', function() {
                              window.location.href = link.href;
                          });
                  
                          NextLevel();
                      } else {
                          verdict_div.innerText = 'Sorry! You got it wrong. Try again!';
                      }
                  
                      await query('DELETE FROM solution;');
                  }
              } catch (err) {
                  console.error('Error checking solution:', err);
              }
          
              if (submission_data.length > 0) {
                  result_div.appendChild(datatable(submission_data));
              } else {
                  result_div.insertAdjacentHTML("beforeend", `No data returned`);
              }
          };
          
          var handleError = (e) => {
              result_div.className = 'returnError';
              result_div.style.fontWeight = '600';
              result_div.style.color = '#ED1C24';
              result_div.innerText = e.message;
          };
          
          try {
              const cleanedQuery = this.cleanSQLForExecution(editor.getValue());
              const results = await query(cleanedQuery);
              await handleSubmit(results);
          } catch (err) {
              handleError(err);
          }
          
          outputBox.innerHTML = '';
          outputBox.appendChild(result_div);

          if (!form.querySelector('.new-input-area') && !this.shouldDisableCloning(editor.getValue())) {
              createNewCell();
          }
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

      // Function to create new cell
      const createNewCell = () => {
          var newInputArea = document.createElement('div');
          newInputArea.className = 'sqlExInputArea new-input-area';

          var newTextArea = document.createElement('textarea');
          newTextArea.name = 'input';
          newTextArea.value = '\n\n\n';
          newInputArea.appendChild(newTextArea);

          var newEditor = CodeMirror.fromTextArea(newTextArea, {
              mode: 'text/x-sql',
              indentWithTabs: true,
              smartIndent: true,
              lineNumbers: true,
              textWrapping: false,
              autoRefresh: true,
              theme: 'neat',
              viewportMargin: Infinity
          });

          newEditor.setSize('100%', 'auto');
          
          var newRunButton = document.createElement('input');
          newRunButton.className = 'sql-exercise-submit';
          newRunButton.type = 'submit';
          newRunButton.value = 'Run ↓';
          newInputArea.appendChild(newRunButton);

          var newResetButton = document.createElement('input');
          newResetButton.type = 'button';
          newResetButton.value = 'Reset';
          newInputArea.appendChild(newResetButton);

          var newOutputArea = document.createElement('div');
          newOutputArea.className = 'sqlExOutputArea';
          var newOutputBox = document.createElement('output');
          newOutputBox.name = 'output';
          newOutputArea.appendChild(newOutputBox);

          form.appendChild(newInputArea);
          form.appendChild(newOutputArea);

          newResetButton.onclick = () => {
              newEditor.setValue('\n\n\n');
              newOutputBox.innerHTML = '';
          };

          newRunButton.onclick = async (e) => {
              e.preventDefault();
              var new_result_div = document.createElement('div');
              new_result_div.style.overflow = 'hidden';

              try {
                  const cleanedQuery = this.cleanSQLForExecution(newEditor.getValue());
                  const results = await query(cleanedQuery);
                  if (results.length > 0) {
                      new_result_div.className = 'returnOkay';
                      new_result_div.appendChild(datatable(results));
                  } else {
                      new_result_div.className = 'returnOkay';
                      new_result_div.insertAdjacentHTML("beforeend", `No data returned`);
                  }
              } catch (err) {
                  new_result_div.className = 'returnError';
                  new_result_div.style.fontWeight = '600';
                  new_result_div.style.color = '#ED1C24';
                  new_result_div.innerText = err.message;
              }

              newOutputBox.innerHTML = '';
              newOutputBox.appendChild(new_result_div);

              if ((!newOutputArea.nextElementSibling || !newOutputArea.nextElementSibling.classList.contains('sqlExInputArea')) 
                  && !this.shouldDisableCloning(newEditor.getValue())) {
                  createNewCell();
              }
          };

          newEditor.refresh();
      };

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