# keyence-hostlink

keyence-hostlink is a library that allows communication to KEYENCE PLC by Host link protocol

> this is not a official library

### to install
```
npm i -S keyence-hostlink
```

### example usage
```javascript
const { Hostlink } = require('./dist/index');

const link = new Hostlink({ timeout: 1000, host: '192.168.3.100', port: 8501 });

link.connect(() => {
  link.readItem('DM0', (error, data) => {
    console.log(error, data);
    process.exit();
  });
});
```

then the console will show 

```
false {
  message: <Buffer 52 44 20 44 4d 30 0d 0a>,
  address: 'DM0',
  result: '00011\r\n',
  resultBuffer: <Buffer 30 30 30 31 31 0d 0a>
}
```

### API

#### constructor(options)
create a hostlink instance, `const link = new Hostlink(options)`
- options:Net.NetConnectOpts use Nodejs Net options document is [here](https://nodes.duniter.io/typescript/duniter/typedoc/modules/_net_.html#netconnectopts)


#### connect(callback)
connect to PLC
- callback:function when connect success, it will trigger callback

#### readItem(address, callback)
read a address and trigger callback when it done or timeout
- address:string for example 'DM0'
- callback:(error:boolean, responseData)=>void when read item fail, error will be true.

callback responseData will be follow structure
```
{
  message: Buffer, // request message send to server
  address: string, // address to get
  result: string | null, // server response result string
  resultBuffer: Buffer | null, // server response buffer
  error?: any, // error detail information
}
```

