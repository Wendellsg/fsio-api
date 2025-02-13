import { Injectable } from '@nestjs/common';

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  
  <title>Document</title>
  </head>
  <body>
    
    <h1>Fsio-api</h1>
    <p>API for the fsio project</p>
    </body>
    </html>
    `;

@Injectable()
export class AppService {
  getHello(): string {
    return html;
  }
}
