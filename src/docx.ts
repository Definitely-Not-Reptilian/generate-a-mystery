import * as PizZip from 'pizzip';
import * as Docxtemplater from 'docxtemplater';
import { readFileSync, writeFileSync } from 'fs';
import { Player } from './player';
import { Game } from './game';

export class DocX {

  generate(game: Game, data: Player) {
    // Get template
    const content = readFileSync('template/input.docx', 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater();
    doc.loadZip(zip);

    doc.setData(data);

    try {
      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      doc.render();
    } catch (error) {
      // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object).
      const e = {
        message: error.message,
        name: error.name,
        stack: error.stack,
        properties: error.properties,
      };
      console.log(JSON.stringify({ error: e }));
      if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors.map((error) => error.properties.explanation)
          .join('\n');
        console.log('errorMessages', errorMessages);
        // errorMessages is a humanly readable message looking like this :
        // 'The tag beginning with "foobar" is unopened'
      }
      throw error;
    }

    const buf = doc.getZip()
      .generate({ type: 'nodebuffer' });

    // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
    writeFileSync(`output/${data.fullName}.docx`, buf);

  }

}
