import express from 'express';
import path from 'path';

import {logLineSync} from '../utils/logging.js'
import {escapeHTML} from '../utils/html.js';
import {loginValidator, passwdValidator} from '../validators/common.js';

const webserver = express();
const port = 3095;
const logFN = path.join(__dirname, '_server.log');

webserver.get('/form', (req, res) => {
  logLineSync(logFN,`[${port}] /form called, get pars: ${JSON.stringify(req.query)}`);

  const login = escapeHTML(req.query.login); 
  const passwd = escapeHTML(req.query.passwd); 

  if(login || passwd) {
    const errors = [...loginValidator(login), ...passwdValidator(passwd)];
    if(errors.length)
      res.send(createHTMLForm(login, passwd, errors.join('\n')));
    else
      res.send(createHTMLSuccessGreeting(login));

  } else {
    res.send(createHTMLForm());
  }
});

function createHTMLForm(login = '', passwd = '', errorText = '') {

  return (
    `<form method="GET" action="/form">
      <label for="login">Name</label>
      <input 
        type="text" id="login" name="login"
        value="${login}"
      >

      <label for="passwd">Password</label>
      <input 
        type="password" id="passwd" name="passwd"
        value="${passwd}"
      >

      <button>Submit</button>
      <div style="color:crimson; white-space: pre">${errorText}</div>
    </form`
  );
}

function createHTMLSuccessGreeting(login) {

  return (
    `<div style="color: LightGreen;">Successfully logged in as <b>${login}<b/></div>`
  );
}

webserver.listen(port, () => console.log(`webserver is running on port ${port}`));
