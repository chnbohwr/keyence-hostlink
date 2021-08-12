import * as Net from 'net';

type LinkResult = {
  message: Buffer,
  address: string,
  result: string | null,
  resultBuffer: Buffer | null,
  error?: any,
}

type CallbackResult = (error: boolean, linkResult: LinkResult) => void

type QueueArr = {
  message: Buffer,
  address: string,
  callback: CallbackResult,
  running: boolean,
}[]

export class Hostlink {
  connection: Net.Socket | undefined;
  queue: QueueArr = [];
  processRunning: boolean = false;
  connectStatus: boolean = false;
  options: Net.NetConnectOpts;
  constructor(options: Net.NetConnectOpts) {
    this.options = options;
  }
  connect(callback: () => void | undefined) {
    const connection = Net.createConnection(this.options, callback);
    this.connection = connection;
    connection.on('data', this.onData.bind(this));
    connection.on('error', this.onError.bind(this));
  }
  private onData(data: Buffer) {
    const queueData = this.queue.shift();
    if (!queueData) { return; }
    const resultData: LinkResult = {
      message: queueData.message,
      address: queueData.address,
      result: data.toString(),
      resultBuffer: data,
    };
    queueData.callback(false, resultData);
  }
  private onError(error: any) {
    console.error('error happen');
    const queueData = this.queue.shift();
    if (!queueData) { return; }
    const resultData: LinkResult = {
      message: queueData.message,
      address: queueData.address,
      result: null,
      resultBuffer: null,
      error,
    };
    queueData.callback(true, resultData);
  }
  private onConnect() {
    this.connectStatus = true;
  }
  private run() {
    if (this.processRunning || !this.connection) { return; }
    this.processRunning = true;
    const queueArr = this.queue.filter((data) => (!data.running));
    if (queueArr.length === 0) { this.processRunning = false; return; }
    const data = queueArr[0];
    this.connection.write(data.message);
    data.running = true;
    this.processRunning = false;
    setTimeout(() => { this.run(); }, 500);
  }
  readItem(address: string, callback: CallbackResult) {
    // if (!this.connectStatus) { console.log('un connect'); }
    const message = Buffer.from(`RD ${address.trim()}\r\n`);
    const queueData = { callback, message, address, running: false };
    this.queue.push(queueData);
    this.run();
  }
}
