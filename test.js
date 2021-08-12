const { Hostlink } = require('./dist/index');

const link = new Hostlink({ timeout: 1000, host: '192.168.3.100', port: 8501 });

link.connect(() => {
  link.readItem('DM0', (error, data) => {
    console.log(error, data);
    process.exit();
  });
});

// console here
// false {
//   message: <Buffer 52 44 20 44 4d 30 0d 0a>,
//   address: 'DM0',
//   result: '00011\r\n',
//   resultBuffer: <Buffer 30 30 30 31 31 0d 0a>
// }