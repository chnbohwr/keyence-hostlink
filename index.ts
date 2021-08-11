import * as Net from 'net';

type LinkResult = {
  message: Buffer,
  address: string,
  result: string,
  resultBuffer: Buffer,
}

type CallbackResult = (error: boolean, linkResult: LinkResult) => void

type QueueArr = {
  message: Buffer,
  address: string,
  callback: CallbackResult,
}[]

class Hostlink {
  connection: Net.Socket;
  timeout: number;
  queue:QueueArr = [];
  constructor(options: Net.NetConnectOpts, timeout = 1000) {
    this.timeout = timeout;
    const connection = Net.createConnection(options);
    this.connection = connection;
    connection.on('data', this.onData);
    connection.on('error', this.onError);
  }
  private onData(data: Buffer){
    console.log(data);
  }
  private onError(){
    console.log('error');
    process.exit();
  }
  private run() { 
    const {message} = this.queue[0];
    this.connection.write(message);
  }
  readItem(address: string, callback: CallbackResult) {
    const message = Buffer.from(`RD ${address.trim()}\r\n`);
    const queueData = { callback, message, address };
    this.queue.push(queueData);
    this.run();
  }
}

export default Hostlink;