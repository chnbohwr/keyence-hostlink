const { Hostlink } = require('./dist/index');

const link = new Hostlink({ timeout: 1000, host: '192.168.3.100', port: 8501 });


let id = 0;
setInterval(() => {

  link.readItem(`DM${id}`, (err, data) => {
    console.log('DM0 ==========success');
    console.log(err, data);
  });
  id += 2;
}, 100);
